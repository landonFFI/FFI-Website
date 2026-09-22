import { getStripe } from '../lib/stripe.js';
import { WIRELESS_TIERS } from '../lib/catalog.js';

// GET /api/wireless-plans: the active wireless membership tiers and their
// monthly prices, read live from Stripe so the page never shows a stale price.
export default async function handler(req, res) {
  try {
    const tiers = Object.entries(WIRELESS_TIERS);
    const prices = await getStripe().prices.list({
      lookup_keys: tiers.map(([, t]) => t.lookupKey),
      active: true,
      expand: ['data.product'],
    });
    const byLookupKey = new Map(prices.data.map((p) => [p.lookup_key, p]));

    const plans = tiers
      .filter(([, t]) => byLookupKey.has(t.lookupKey))
      .map(([key, t]) => {
        const price = byLookupKey.get(t.lookupKey);
        return {
          tier: key,
          name: price.product.name,
          description: price.product.description,
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval,
        };
      });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ plans, portalUrl: process.env.STRIPE_PORTAL_LOGIN_URL || null });
  } catch (err) {
    console.error('Wireless plans error:', err);
    return res.status(500).json({ plans: [], portalUrl: null });
  }
}
