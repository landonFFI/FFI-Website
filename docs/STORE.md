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

- **Add-on prices** in `lib/catalog.js` are placeholders borrowed from NextATM, not FFI distributor pricing.
- **GT300/GT500** option sets come from NextATM's GT3000/GT5000. Confirm the models match.
- **Photos:** the 2800T, GT300 and GT500 show a "Photo coming soon" placeholder. To add a photo, set `image` in `lib/catalog.js` and run `npm run build`.
- **The ROI page** (`pages/atm-machine-roi.html`) is marked `noindex`, left out of the sitemap, and not linked from other pages until its earnings language is reviewed. To publish it, remove `noindex: true` in `lib/pillar-content.js`, add it to the sitemap, and link it from related pages.
