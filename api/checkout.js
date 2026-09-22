import { getStripe, taxEnabled, siteUrl } from '../lib/stripe.js';
import { atmLineItems, WIRELESS_TIERS, CatalogError } from '../lib/catalog.js';

const MAX_CART_ITEMS = 10;
const MAX_ATMS_PER_SUBSCRIPTION = 50;

// POST /api/checkout
//   { "type": "atm", "items": [{ "sku": "halo-ii", "cassette": "1k", "addons": ["nfc"] }] }
//   { "type": "wireless", "tier": "standard", "quantity": 2 }
// Responds with { url } for a Stripe-hosted Checkout page.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const params = await buildSessionParams(req.body || {}, getStripe());
    const session = await getStripe().checkout.sessions.create(params);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    if (err instanceof CatalogError) return res.status(400).json({ error: err.message });
    console.error('Checkout session error:', err);
    return res.status(500).json({ error: 'Could not start checkout. Please call (205) 210-8121.' });
  }
}

export async function buildSessionParams(body, stripe) {
  const base = siteUrl();
  const common = {
    success_url: `${base}/pages/order-success.html?session_id={CHECKOUT_SESSION_ID}`,
    ...(taxEnabled() && {
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
    }),
  };

  if (body.type === 'atm') {
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) throw new CatalogError('Your cart is empty.');
    if (items.length > MAX_CART_ITEMS) throw new CatalogError('Too many items in cart.');

    return {
      ...common,
      mode: 'payment',
      integration_identifier: 'ffi_atm_order_rqbvlmex',
      cancel_url: `${base}/pages/buy-atm.html`,
      line_items: items.flatMap(atmLineItems),
      customer_creation: 'always',
      shipping_address_collection: { allowed_countries: ['US'] },
      phone_number_collection: { enabled: true },
      custom_fields: [
        { key: 'business_name', label: { type: 'custom', custom: 'Business name' }, type: 'text', optional: true },
      ],
      invoice_creation: { enabled: true },
    };
  }

  if (body.type === 'wireless') {
    const tier = WIRELESS_TIERS[body.tier];
    if (!tier) throw new CatalogError(`Unknown plan: ${body.tier}`);
    const quantity = Number.parseInt(body.quantity ?? 1, 10);
    if (!(quantity >= 1 && quantity <= MAX_ATMS_PER_SUBSCRIPTION)) {
      throw new CatalogError('Number of ATMs must be between 1 and 50.');
    }

    const prices = await stripe.prices.list({ lookup_keys: [tier.lookupKey], active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) throw new CatalogError('That plan is not available yet.');

    return {
      ...common,
      mode: 'subscription',
      integration_identifier: 'ffi_wireless_sub_ktpdwsna',
      cancel_url: `${base}/pages/wireless-atm.html`,
      line_items: [{
        price: price.id,
        quantity,
        adjustable_quantity: { enabled: true, minimum: 1, maximum: MAX_ATMS_PER_SUBSCRIPTION },
      }],
      phone_number_collection: { enabled: true },
      custom_fields: [
        { key: 'business_name', label: { type: 'custom', custom: 'Business name' }, type: 'text', optional: true },
      ],
    };
  }

  throw new CatalogError('Unknown checkout type.');
}
