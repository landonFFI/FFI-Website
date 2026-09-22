# Stripe integration

| Revenue stream | Stripe product | Where |
| --- | --- | --- |
| ATM sales (Halo II configurator) | Payments: hosted Checkout, `mode: payment` | `api/checkout.js`, `assets/js/layout.js` cart |
| Wireless membership (per-ATM, monthly tiers) | Billing: Checkout `mode: subscription` + Customer Portal | `api/checkout.js`, `api/wireless-plans.js`, `pages/wireless-atm.html` |
| Services to companies | Invoicing: emailed invoices, pay by card or ACH | `scripts/send-invoice.mjs` or the Dashboard |
| Sales tax | Stripe Tax, behind `STRIPE_TAX_ENABLED` | `lib/stripe.js` |
| Order notifications | Webhooks forwarded to Make.com | `api/webhook.js` |

Prices live in `lib/catalog.js`. The browser sends option keys only, so nobody can change a price by editing the page. If you change a price on `hyosung-halo-ii.html`, change it in `lib/catalog.js` too.

## Setup (test mode first)

1. **Keys.** Create a sandbox in the Stripe Dashboard. Then create a restricted key (see `.env.example` for permissions) and add the variables from `.env.example` to Vercel for **Preview**.
2. **Payment methods.** Dashboard → Settings → Payment methods: turn on Cards and ACH Direct Debit (US bank account). The code doesn't hard-code a list of payment methods, so Checkout shows whatever you enable there.
3. **Wireless tiers.** Set names and `monthlyAmount` (in cents) in `lib/catalog.js`, then run:
   `STRIPE_SECRET_KEY=sk_test_... npm run stripe:setup-catalog`
   This step needs write access to Products and Prices, so use a secret key or a separate restricted key. The plans section on the wireless page appears once plans exist.
4. **Customer portal.** Dashboard → Settings → Billing → Customer portal. Allow cancel, quantity changes, and payment-method updates, then copy the login link into `STRIPE_PORTAL_LOGIN_URL`.
5. **Webhook.** Dashboard → Developers → Webhooks → Add endpoint `https://<your-domain>/api/webhook` with these events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
6. **Make.com.** Create a scenario with a Custom Webhook trigger and put its URL in `FULFILLMENT_WEBHOOK_URL`. Route by `type` and `status`, and dedupe on `event_id`, because Stripe can send the same event more than once. Only treat an order as paid when `status` is `paid`: bank payments arrive first as `payment_pending`.
7. **Test.** Buy a Halo II with card `4242 4242 4242 4242` and with a test bank account. Subscribe to a wireless tier. Send yourself an invoice:
   `npm run stripe:send-invoice -- --email you@example.com --item "Site survey:150"`
8. **Tax.** Once you're registered (e.g. Alabama), add the registration in Dashboard → Tax → Registrations and set `STRIPE_TAX_ENABLED=true`. Until then, no tax is collected. Have your tax advisor confirm the tax codes in `lib/catalog.js`.
9. **Go live.** Repeat steps 1, 3, 4 and 5 in live mode and put the live values in the Vercel **Production** variables.

## Local checks

`npm install && npm test`
