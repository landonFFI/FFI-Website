// Create (or update) the wireless membership Products and monthly Prices in
// Stripe from WIRELESS_TIERS in lib/catalog.js. Safe to re-run: an existing
// Price with the same amount is left alone; a changed amount creates a new
// Price and moves the lookup key to it (existing subscribers keep their price).
//
//   STRIPE_SECRET_KEY=sk_test_... npm run stripe:setup-catalog
import { getStripe } from '../lib/stripe.js';
import { WIRELESS_TIERS } from '../lib/catalog.js';

const stripe = getStripe();

for (const [key, tier] of Object.entries(WIRELESS_TIERS)) {
  if (!Number.isInteger(tier.monthlyAmount) || tier.monthlyAmount <= 0) {
    console.log(`Skipping "${key}": set monthlyAmount (in cents) in lib/catalog.js first.`);
    continue;
  }

  const productId = `ffi_wireless_${key}`;
  let product;
  try {
    product = await stripe.products.update(productId, { name: tier.name, description: tier.description });
  } catch (err) {
    if (err.code !== 'resource_missing') throw err;
    product = await stripe.products.create({ id: productId, name: tier.name, description: tier.description });
  }

  const { data: [current] } = await stripe.prices.list({ lookup_keys: [tier.lookupKey], limit: 1 });
  if (current?.unit_amount === tier.monthlyAmount && current.product === product.id && current.active) {
    console.log(`${tier.name}: up to date (${current.id})`);
    continue;
  }

  const price = await stripe.prices.create({
    product: product.id,
    currency: 'usd',
    unit_amount: tier.monthlyAmount,
    recurring: { interval: 'month' },
    tax_behavior: 'exclusive',
    lookup_key: tier.lookupKey,
    transfer_lookup_key: true,
  });
  console.log(`${tier.name}: created ${price.id} at $${(tier.monthlyAmount / 100).toFixed(2)}/month`);
}
