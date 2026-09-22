// Server-side source of truth for prices. The browser only sends SKUs and
// option keys; amounts always come from here so they can't be tampered with.

// Stripe product tax codes. Confirm these with your tax advisor.
const TAX_CODE_TANGIBLE_GOODS = 'txcd_99999999';
const TAX_CODE_SERVICES = 'txcd_20030000';

export const ATM_CATALOG = {
  'halo-ii': {
    name: 'Hyosung Halo II',
    cassettes: {
      '1k': { name: '1K Cassette', amount: 258500 },
      '2k': { name: '2K Cassette', amount: 290000 },
      'dual-1k': { name: 'Dual 1K Cassettes', amount: 300500 },
      'dual-2k': { name: 'Dual 2K Cassettes', amount: 353000 },
    },
    addons: {
      programming: { name: 'Factory Programming', amount: 20000, taxCode: TAX_CODE_SERVICES },
      nfc: { name: 'NFC Contactless Reader', amount: 49500, taxCode: TAX_CODE_TANGIBLE_GOODS },
      processor: { name: 'Outside Processor Fee', amount: 50000, taxCode: TAX_CODE_SERVICES },
    },
  },
};

// Wireless membership tiers. Each tier is its own Product in Stripe, and its
// monthly Price is found by lookup key. Fill in names and amounts (in cents),
// then run `npm run stripe:setup-catalog`.
export const WIRELESS_TIERS = {
  standard: {
    name: 'Wireless ATM Connectivity: Standard',
    description: 'Cellular connectivity for one ATM, billed monthly.',
    lookupKey: 'wireless_standard_monthly',
    monthlyAmount: null, // TODO: set, e.g. 2500 for $25.00
  },
  premium: {
    name: 'Wireless ATM Connectivity: Premium',
    description: 'Cellular connectivity plus priority support for one ATM, billed monthly.',
    lookupKey: 'wireless_premium_monthly',
    monthlyAmount: null, // TODO: set
  },
};

export class CatalogError extends Error {}

// Turn a cart item like { sku: 'halo-ii', cassette: '1k', addons: ['nfc'] }
// into Checkout Session line items.
export function atmLineItems(item) {
  const product = ATM_CATALOG[item?.sku];
  if (!product) throw new CatalogError(`Unknown product: ${item?.sku}`);
  const cassette = product.cassettes[item.cassette];
  if (!cassette) throw new CatalogError(`Unknown cassette option: ${item.cassette}`);

  const addonKeys = Array.isArray(item.addons) ? [...new Set(item.addons)] : [];
  const lines = [
    priceDataLine(`${product.name}: ${cassette.name}`, cassette.amount, TAX_CODE_TANGIBLE_GOODS),
  ];
  for (const key of addonKeys) {
    const addon = product.addons[key];
    if (!addon) throw new CatalogError(`Unknown add-on: ${key}`);
    lines.push(priceDataLine(`${addon.name} (${product.name})`, addon.amount, addon.taxCode));
  }
  return lines;
}

function priceDataLine(name, unitAmount, taxCode) {
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: unitAmount,
      tax_behavior: 'exclusive',
      product_data: { name, tax_code: taxCode },
    },
  };
}
