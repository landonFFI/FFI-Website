import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ATM_CATALOG, fromPrice, publicCatalog, resolveLine } from '../lib/catalog.js';

// The price table from CART-SPEC.md, typed independently of lib/catalog.js.
const SPEC_PRICES = {
  'halo-ii': { '1k': 2585, '2k': 2900, 'dual-1k': 3005, 'dual-2k': 3530 },
  force: { '1k': 2850, '2k': 3165, 'dual-1k': 3270, 'dual-2k': 3795 },
  '2800t': { '2k': 4555, '4k': 5185, '6k': 5815 },
  g2500: { '1k': 2535, '2k': 2800, 'dual-1k': 2905, 'dual-2k': 3480 },
  onyx: { '1k': 2695, '2k': 2960, 'dual-1k': 3065, 'dual-2k': 3640 },
  nova: { '1k': 3535, '2k': 3800, 'dual-1k': 3905, 'dual-2k': 4480 },
  'onyx-w': { '1k': 2965, '2k': 3330 },
  gt300: { '2k': 4630 },
  gt500: { '2k': 7620, '4k': 8460, '6k': 9300 },
};

const SPEC_OPTION_GROUPS = {
  'halo-ii': ['lock', 'keypad', 'topper', 'nfc'],
  force: ['card-reader', 'lock', 'topper', 'keypad', 'camera', 'nfc'],
  '2800t': ['card-reader', 'lock', 'keypad', 'camera'],
  g2500: ['lock', 'topper', 'lcd', 'printer', 'nfc'],
  onyx: ['lock', 'topper', 'lcd', 'printer', 'nfc'],
  'onyx-w': ['lock', 'nfc'],
  nova: ['lock', 'topper', 'nfc'],
  gt300: ['lock', 'rear-panel', 'nfc'],
  gt500: ['lock', 'nfc'],
};

test('every cassette price matches the spec table', () => {
  assert.deepEqual(Object.keys(ATM_CATALOG).sort(), Object.keys(SPEC_PRICES).sort());
  let count = 0;
  for (const [sku, prices] of Object.entries(SPEC_PRICES)) {
    const actual = Object.fromEntries(ATM_CATALOG[sku].cassettes.map((c) => [c.key, c.amount / 100]));
    assert.deepEqual(actual, prices, sku);
    count += Object.keys(prices).length;
  }
  assert.equal(count, 29);
});

test('each model has its own option groups, and every default is free', () => {
  for (const [sku, groups] of Object.entries(SPEC_OPTION_GROUPS)) {
    const product = ATM_CATALOG[sku];
    assert.deepEqual(product.optionGroups.map((g) => g.key), groups, sku);
    for (const g of product.optionGroups) assert.equal(g.choices[0].amount, 0, `${sku} ${g.key} default`);
  }
});

test('NFC is an add-on with factory-install copy wherever it is offered', () => {
  for (const [sku, product] of Object.entries(ATM_CATALOG)) {
    const nfc = product.optionGroups.find((g) => g.key === 'nfc');
    if (!nfc) continue;
    assert.equal(nfc.choices[0].key, 'none', sku);
    assert.ok(nfc.choices[1].amount > 0, sku);
    assert.match(nfc.note, /factory-install/, sku);
  }
});

test('line price is the cassette plus every non-default option', () => {
  const { unitAmount } = resolveLine({ sku: 'g2500', cassette: '2k', options: { lcd: '10in-touch', printer: '3in', nfc: 'nfc' } });
  assert.equal(unitAmount, (2800 + 255 + 150 + 450) * 100);
  assert.equal(resolveLine({ sku: 'gt500', cassette: '2k' }).unitAmount, fromPrice('gt500'));
  assert.equal(fromPrice('gt300'), 463000);
});

test('generated files are up to date with lib/', () => {
  execFileSync(process.execPath, ['scripts/build-store.mjs', '--check'], { stdio: 'pipe' });
  const published = JSON.parse(readFileSync('files/ffi-website/assets/data/catalog.json', 'utf8'));
  assert.deepEqual(published, JSON.parse(JSON.stringify(publicCatalog())));
});
