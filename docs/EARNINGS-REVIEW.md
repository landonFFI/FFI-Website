# Earnings language for legal review

Everything the site says about how much an ATM earns, gathered for one review pass. Nothing in section 1 is public until you approve it.

## 1. Held back pending review

### a. ROI guide: `pages/atm-machine-roi.html`

Built, but marked `noindex`, left out of the sitemap, and not linked from any page. The full text is in `lib/pillar-content.js` (the `atm-machine-roi.html` entry). Its earnings statements:

- "Revenue = surcharge fee × number of transactions … A machine doing 50 transactions a month at a $3 surcharge earns differently than one doing 500 transactions a month at the same fee."
- "You set the surcharge fee (usually somewhere in the $2–$5 range depending on your market and what competitors charge)."
- "Surcharge revenue isn't pure profit — weigh it against the machine's upfront cost, any ongoing cash-loading logistics, and processing fees." Your processing fee structure isn't stated here, which keeps the page general. Add your own numbers if you'd rather disclose them.
- FAQ: "a low-traffic location and a high-traffic bar can differ by 10x or more in transaction volume."
- FAQ: "many operators run several machines with a manageable amount of hands-on time once the initial setup is done."

To publish it, remove `noindex: true` in `lib/pillar-content.js`, run `npm run build`, add the page to `sitemap.xml`, and link it from the other guides.

### b. Removed from `pages/faq.html` (was live until this change)

Under "Startup Costs", this question and answer were removed:

> **How long until I break even on an ATM?**
> Break-even depends on transaction volume, surcharge rate, and your location split (if any). At 150 transactions/month with a $3.00 surcharge and no location split, a $3,500 machine pays for itself in roughly 8–10 months. High-traffic locations break even faster. We can model this out for specific locations you're targeting.

This is the most specific claim on the site: a payback period for a stated volume. Restore it (from git history) only in whatever form you approve.

## 2. Still live on `pages/faq.html`, for the same review

These give volume and fee ranges rather than a promised result, but they bear on the same question:

- **"How much will I earn from a free placement ATM?"** (visible text and FAQPage schema): "A busy gas station or convenience store might generate 300–600+ transactions per month; a smaller retail location might see 50–150. The surcharge fee per transaction in Alabama is typically $2.50–$3.50. Your share is a portion of that fee per transaction."
- **"How much does ATM processing cost?"**: "Processing fees typically run $0.05–$0.15 per transaction plus a small monthly network fee. On a machine doing 200 transactions/month at a $3.00 surcharge, processing costs represent a small fraction of your gross revenue."
- **Location evaluation**: "if a location consistently generates less than 50–75 transactions per month after a fair evaluation period (3–6 months), the revenue may not justify the time and vault cash."
