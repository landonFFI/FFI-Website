// Guide pages (PILLAR-CONTENT.md). Same token rules as store-content.js:
// `{from:<sku>}` renders a model's lowest price from lib/catalog.js, and
// `[text](sku:x|page:x|root:x)` renders a link.

const ALL_MODELS = [
  ['Hyosung Halo II', 'sku:halo-ii'], ['Hyosung Force', 'sku:force'], ['Hyosung 2800T', 'sku:2800t'],
  ['Genmega G2500', 'sku:g2500'], ['Genmega Onyx', 'sku:onyx'], ['Genmega Onyx W', 'sku:onyx-w'],
  ['Genmega Nova', 'sku:nova'], ['Genmega GT300', 'sku:gt300'], ['Genmega GT500', 'sku:gt500'],
];

export const PILLAR_PAGES = [
  {
    file: 'atm-buying-faq.html',
    crumb: 'ATM Buying FAQ',
    seoTitle: 'ATM Machine Buying FAQ | Warranty, Shipping, Bulk Pricing | Ford Frontier Investments',
    metaDescription: 'Everything you need to know before buying an ATM machine — payment, warranty, shipping, bulk pricing, and support. Answers for first-time buyers and experienced operators.',
    h1: 'Buying an ATM Machine: Everything You Need to Know',
    intro: 'Whether this is your first ATM or your fifteenth, these are the questions that come up before you pick a specific machine. For model-specific questions — capacity, screen size, which one fits your location — see the individual [Hyosung](page:buy-atm.html#hyosung) and [Genmega](page:buy-atm.html#genmega) model pages.',
    faqHeading: 'Buying FAQ',
    faqSections: [
      {
        heading: 'Buying & Payment',
        items: [
          ['Do you offer a discount for buying multiple machines?', 'Orders of 10 or more machines may qualify for bulk pricing. Contact us directly at (205) 210-8121 to discuss volume pricing before checkout.'],
          ['Can I pay by bank transfer instead of credit card?', 'Yes, ACH bank transfer is accepted at checkout alongside major credit cards.'],
        ],
      },
      {
        heading: 'Shipping & Delivery',
        items: [
          ['Is shipping really free?', 'Yes — every machine ships free within the continental United States, with no minimum order.'],
          ['How long does shipping take?', 'Machines are ordered from the distributor after purchase and typically ship within about 2 weeks.'],
          ['Do you ship outside the continental US?', 'No — shipping is currently available within the continental United States only.'],
        ],
      },
      {
        heading: 'Warranty & Support',
        items: [
          ['What warranty comes with a new ATM?', 'New machines carry a 2-year manufacturer warranty. Used/refurbished machines carry a 90-day warranty.'],
          ["What's included with every purchase?", 'Every ATM bought from Ford Frontier Investments includes free 24/7 support, free transaction processing setup (when processing with Ford Frontier Investments), no hidden fees, and a free programming sheet.'],
          ['Do I need technical experience to set up an ATM?', 'No — transaction processing setup is handled for you at no cost when you process with Ford Frontier Investments, and a programming sheet is included with every machine to guide the rest of the setup (or you can pay to have it factory-programmed or set up on-site — see below).'],
        ],
      },
      {
        heading: 'Ownership & Operation',
        items: [
          ['If I buy a machine, do I keep 100% of the surcharge revenue?', "Yes — when you own the machine outright, you keep all surcharge revenue. (This is different from Ford Frontier Investments' [free-placement program](page:free-atm-placement.html), where revenue is shared in exchange for a $0 upfront cost.)"],
          ['Do I have to use Ford Frontier Investments for processing?', "No, but there's a cost either way you should know about: processing setup is free if you process through Ford Frontier Investments. If you'd rather use a different processor, a $500 setup fee applies instead."],
          ['How does the machine get programmed?', 'Three ways, your choice: program it yourself for free using the included programming sheet (with phone help from Ford Frontier Investments during business hours), pay $150 per machine to have it factory-programmed before it ships, or pay $250 for a technician to come on-site and program it for you.'],
          ['Can I sell the ATM later if I change my mind?', 'Ford Frontier Investments [buys individual ATMs and full routes](page:atm-route-acquisition.html) from operators looking to exit — reach out directly to discuss.'],
        ],
      },
    ],
    sections: [
      { heading: 'Shop by Model', blocks: [{ type: 'models' }] },
    ],
    related: [
      ['New vs. Used ATM Machines', 'page:new-vs-used-atm.html'],
      ['Hyosung vs. Genmega: Which Brand Should You Buy?', 'page:hyosung-vs-genmega.html'],
      ['How to Start an ATM Business', 'page:how-to-start-an-atm-business.html'],
      ['All ATM models', 'page:buy-atm.html'],
    ],
  },
  {
    file: 'hyosung-vs-genmega.html',
    crumb: 'Hyosung vs. Genmega',
    seoTitle: 'Hyosung vs. Genmega ATM Machines | Which Brand Should You Buy? | Ford Frontier Investments',
    metaDescription: 'Comparing Hyosung and Genmega ATM machines — reliability, features, price, and which brand fits your location. An honest breakdown from a dealer who sells both.',
    h1: "Hyosung or Genmega? Here's How to Decide",
    intro: "Hyosung and Genmega are the two most trusted names in retail ATMs, and we sell both — so this isn't a sales pitch for one over the other. Here's the honest breakdown of where each brand actually wins.",
    sections: [
      {
        heading: 'Reliability & Track Record',
        blocks: ['Hyosung is the largest manufacturer of retail ATMs in the United States, and the [Halo II](sku:halo-ii) is the industry\'s best-selling model — that scale means parts, service knowledge, and technician familiarity are everywhere. Genmega has deployed over 150,000 machines worldwide and built its reputation specifically on modern design and configuration flexibility, with the same field-proven vault and security components carried across its [G2500](sku:g2500), [Onyx](sku:onyx), and [Nova](sku:nova) lines.'],
      },
      {
        heading: 'Price',
        blocks: ["At the entry level, Genmega's G2500 (from {from:g2500}) undercuts Hyosung's Halo II (from {from:halo-ii}) slightly, though the gap is small enough that it rarely decides the purchase on its own. Through-the-wall pricing is close at the compact end — Hyosung's [2800T](sku:2800t) starts at {from:2800t} and Genmega's [GT300](sku:gt300) at {from:gt300} — while Genmega's [GT500](sku:gt500) (from {from:gt500}) is a step up in both capacity and price."],
      },
      {
        heading: 'Design & Customer-Facing Appeal',
        blocks: ["This is where Genmega differentiates hardest. The Onyx's reflective security bezel and the Nova's 17\" full-motion video touchscreen are built specifically to look modern and grab attention — a deliberate design choice Hyosung's lineup doesn't compete on directly. If the machine's appearance matters to your customers (hotels, clubs, upscale retail), Genmega's newer models have an edge."],
      },
      {
        heading: 'Configuration Flexibility',
        blocks: ["Both brands offer through-the-wall options (Hyosung 2800T, Genmega GT300/GT500), wall-mount or compact options ([Genmega Onyx W](sku:onyx-w)), and a range of cassette capacities. Genmega's G2500 and Onyx additionally offer LCD and printer upgrades as standalone options, giving slightly more granular configuration than Hyosung's lineup."],
      },
      {
        heading: 'Bottom Line',
        blocks: ['If you want the industry-standard, most widely serviced machine, the Hyosung Halo II is hard to beat. If design and screen technology matter more to your location, Genmega\'s Onyx or Nova are the stronger picks. For through-the-wall installs, compare the Hyosung 2800T against the Genmega GT300/GT500 directly based on space and capacity needs — see our [New vs. Used](page:new-vs-used-atm.html) guide and the individual model pages below for exact specs.', { type: 'models' }],
      },
    ],
    faq: [
      ['Is Hyosung or Genmega more reliable?', 'Both are established, widely deployed brands. Hyosung has the larger US installed base and the industry\'s best-selling model; Genmega has over 150,000 units deployed worldwide with a strong reputation for modern design.'],
      ['Which brand is cheaper?', "Entry-level pricing is close between the two brands — Genmega's G2500 starts slightly lower than Hyosung's Halo II, but the difference is minor compared to how cassette size and add-ons affect the final price."],
      ['Do Hyosung and Genmega machines use the same parts?', 'No — they are different manufacturers with different components, though both use industry-standard cassette, lock, and card reader options (S&G, Cencon, EMV) across their lines.'],
    ],
    related: [
      ['ATM Buying FAQ', 'page:atm-buying-faq.html'],
      ['New vs. Used ATM Machines', 'page:new-vs-used-atm.html'],
      ['How to Start an ATM Business', 'page:how-to-start-an-atm-business.html'],
    ],
  },
  {
    file: 'how-to-start-an-atm-business.html',
    crumb: 'How to Start an ATM Business',
    seoTitle: 'How to Start an ATM Business | Step-by-Step Guide | Ford Frontier Investments',
    metaDescription: 'A step-by-step guide to starting an ATM business — buying your first machine, setting up processing, finding a location, and what it actually takes to get started.',
    h1: 'How to Start an ATM Business',
    intro: "Getting into the ATM business comes down to a handful of real decisions: buy or place for free, which machine, where it goes, and how you handle processing and cash. Here's the honest rundown.",
    sections: [
      {
        heading: 'Decide How You Want to Get Started',
        blocks: ["There are two paths into ATM ownership. The first is buying a machine outright — you own it, you keep 100% of the surcharge revenue, and you're responsible for cash loading (or you set up a [cash loading service](page:cash-loading.html)). The second is a [free-placement arrangement](page:free-atm-placement.html), where a company like Ford Frontier Investments installs and operates a machine at your location at no cost, and you split the surcharge revenue. Buying makes sense if you're building an ATM business as your own venture; free placement makes sense if you run a location (bar, store, venue) and just want the revenue without the operational work."],
      },
      {
        heading: 'Choose Your First Machine',
        blocks: ['For a first machine, most operators start with an industry-standard model — the [Hyosung Halo II](sku:halo-ii) or [Genmega G2500](sku:g2500) are the two most common first purchases, both for their lower upfront cost and their track record. See our [Hyosung vs. Genmega](page:hyosung-vs-genmega.html) comparison for the full breakdown, or browse [all ATM models](page:buy-atm.html) directly.'],
      },
      {
        heading: 'Set Up Transaction Processing',
        blocks: ["Every machine needs to be connected to a transaction processor before it can dispense cash. When you process with Ford Frontier Investments, this setup is included free with every machine you buy from us — no separate processing contract to negotiate on your own. If you'd rather use a different processor, a $500 setup fee applies."],
      },
      {
        heading: 'Find the Right Location',
        blocks: ['Cash-heavy, high-foot-traffic businesses are the best fit — bars, convenience stores, gas stations, event venues, barbershops, and similar locations. The strongest locations combine steady foot traffic with limited nearby ATM competition.'],
      },
      {
        heading: 'Handle Cash Loading',
        blocks: ['Someone has to load the vault cash — either you personally, a trusted employee, or a licensed cash-loading service. This is the ongoing operational piece that makes owning multiple machines more of a real business rather than a one-time purchase.'],
      },
      {
        heading: 'What It Actually Costs to Start',
        blocks: ['A new machine typically runs $2,500–$5,000+ depending on model and configuration (see [Hyosung vs. Genmega](page:hyosung-vs-genmega.html) for a full price breakdown), plus the vault cash itself, which is your money in the machine, not a fee.', { type: 'models' }],
      },
    ],
    faq: [
      ['How much does it cost to start an ATM business?', "A single new machine typically costs $2,500–$5,000+ depending on model and configuration, plus the vault cash you load into it — the cash itself isn't spent, it's dispensed to customers and replenished from your surcharge revenue and deposits."],
      ['Do I need a license to own and operate an ATM?', "Requirements vary by state and locality — check with your state's business licensing authority before placing a machine."],
      ['Can I start with one machine and grow from there?', 'Yes — this is the most common path. Many operators start with a single machine at a location they already control, then expand once they understand the operational side.'],
    ],
    related: [
      ['ATM Buying FAQ', 'page:atm-buying-faq.html'],
      ['Hyosung vs. Genmega', 'page:hyosung-vs-genmega.html'],
      ['New vs. Used ATM Machines', 'page:new-vs-used-atm.html'],
      ['Free ATM Placement', 'page:free-atm-placement.html'],
      ...ALL_MODELS,
    ],
  },
  {
    // Held back pending Landon's legal review of the earnings language: not in
    // the sitemap, not linked from other pages, and marked noindex.
    file: 'atm-machine-roi.html',
    noindex: true,
    crumb: 'ATM Revenue Explained',
    seoTitle: 'How Much Can You Make With an ATM Machine? | ROI Explained | Ford Frontier Investments',
    metaDescription: 'How ATM surcharge revenue actually works — the variables that determine your return, explained honestly with no inflated numbers.',
    h1: 'How ATM Surcharge Revenue Actually Works',
    intro: 'Every ATM earns money the same way: a surcharge fee charged to the customer on top of their withdrawal, paid to the machine\'s owner. What varies — a lot — is how much any single machine actually earns, and that comes down to a few concrete variables rather than a single number anyone can promise you.',
    sections: [
      {
        heading: 'The Formula',
        blocks: ['Revenue = surcharge fee × number of transactions. That\'s the whole mechanism. A machine doing 50 transactions a month at a $3 surcharge earns differently than one doing 500 transactions a month at the same fee — the fee is the easy part to set, and the transaction volume is almost entirely a function of the location.'],
      },
      {
        heading: 'What Drives Transaction Volume',
        blocks: ['Foot traffic, how cash-dependent the business is (bars and convenience stores typically see far more ATM use than, say, a retail boutique), and how much nearby ATM competition exists. A machine in a standalone, cash-only bar sees very different volume than one in a strip mall with three other ATMs within sight.'],
      },
      {
        heading: "What You Control vs. What You Don't",
        blocks: ['You set the surcharge fee (usually somewhere in the $2–$5 range depending on your market and what competitors charge). You don\'t control foot traffic directly, but you do control where you place the machine — which is the single biggest lever on actual revenue.'],
      },
      {
        heading: 'Costs to Weigh Against Revenue',
        blocks: ["Surcharge revenue isn't pure profit — weigh it against the machine's upfront cost, any ongoing cash-loading logistics, and processing fees."],
      },
    ],
    faq: [
      ['How much does the average ATM make per month?', "This varies enormously by location and can't be honestly stated as a single figure — a low-traffic location and a high-traffic bar can differ by 10x or more in transaction volume. The formula (surcharge × transactions) is the honest way to estimate for your specific location."],
      ['What surcharge fee should I set?', 'Most operators set fees somewhere between $2 and $5, based on their local market and what nearby ATMs charge.'],
      ['Is owning an ATM a passive income source?', 'It requires some ongoing involvement — primarily cash loading and occasional maintenance — but many operators run several machines with a manageable amount of hands-on time once the initial setup is done.'],
    ],
    related: [
      ['How to Start an ATM Business', 'page:how-to-start-an-atm-business.html'],
      ['ATM Buying FAQ', 'page:atm-buying-faq.html'],
      ['All ATM models', 'page:buy-atm.html'],
    ],
  },
  {
    file: 'new-vs-used-atm.html',
    crumb: 'New vs. Used ATMs',
    seoTitle: 'New vs. Used ATM Machines | Which Should You Buy? | Ford Frontier Investments',
    metaDescription: 'Comparing new and used ATM machines — warranty, cost, and compliance differences — to help you decide which is right for your budget and location.',
    h1: 'New or Used ATM: Which Is Right for You?',
    intro: 'Both new and used ATMs from Ford Frontier Investments include full transaction processing setup when processed with Ford Frontier Investments, and are compliant with current EMV, ADA, and PCI standards — the real differences come down to upfront cost, warranty, and how long you plan to operate the machine.',
    sections: [
      {
        heading: 'Side-by-Side Comparison',
        blocks: [
          {
            type: 'table',
            head: ['Feature', 'New', 'Used'],
            rows: [
              ['Upfront cost', 'Higher', 'Lower'],
              ['Warranty', '2 years (manufacturer)', '90 days'],
              ['Compliance', 'EMV / ADA / PCI', 'EMV / ADA / PCI'],
              ['Processing setup', 'Free with FFI processing', 'Free with FFI processing'],
              ['Best for', 'Long-term operators', 'First-time buyers, testing a location'],
            ],
          },
          '**Upfront cost:** new machines start at {from:g2500} and ship free within the continental US; used prices depend on the model and condition of what\'s in stock. **Warranty:** a new machine is covered by the manufacturer for two years, a used one for 90 days. **Compliance and processing:** identical either way — every machine we sell meets current EMV, ADA, and PCI standards and comes with free processing setup when you process with Ford Frontier Investments.',
        ],
      },
      {
        heading: 'What "Used" Actually Means Here',
        blocks: ['Every used ATM sold is fully inspected and tested before sale, with any worn or broken components repaired or replaced — non-compliant machines are never sold. Common used models available include the Hyosung 2700CE, like-new Halo II units, and Genmega G2500s, though availability changes frequently — call (205) 210-8121 for current inventory. Used machines are sold by phone rather than through the online cart.'],
      },
      {
        heading: 'When New Makes More Sense',
        blocks: ["If you're planning to operate the machine for years, the longer 2-year warranty and full manufacturer support on a new unit reduces the risk of an unexpected repair cost outweighing the initial savings on a used machine."],
      },
      {
        heading: 'When Used Makes More Sense',
        blocks: ["If you're testing a new location and aren't yet sure it'll perform well, or your upfront budget is tight, a used machine lowers the initial investment while still including the same free processing setup as a new one (when processed with Ford Frontier Investments)."],
      },
      {
        heading: 'Shop New Machines',
        blocks: [{ type: 'models' }],
      },
    ],
    faq: [
      ['Are used ATMs from Ford Frontier Investments reliable?', 'Every used machine is inspected and tested, with any worn or broken parts repaired before sale — the company does not sell non-compliant machines.'],
      ["What's the warranty difference between new and used?", 'New machines carry a 2-year manufacturer warranty; used machines carry a 90-day warranty.'],
      ['Can I buy a specific used model?', 'Used inventory changes frequently — call (205) 210-8121 to check current availability for a specific model.'],
    ],
    related: [
      ['ATM Buying FAQ', 'page:atm-buying-faq.html'],
      ['Hyosung vs. Genmega', 'page:hyosung-vs-genmega.html'],
      ['How to Start an ATM Business', 'page:how-to-start-an-atm-business.html'],
      ['Used ATM availability', 'page:buy-atm.html#used'],
    ],
  },
];
