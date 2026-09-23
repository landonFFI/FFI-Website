# ATM store

## Where things live

| What | File |
| --- | --- |
| Prices, cassettes, add-on options, photos | `lib/catalog.js`, the only place prices are typed |
| Product page copy, FAQs, trust strip | `lib/store-content.js` |
| Buyer's guide pages | `lib/pillar-content.js` |
| Page generator | `scripts/build-store.mjs` |
| Cart, drawer, configurator, quick-add | `files/ffi-website/assets/js/store.js` (loaded on every page by `layout.js`) |
| Styles | section 24 of `files/ffi-website/assets/css/main.css` |

## Changing a price, option, or page copy

1. Edit the file in `lib/`.
2. Run `npm run build`. It regenerates `assets/data/catalog.json`, the nine product pages in `pages/atm/`, the five guide pages, the cart page's trust strip, and the model cards and schema on `buy-atm.html`.
3. Run `npm test`. It fails if any generated file is out of date.

Vercel also runs `npm run build` on every deploy, so production can't drift from `lib/catalog.js`.

Don't edit generated pages by hand; your changes will be overwritten. On `buy-atm.html`, only the `<!-- STORE:... -->` regions are generated, and the rest is hand-written.

## How pricing stays safe

The cart stores only the model, cassette, options, and quantity. It shows prices from `catalog.json`, and checkout (`api/checkout.js`) re-prices every line from `lib/catalog.js` on the server. A shopper can't change what they pay by editing the page.

## Before launch

- **Hardware add-on prices** (lock, keypad, topper, LCD, printer, camera, NFC, card reader, rear panel) in `lib/catalog.js` are placeholders borrowed from NextATM, not SWYPCO distributor pricing. Don't enable live Stripe keys until they're replaced.
- **Programming and processing setup** prices are confirmed FFI pricing and apply to every model: self-program free, factory programmed +$150, on-site technician +$250; FFI processing free, outside processor +$500.
- **GT300/GT500** option sets come from NextATM's GT3000/GT5000. Confirm the models match.
- **Photos** are hotlinked from hyosungamericas.com and genmega.com. If one stops loading, the page shows a labeled placeholder rather than a broken image. Alternate angles are listed in CART-SPEC.md if a gallery is added later.
- **Earnings language:** the ROI guide and the break-even answer removed from `faq.html` are both waiting on review. See `docs/EARNINGS-REVIEW.md`.
