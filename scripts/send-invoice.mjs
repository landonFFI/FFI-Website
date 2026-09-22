// Send a Stripe invoice for a service engagement (consulting, installs, route
// work, etc.). The customer gets an email with a hosted page to pay by card or
// bank transfer.
//
//   STRIPE_SECRET_KEY=rk_test_... npm run stripe:send-invoice -- \
//     --email owner@example.com --name "Acme Gas" \
//     --item "ATM installation:450" --item "Site survey:150" --due-days 15
//
// Add --draft to create it without finalizing or sending.
import { parseArgs } from 'node:util';
import { getStripe, taxEnabled } from '../lib/stripe.js';

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    name: { type: 'string' },
    item: { type: 'string', multiple: true },
    'due-days': { type: 'string', default: '15' },
    memo: { type: 'string' },
    draft: { type: 'boolean', default: false },
  },
});

if (!values.email || !values.item?.length) {
  console.error('Usage: --email <email> [--name <name>] --item "Description:amount" [--item ...] [--due-days 15] [--memo text] [--draft]');
  process.exit(1);
}

const items = values.item.map((raw) => {
  const idx = raw.lastIndexOf(':');
  const description = raw.slice(0, idx).trim();
  const dollars = Number(raw.slice(idx + 1));
  if (idx < 1 || !description || !(dollars > 0)) throw new Error(`Bad --item "${raw}". Use "Description:123.45".`);
  return { description, amount: Math.round(dollars * 100) };
});

const stripe = getStripe();

const existing = await stripe.customers.list({ email: values.email, limit: 1 });
const customer = existing.data[0] ?? await stripe.customers.create({ email: values.email, name: values.name });
if (taxEnabled() && !customer.address) {
  console.warn('Warning: customer has no address on file, so Stripe Tax cannot calculate tax. Add one in the Dashboard.');
}

const invoice = await stripe.invoices.create({
  customer: customer.id,
  collection_method: 'send_invoice',
  days_until_due: Number(values['due-days']),
  pending_invoice_items_behavior: 'exclude',
  ...(values.memo && { description: values.memo }),
  ...(taxEnabled() && { automatic_tax: { enabled: true } }),
});

for (const item of items) {
  await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: invoice.id,
    currency: 'usd',
    amount: item.amount,
    description: item.description,
    tax_code: 'txcd_20030000', // General services. Confirm with your tax advisor.
    tax_behavior: 'exclusive',
  });
}

if (values.draft) {
  console.log(`Draft invoice created: https://dashboard.stripe.com/invoices/${invoice.id}`);
} else {
  await stripe.invoices.finalizeInvoice(invoice.id);
  const sent = await stripe.invoices.sendInvoice(invoice.id);
  console.log(`Invoice ${sent.number} sent to ${values.email}: ${sent.hosted_invoice_url}`);
}
