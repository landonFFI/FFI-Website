import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import Stripe from 'stripe';

process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
process.env.SITE_URL = 'https://example.test';

const { atmLineItems, CatalogError } = await import('../lib/catalog.js');
const { buildSessionParams } = await import('../api/checkout.js');
const { default: webhookHandler, handleEvent } = await import('../api/webhook.js');

const fakeStripe = {
  prices: {
    list: async ({ lookup_keys }) => ({
      data: lookup_keys[0] === 'wireless_standard_monthly' ? [{ id: 'price_std' }] : [],
    }),
  },
  checkout: {
    sessions: {
      retrieve: async (id) => ({
        id, mode: 'payment', customer: 'cus_1', subscription: null, invoice: 'in_1',
        customer_details: { email: 'a@b.co', name: 'A B', phone: '+1205' },
        custom_fields: [{ key: 'business_name', text: { value: 'Acme Gas' } }],
        collected_information: { shipping_details: { name: 'A B', address: { state: 'AL' } } },
        amount_total: 278500, total_details: { amount_tax: 0 }, currency: 'usd',
        line_items: { data: [{ description: 'Hyosung Halo II: 1K Cassette', quantity: 1, amount_total: 258500 }] },
      }),
    },
  },
};

test('ATM line items are priced from the server catalog', () => {
  const lines = atmLineItems({ sku: 'halo-ii', cassette: 'dual-2k', options: { lock: 'cencon', nfc: 'nfc' }, quantity: 2 });
  assert.deepEqual(lines.map((l) => l.price_data.unit_amount), [342500, 65000, 47500]);
  assert.deepEqual(lines.map((l) => l.quantity), [2, 2, 2]);
  assert.equal(lines[0].price_data.product_data.name, 'Hyosung Halo II: Dual 2K Cassette');
});

test('unknown SKUs, options, and quantities are rejected', () => {
  assert.throws(() => atmLineItems({ sku: 'nope', cassette: '1k' }), CatalogError);
  assert.throws(() => atmLineItems({ sku: 'halo-ii', cassette: '9k' }), CatalogError);
  assert.throws(() => atmLineItems({ sku: 'halo-ii', cassette: '1k', options: { lcd: '12in-touch' } }), CatalogError);
  assert.throws(() => atmLineItems({ sku: 'halo-ii', cassette: '1k', options: { nfc: 'free' } }), CatalogError);
  assert.throws(() => atmLineItems({ sku: 'halo-ii', cassette: '1k', quantity: 0 }), CatalogError);
  assert.throws(() => atmLineItems({ sku: 'halo-ii', cassette: '1k', quantity: 1.5 }), CatalogError);
});

test('ATM checkout never sets payment_method_types, and tax follows the flag', async () => {
  delete process.env.STRIPE_TAX_ENABLED;
  const params = await buildSessionParams({ type: 'atm', items: [{ sku: 'halo-ii', cassette: '1k' }] }, fakeStripe);
  assert.equal(params.mode, 'payment');
  assert.equal(params.payment_method_types, undefined);
  assert.equal(params.automatic_tax, undefined);
  assert.match(params.success_url, /^https:\/\/example\.test\/pages\/order-success\.html\?session_id=\{CHECKOUT_SESSION_ID\}$/);

  process.env.STRIPE_TAX_ENABLED = 'true';
  const taxed = await buildSessionParams({ type: 'atm', items: [{ sku: 'halo-ii', cassette: '1k' }] }, fakeStripe);
  assert.deepEqual(taxed.automatic_tax, { enabled: true });
  delete process.env.STRIPE_TAX_ENABLED;
});

test('ATM checkout allows more than 10 cart lines, up to Stripe\'s 100 line items', async () => {
  const line = { sku: 'halo-ii', cassette: '1k' };
  const twelve = await buildSessionParams({ type: 'atm', items: Array(12).fill(line) }, fakeStripe);
  assert.equal(twelve.line_items.length, 12);
  const heavy = { sku: 'force', cassette: '1k', options: { 'card-reader': 'anti-skim', lock: 'sg', topper: 'standard', keypad: 'rkt', camera: 'monivision', nfc: 'nfc', programming: 'factory', processing: 'outside' } };
  await assert.rejects(buildSessionParams({ type: 'atm', items: Array(12).fill(heavy) }, fakeStripe), /call \(205\) 210-8121/);
});

test('wireless checkout resolves the price by lookup key', async () => {
  const params = await buildSessionParams({ type: 'wireless', tier: 'standard', quantity: '3' }, fakeStripe);
  assert.equal(params.mode, 'subscription');
  assert.equal(params.line_items[0].price, 'price_std');
  assert.equal(params.line_items[0].quantity, 3);
  await assert.rejects(buildSessionParams({ type: 'wireless', tier: 'premium' }, fakeStripe), /not available yet/);
  await assert.rejects(buildSessionParams({ type: 'wireless', tier: 'standard', quantity: 0 }, fakeStripe), CatalogError);
  await assert.rejects(buildSessionParams({ type: 'atm', items: [] }, fakeStripe), /empty/);
});

test('unpaid (ACH pending) sessions are not reported as paid', async () => {
  const sent = [];
  const notify = async (event, summary) => sent.push(summary);
  const event = (type, payment_status) => ({ id: 'evt_1', type, data: { object: { id: 'cs_1', payment_status } } });

  await handleEvent(event('checkout.session.completed', 'unpaid'), { stripe: fakeStripe, notify });
  await handleEvent(event('checkout.session.async_payment_succeeded', 'paid'), { stripe: fakeStripe, notify });
  await handleEvent(event('checkout.session.completed', 'paid'), { stripe: fakeStripe, notify });
  assert.deepEqual(sent.map((s) => s.status), ['payment_pending', 'paid', 'paid']);
  assert.equal(sent[1].business_name, 'Acme Gas');
});

function fakeRes() {
  return {
    statusCode: 200, headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    send(body) { this.body = body; return this; },
    end() { return this; },
  };
}

test('webhook endpoint verifies the Stripe signature on the raw body', async () => {
  const payload = JSON.stringify({ id: 'evt_2', object: 'event', type: 'product.created', data: { object: {} } });
  const header = new Stripe('sk_test_dummy').webhooks.generateTestHeaderString({ payload, secret: 'whsec_test_secret' });

  const good = Object.assign(Readable.from([Buffer.from(payload)]), { method: 'POST', headers: { 'stripe-signature': header } });
  const res = fakeRes();
  await webhookHandler(good, res);
  assert.equal(res.statusCode, 200);

  const tampered = Object.assign(Readable.from([Buffer.from(payload.replace('evt_2', 'evt_3'))]), { method: 'POST', headers: { 'stripe-signature': header } });
  const res2 = fakeRes();
  await webhookHandler(tampered, res2);
  assert.equal(res2.statusCode, 400);
});
