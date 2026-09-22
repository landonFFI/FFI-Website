import { getStripe } from '../lib/stripe.js';

// POST /api/webhook: Stripe event endpoint. Every order, renewal, and failed
// payment is forwarded to FULFILLMENT_WEBHOOK_URL (your Make.com scenario).
// Stripe can deliver an event more than once, so dedupe on `event_id` there.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = getStripe().webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Invalid signature');
  }

  try {
    await handleEvent(event, { stripe: getStripe(), notify });
    return res.status(200).json({ received: true });
  } catch (err) {
    // A non-2xx response makes Stripe retry the event later.
    console.error(`Failed to handle ${event.type} (${event.id}):`, err);
    return res.status(500).send('Handler error');
  }
}

export async function handleEvent(event, { stripe, notify }) {
  const object = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed':
      // Bank debits (ACH) complete here as `unpaid` and settle days later via
      // checkout.session.async_payment_succeeded, so only fulfill paid sessions.
      if (object.payment_status === 'unpaid') {
        return notify(event, { status: 'payment_pending', ...(await sessionSummary(stripe, object.id)) });
      }
      return notify(event, { status: 'paid', ...(await sessionSummary(stripe, object.id)) });

    case 'checkout.session.async_payment_succeeded':
      return notify(event, { status: 'paid', ...(await sessionSummary(stripe, object.id)) });

    case 'checkout.session.async_payment_failed':
      return notify(event, { status: 'payment_failed', ...(await sessionSummary(stripe, object.id)) });

    case 'invoice.paid':
    case 'invoice.payment_failed':
      return notify(event, {
        status: event.type === 'invoice.paid' ? 'paid' : 'payment_failed',
        invoice_id: object.id,
        invoice_number: object.number,
        customer_id: object.customer,
        customer_email: object.customer_email,
        customer_name: object.customer_name,
        amount_due: object.amount_due,
        amount_paid: object.amount_paid,
        billing_reason: object.billing_reason,
        hosted_invoice_url: object.hosted_invoice_url,
      });

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      return notify(event, {
        status: object.status,
        subscription_id: object.id,
        customer_id: object.customer,
        cancel_at_period_end: object.cancel_at_period_end,
        items: object.items.data.map((i) => ({
          price_lookup_key: i.price.lookup_key,
          quantity: i.quantity,
        })),
      });

    default:
      // Not subscribed to in the Dashboard; acknowledge and ignore.
      return undefined;
  }
}

async function sessionSummary(stripe, sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
  const shipping = session.collected_information?.shipping_details;
  return {
    checkout_session_id: session.id,
    mode: session.mode,
    customer_id: session.customer,
    subscription_id: session.subscription,
    invoice_id: session.invoice,
    customer_email: session.customer_details?.email,
    customer_name: session.customer_details?.name,
    customer_phone: session.customer_details?.phone,
    business_name: session.custom_fields?.find((f) => f.key === 'business_name')?.text?.value || null,
    shipping_name: shipping?.name || null,
    shipping_address: shipping?.address || null,
    amount_total: session.amount_total,
    amount_tax: session.total_details?.amount_tax ?? 0,
    currency: session.currency,
    line_items: session.line_items.data.map((li) => ({
      description: li.description,
      quantity: li.quantity,
      amount_total: li.amount_total,
    })),
  };
}

async function notify(event, summary) {
  const url = process.env.FULFILLMENT_WEBHOOK_URL;
  if (!url) {
    console.warn(`FULFILLMENT_WEBHOOK_URL not set; ${event.type} ${event.id}:`, JSON.stringify(summary));
    return;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: event.id, type: event.type, livemode: event.livemode, ...summary }),
  });
  if (!res.ok) throw new Error(`Fulfillment webhook responded ${res.status}`);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}
