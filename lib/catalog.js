// Server-side source of truth for prices. This is the only file where ATM
// prices are typed by hand. scripts/build-store.mjs publishes the display
// copy (assets/data/catalog.json, product pages, "from" prices), and checkout
// re-prices every cart line from here, so the browser never supplies amounts.
//
// All amounts are in cents.

// Stripe product tax codes. Confirm these with your tax advisor.
const TAX_CODE_TANGIBLE_GOODS = 'txcd_99999999';

export const BULK_PRICING_THRESHOLD = 10;
export const MAX_QUANTITY_PER_LINE = 99;

// Cassette prices come from the FFI Terminals spreadsheet, Sales tab,
// "Sale Price (ACH)" column. Do not use the neighboring "Our Price (ACH)"
// column; that is wholesale cost.
const cassette = (key, label, dollars) => ({ key, label, amount: dollars * 100 });

// ── PLACEHOLDER ADD-ON PRICING ──────────────────────────────────────────────
// UNCONFIRMED: every add-on amount below is borrowed from NextATM's public
// configurators as a stand-in. These are NOT FFI's distributor (SWYPCO) prices.
// Replace them with confirmed pricing before taking real payments.
// ────────────────────────────────────────────────────────────────────────────
const choice = (key, label, dollars = 0) => ({ key, label, amount: dollars * 100 });

const NFC_NOTE = 'Add now: NFC is cheaper to factory-install than to add later.';

const lockGroup = (sgDollars) => ({
  key: 'lock',
  label: 'Lock',
  choices: [choice('electronic', 'Electronic'), choice('sg', 'S&G', sgDollars), choice('cencon', 'Cencon', 650)],
});
const nfcGroup = (dollars) => ({
  key: 'nfc',
  label: 'NFC Reader',
  note: NFC_NOTE,
  choices: [choice('none', 'No NFC Reader'), choice('nfc', 'NFC Reader', dollars)],
});
const keypadGroup = { key: 'keypad', label: 'Keypad', choices: [choice('standard', 'Standard'), choice('rkt', 'RKT', 50)] };
const hyosungTopperGroup = { key: 'topper', label: 'Topper', choices: [choice('none', 'No Topper'), choice('standard', 'Standard Topper', 90)] };
const cardReaderGroup = { key: 'card-reader', label: 'Card Reader', choices: [choice('emv', 'EMV'), choice('anti-skim', 'Anti-Skim Reader', 715)] };
const cameraGroup = { key: 'camera', label: 'Camera', choices: [choice('none', 'No Camera'), choice('monivision', 'MoniVision Camera', 110)] };
const genmegaTopperGroup = (includedLabel) => ({
  key: 'topper',
  label: 'Topper',
  choices: [choice(includedLabel === 'Integrated' ? 'integrated' : 'none', includedLabel), choice('low', 'Low Topper', 60), choice('mini-high-bright', 'Mini High-Bright Topper', 115)],
});
const printerGroup = { key: 'printer', label: 'Printer', choices: [choice('2in', '2-inch'), choice('3in', '3-inch', 150)] };

const standardCassettes = (b1k, b2k, bd1k, bd2k) => [
  cassette('1k', '1K', b1k), cassette('2k', '2K', b2k), cassette('dual-1k', 'Dual 1K', bd1k), cassette('dual-2k', 'Dual 2K', bd2k),
];

