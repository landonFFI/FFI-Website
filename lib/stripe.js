import Stripe from 'stripe';

let client;

// Lazily create one client per function instance so a missing key fails the
// request, not the module import.
export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client = new Stripe(key, {
      appInfo: { name: 'ffi-website', url: 'https://fordfrontierinvestments.com' },
    });
  }
  return client;
}

// Stripe Tax only collects where you have an active registration. Keep this off
// until a registration exists in Dashboard → Tax → Registrations.
export function taxEnabled() {
  return process.env.STRIPE_TAX_ENABLED === 'true';
}

export function siteUrl() {
  return (process.env.SITE_URL || 'https://fordfrontierinvestments.com').replace(/\/$/, '');
}