// Photos are hotlinked from the manufacturers. Models without a sourced photo
// have image: null and render a labeled "Photo coming soon" placeholder.
export const ATM_CATALOG = {
  'halo-ii': {
    brand: 'Hyosung', model: 'Halo II', page: 'hyosung-halo-ii.html',
    image: 'https://hyosungamericas.com/wp-content/uploads/2023/06/Hyosung-MX2600SEHALO-2_front-e1689144081681.png',
    cassettes: standardCassettes(2585, 2900, 3005, 3530),
    optionGroups: [lockGroup(350), keypadGroup, hyosungTopperGroup, nfcGroup(460)],
  },
  force: {
    brand: 'Hyosung', model: 'Force', page: 'hyosung-force.html',
    image: 'https://hyosungamericas.com/wp-content/uploads/2023/06/Front-rendering-of-Hyosung-MX2800SE_Force-ATM-e1689143468784.png',
    cassettes: standardCassettes(2850, 3165, 3270, 3795),
    optionGroups: [cardReaderGroup, lockGroup(350), hyosungTopperGroup, keypadGroup, cameraGroup, nfcGroup(460)],
  },
  '2800t': {
    brand: 'Hyosung', model: '2800T', page: 'hyosung-2800t.html',
    image: null,
    cassettes: [cassette('2k', '2K', 4555), cassette('4k', '4K', 5185), cassette('6k', '6K', 5815)],
    optionGroups: [cardReaderGroup, lockGroup(350), keypadGroup, cameraGroup],
  },
  g2500: {
    brand: 'Genmega', model: 'G2500', page: 'genmega-g2500.html',
    image: 'https://www.genmega.com/img/products/G2500/G2500_front.png',
    cassettes: standardCassettes(2535, 2800, 2905, 3480),
    optionGroups: [
      lockGroup(360), genmegaTopperGroup('Integrated'),
      { key: 'lcd', label: 'LCD', choices: [choice('8in', '8" Wide Color'), choice('10in-touch', '10.2" Color Touch', 255)] },
      printerGroup, nfcGroup(450),
    ],
  },
  onyx: {
    brand: 'Genmega', model: 'Onyx', page: 'genmega-onyx.html',
    image: 'https://www.genmega.com/img/products/Onyx/Onyx_front.png',
    cassettes: standardCassettes(2695, 2960, 3065, 3640),
    optionGroups: [
      lockGroup(360), genmegaTopperGroup('Integrated'),
      { key: 'lcd', label: 'LCD', choices: [choice('10in', '10.1" Color'), choice('12in-touch', '12" Color Touch', 420)] },
      printerGroup, nfcGroup(400),
    ],
  },
  'onyx-w': {
    brand: 'Genmega', model: 'Onyx W', page: 'genmega-onyx-w.html',
    image: 'https://www.genmega.com/img/products/OnyxW/OnyxW-front.png',
    cassettes: [cassette('1k', '1K', 2965), cassette('2k', '2K', 3330)],
    optionGroups: [lockGroup(360), nfcGroup(400)],
  },
  nova: {
    brand: 'Genmega', model: 'Nova', page: 'genmega-nova.html',
    image: 'https://www.genmega.com/img/products/Nova/Nova-front.png',
    cassettes: standardCassettes(3535, 3800, 3905, 4480),
    optionGroups: [lockGroup(360), genmegaTopperGroup('No Topper'), nfcGroup(400)],
  },
  // UNCONFIRMED MODEL MATCH: GT300 options are taken from NextATM's GT3000,
  // the closest equivalent. Confirm GT300 = GT3000 before relying on them.
  gt300: {
    brand: 'Genmega', model: 'GT300', page: 'genmega-gt300.html',
    image: null,
    cassettes: [cassette('2k', '2K', 4630)],
    optionGroups: [
      lockGroup(360),
      { key: 'rear-panel', label: 'Rear Service Panel', choices: [choice('none', 'No Rear Service Panel'), choice('rear-panel', 'Rear Service Panel', 300)] },
      nfcGroup(400),
    ],
  },
  // UNCONFIRMED MODEL MATCH: GT500 options are taken from NextATM's GT5000,
  // the closest equivalent. Confirm GT500 = GT5000 before relying on them.
  gt500: {
    brand: 'Genmega', model: 'GT500', page: 'genmega-gt500.html',
    image: null,
    cassettes: [cassette('2k', '2K', 7620), cassette('4k', '4K', 8460), cassette('6k', '6K', 9300)],
    optionGroups: [lockGroup(360), nfcGroup(400)],
  },
};

export function productName(sku) {
  const p = ATM_CATALOG[sku];
  return `${p.brand} ${p.model}`;
}

// Lowest-priced configuration: cheapest cassette, every option at its default.
export function fromPrice(sku) {
  return Math.min(...ATM_CATALOG[sku].cassettes.map((c) => c.amount));
}

// Wireless membership tiers. Each tier is its own Product in Stripe, and its
// monthly Price is found by lookup key. Fill in names and amounts (in cents),
// then run `npm run stripe:setup-catalog`.
export const WIRELESS_TIERS = {
  standard: {
    name: 'Wireless ATM Connectivity: Standard',
    description: 'Cellular connectivity for one ATM, billed monthly.',
    lookupKey: 'wireless_standard_monthly',
    monthlyAmount: null, // TODO: set, e.g. 2500 for $25.00
  },
  premium: {
    name: 'Wireless ATM Connectivity: Premium',
    description: 'Cellular connectivity plus priority support for one ATM, billed monthly.',
    lookupKey: 'wireless_premium_monthly',
    monthlyAmount: null, // TODO: set
  },
};

export class CatalogError extends Error {}

// Resolve a cart line like
//   { sku: 'force', cassette: '2k', options: { lock: 'sg', nfc: 'nfc' }, quantity: 2 }
// into its catalog entries. Options left out use the group's included choice.
export function resolveLine(item) {
  const product = ATM_CATALOG[item?.sku];
  if (!product) throw new CatalogError(`Unknown product: ${item?.sku}`);
  const cassetteChoice = product.cassettes.find((c) => c.key === item.cassette);
  if (!cassetteChoice) throw new CatalogError(`Unknown cassette option: ${item.cassette}`);

  const quantity = item.quantity === undefined ? 1 : Number(item.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
    throw new CatalogError(`Quantity must be between 1 and ${MAX_QUANTITY_PER_LINE}.`);
  }

  const requested = item.options && typeof item.options === 'object' ? item.options : {};
  for (const key of Object.keys(requested)) {
    if (!product.optionGroups.some((g) => g.key === key)) throw new CatalogError(`Unknown option: ${key}`);
  }
  const options = product.optionGroups.map((group) => {
    const key = requested[group.key] ?? group.choices[0].key;
    const picked = group.choices.find((c) => c.key === key);
    if (!picked) throw new CatalogError(`Unknown ${group.label} choice: ${key}`);
    return { group, choice: picked };
  });

  const unitAmount = cassetteChoice.amount + options.reduce((sum, o) => sum + o.choice.amount, 0);
  return { product, cassette: cassetteChoice, options, quantity, unitAmount };
}

// Turn a cart line into Checkout Session line items: the machine at its
// cassette price, plus one line per paid add-on.
export function atmLineItems(item) {
  const { product, cassette: cassetteChoice, options, quantity } = resolveLine(item);
  const name = `${product.brand} ${product.model}`;
  const lines = [priceDataLine(`${name}: ${cassetteChoice.label} Cassette`, cassetteChoice.amount, quantity)];
  for (const { group, choice: picked } of options) {
    if (picked.amount > 0) lines.push(priceDataLine(`${group.label}: ${picked.label} (${name})`, picked.amount, quantity));
  }
  return lines;
}

function priceDataLine(name, unitAmount, quantity) {
  return {
    quantity,
    price_data: {
      currency: 'usd',
      unit_amount: unitAmount,
      tax_behavior: 'exclusive',
      product_data: { name, tax_code: TAX_CODE_TANGIBLE_GOODS },
    },
  };
}

// The browser-safe subset of the catalog, published as assets/data/catalog.json.
export function publicCatalog() {
  const models = {};
  for (const [sku, p] of Object.entries(ATM_CATALOG)) {
    models[sku] = {
      brand: p.brand,
      model: p.model,
      page: p.page,
      image: p.image,
      cassettes: p.cassettes,
      optionGroups: p.optionGroups,
    };
  }
  return { bulkThreshold: BULK_PRICING_THRESHOLD, maxQuantity: MAX_QUANTITY_PER_LINE, models };
}
