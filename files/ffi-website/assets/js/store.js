// ATM store: cart (saved in localStorage), cart drawer, full cart page,
// product configurator, and hub quick-add. Loaded on every page by layout.js.
//
// Prices are never stored in the cart. Each line keeps only the model,
// cassette, options, and quantity; prices come from assets/data/catalog.json,
// which scripts/build-store.mjs generates from lib/catalog.js. Checkout
// re-prices everything on the server from the same catalog.
(function () {
  'use strict';

  var STORAGE_KEY = 'ffi-cart-v1';
  var PHONE_DISPLAY = '(205) 210-8121';
  var PHONE_HTML = '(205)&nbsp;210&#8209;8121';
  var PHONE_TEL = 'tel:+12052108121';

  var path = window.location.pathname;
  var base = path.indexOf('/pages/atm/') !== -1 ? '../../' : (path.indexOf('/pages/') !== -1 ? '../' : './');

  var catalog = null;
  var catalogPromise = null;
  var catalogFailed = false;
  var cart = readCart();

  // ── Catalog & pricing ─────────────────────────────────────────────────────

  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch(base + 'assets/data/catalog.json')
        .then(function (res) {
          if (!res.ok) throw new Error('Catalog unavailable');
          return res.json();
        })
        .then(function (data) {
          catalog = data;
          return data;
        });
    }
    return catalogPromise;
  }

  // Mirrors resolveLine() in lib/catalog.js. Returns null for a line the
  // catalog no longer supports.
  function priceLine(line) {
    var product = catalog && catalog.models[line.sku];
    if (!product) return null;
    var cassette = find(product.cassettes, line.cassette);
    if (!cassette) return null;
    var unit = cassette.amount;
    var extras = [];
    for (var i = 0; i < product.optionGroups.length; i++) {
      var group = product.optionGroups[i];
      var choice = find(group.choices, (line.options || {})[group.key] || group.choices[0].key);
      if (!choice) return null;
      unit += choice.amount;
      if (choice.amount > 0) extras.push(group.label + ': ' + choice.label);
    }
    return {
      product: product,
      name: product.brand + ' ' + product.model,
      details: [cassette.label + ' cassette'].concat(extras.length ? extras : ['Standard options']),
      unit: unit,
      total: unit * line.quantity,
    };
  }

  function find(list, key) {
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  function money(cents) {
    var dollars = cents / 100;
    return '$' + dollars.toLocaleString('en-US', {
      minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Cart state ────────────────────────────────────────────────────────────

  function readCart() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.filter(function (l) {
        return l && typeof l.sku === 'string' && typeof l.cassette === 'string' && Number.isInteger(l.quantity) && l.quantity > 0;
      });
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      // Private browsing or storage full: the cart still works for this page view.
    }
    render();
  }

  function maxQuantity() {
    return (catalog && catalog.maxQuantity) || 99;
  }

  function sameConfig(a, b) {
    if (a.sku !== b.sku || a.cassette !== b.cassette) return false;
    var keys = Object.keys(a.options || {}).concat(Object.keys(b.options || {}));
    for (var i = 0; i < keys.length; i++) {
      if ((a.options || {})[keys[i]] !== (b.options || {})[keys[i]]) return false;
    }
    return true;
  }

  function addLine(line) {
    for (var i = 0; i < cart.length; i++) {
      if (sameConfig(cart[i], line)) {
        cart[i].quantity = Math.min(cart[i].quantity + line.quantity, maxQuantity());
        saveCart();
        return;
      }
    }
    cart.push(line);
    saveCart();
  }

  function setQuantity(index, quantity) {
    if (!cart[index]) return;
    var q = Math.round(Number(quantity));
    if (!(q >= 1)) q = 1;
    cart[index].quantity = Math.min(q, maxQuantity());
    saveCart();
  }

  function removeLine(index) {
    cart.splice(index, 1);
    saveCart();
  }

  function unitCount() {
    return cart.reduce(function (sum, l) { return sum + l.quantity; }, 0);
  }

  // Line items for checkout: configuration only, never prices.
  function serializeCart() {
    return cart.map(function (l) {
      return { sku: l.sku, cassette: l.cassette, options: l.options || {}, quantity: l.quantity };
    });
  }

  // Hand the cart to checkout. The server re-prices every line from
  // lib/catalog.js and responds with a Stripe Checkout URL.
  function initiateCheckout(lineItems) {
    return fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'atm', items: lineItems }),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.');
          return data.url;
        });
      });
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  function renderBadge() {
    var count = unitCount();
    var badge = document.getElementById('nav-cart-count');
    var link = document.getElementById('nav-cart');
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
    if (link) link.setAttribute('aria-label', 'Cart, ' + count + (count === 1 ? ' item' : ' items'));
  }

  function linesHtml(variant) {
    if (!catalog) return '<p class="cart-message">Loading your cart…</p>';
    return cart.map(function (line, i) {
      var p = priceLine(line);
      var name = esc(p.name);
      return '<li class="store-line store-line--' + variant + '">' +
        '<div class="store-line__info">' +
          '<a class="store-line__name" href="' + base + 'pages/atm/' + p.product.page + '">' + name + '</a>' +
          '<p class="store-line__details">' + p.details.map(esc).join(' · ') + '</p>' +
          '<p class="store-line__unit">' + money(p.unit) + ' each</p>' +
        '</div>' +
        '<div class="store-line__controls">' +
          '<div class="qty-stepper">' +
            '<button type="button" class="qty-stepper__btn" data-action="dec" data-index="' + i + '" aria-label="Decrease quantity of ' + name + '"' + (line.quantity <= 1 ? ' disabled' : '') + '>−</button>' +
            '<input class="qty-stepper__input" type="number" inputmode="numeric" min="1" max="' + maxQuantity() + '" value="' + line.quantity + '" data-action="qty" data-index="' + i + '" aria-label="Quantity of ' + name + '" />' +
            '<button type="button" class="qty-stepper__btn" data-action="inc" data-index="' + i + '" aria-label="Increase quantity of ' + name + '"' + (line.quantity >= maxQuantity() ? ' disabled' : '') + '>+</button>' +
          '</div>' +
          '<p class="store-line__total">' + money(p.total) + '</p>' +
          '<button type="button" class="store-line__remove" data-action="remove" data-index="' + i + '" aria-label="Remove ' + name + ' from cart">Remove</button>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  function summaryHtml(withFullCartLink) {
    var subtotal = cart.reduce(function (sum, l) { return sum + priceLine(l).total; }, 0);
    var units = unitCount();
    var bulk = catalog.bulkThreshold && units >= catalog.bulkThreshold
      ? '<p class="bulk-banner" role="note">Orders of ' + catalog.bulkThreshold + '+ machines may qualify for bulk pricing — call <a href="' + PHONE_TEL + '">' + PHONE_HTML + '</a>.</p>'
      : '';
    return '<dl class="store-summary">' +
        '<div class="store-summary__row"><dt>Subtotal (' + units + (units === 1 ? ' machine' : ' machines') + ')</dt><dd>' + money(subtotal) + '</dd></div>' +
        '<div class="store-summary__row"><dt>Shipping</dt><dd>Free</dd></div>' +
      '</dl>' +
      bulk +
      '<div class="store-summary__total"><span>Total</span><span>' + money(subtotal) + '</span></div>' +
      '<p class="store-summary__note">Ships in about 2 weeks. Sales tax, if any, is calculated at checkout.</p>' +
      '<button type="button" class="btn btn--primary btn--lg store-summary__checkout" data-action="checkout">Checkout</button>' +
      '<p class="store-summary__error" data-checkout-error role="alert"></p>' +
      (withFullCartLink ? '<a class="store-summary__full" href="' + base + 'pages/cart.html">View Full Cart</a>' : '');
  }

  function emptyHtml() {
    return '<div class="store-empty"><p>Your cart is empty.</p><a class="btn btn--primary" href="' + base + 'pages/buy-atm.html">Browse ATMs</a></div>';
  }

  function catalogErrorHtml() {
    return '<p class="cart-message">We couldn\'t load prices right now. Please refresh, or call <a href="' + PHONE_TEL + '">' + PHONE_HTML + '</a> to order.</p>';
  }

  function renderInto(container, variant) {
    if (!container) return;
    var linesEl = container.querySelector('[data-cart-lines]');
    var footEl = container.querySelector('[data-cart-foot]');
    var focusKey = focusedKey(container);

    if (catalogFailed) {
      linesEl.innerHTML = catalogErrorHtml();
      footEl.innerHTML = '';
    } else if (cart.length === 0) {
      linesEl.innerHTML = emptyHtml();
      footEl.innerHTML = '';
    } else {
      linesEl.innerHTML = '<ul class="store-lines">' + linesHtml(variant) + '</ul>';
      footEl.innerHTML = catalog ? summaryHtml(variant === 'drawer') : '';
    }
    restoreFocus(container, focusKey);
  }

  // Re-rendering replaces the buttons, so keep keyboard focus where it was.
  function focusedKey(container) {
    var el = document.activeElement;
    if (!el || !container.contains(el) || !el.dataset.action) return null;
    return el.dataset.action + ':' + (el.dataset.index || '');
  }

  function restoreFocus(container, key) {
    if (!key) return;
    var parts = key.split(':');
    var selector = '[data-action="' + parts[0] + '"]' + (parts[1] ? '[data-index="' + parts[1] + '"]' : '');
    var el = container.querySelector(selector);
    if (el && !el.disabled) el.focus();
    else if (container.querySelector('.cart-drawer__close')) container.querySelector('.cart-drawer__close').focus();
  }

  function render() {
    renderBadge();
    renderInto(document.getElementById('cart-drawer'), 'drawer');
    renderInto(document.querySelector('[data-cart-page]'), 'page');
  }

  // ── Drawer ────────────────────────────────────────────────────────────────

  var lastFocus = null;

  function buildDrawer() {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="cart-drawer-overlay" data-cart-close></div>' +
      '<aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">' +
        '<div class="cart-drawer__head">' +
          '<h2 class="cart-drawer__title" id="cart-drawer-title">Your Cart</h2>' +
          '<button type="button" class="cart-drawer__close" data-cart-close aria-label="Close cart">✕</button>' +
        '</div>' +
        '<div class="cart-drawer__body" data-cart-lines></div>' +
        '<div class="cart-drawer__foot" data-cart-foot></div>' +
      '</aside>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    document.querySelectorAll('[data-cart-close]').forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    document.body.classList.add('cart-open');
    render();
    document.querySelector('.cart-drawer__close').focus();
  }

  function closeDrawer() {
    if (!document.body.classList.contains('cart-open')) return;
    document.body.classList.remove('cart-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('cart-open')) return;
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep Tab inside the open drawer.
    var focusable = document.getElementById('cart-drawer').querySelectorAll('a[href], button:not([disabled]), input');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ── Cart controls (drawer and full cart page) ─────────────────────────────

  function handleCartClick(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var i = Number(el.dataset.index);
    if (el.dataset.action === 'inc') setQuantity(i, cart[i].quantity + 1);
    else if (el.dataset.action === 'dec') setQuantity(i, cart[i].quantity - 1);
    else if (el.dataset.action === 'remove') removeLine(i);
    else if (el.dataset.action === 'checkout') checkout(el);
  }

  function handleCartChange(e) {
    var el = e.target.closest('[data-action="qty"]');
    if (el) setQuantity(Number(el.dataset.index), el.value);
  }

  function checkout(button) {
    var container = button.closest('#cart-drawer, [data-cart-page]');
    var error = container.querySelector('[data-checkout-error]');
    button.disabled = true;
    button.textContent = 'Redirecting to secure checkout…';
    error.textContent = '';
    initiateCheckout(serializeCart())
      .then(function (url) {
        if (typeof window.fbq === 'function') window.fbq('track', 'InitiateCheckout');
        window.location.href = url;
      })
      .catch(function (err) {
        error.textContent = err.message + ' You can also order by phone at ' + PHONE_DISPLAY + '.';
        button.disabled = false;
        button.textContent = 'Checkout';
      });
  }

  // ── Product configurator ──────────────────────────────────────────────────

  function readConfig(form) {
    var sku = form.dataset.configurator;
    var product = catalog.models[sku];
    var cassette = form.querySelector('input[name="cassette"]:checked').value;
    var options = {};
    product.optionGroups.forEach(function (g) {
      var select = form.elements[g.key];
      options[g.key] = select ? select.value : g.choices[0].key;
    });
    return { sku: sku, cassette: cassette, options: options, quantity: 1 };
  }

  function mountConfigurator(form) {
    var priceEl = form.querySelector('[data-config-price]');
    var statusEl = form.querySelector('[data-config-status]');

    function update() {
      if (!catalog) return;
      var priced = priceLine(readConfig(form));
      if (priced) priceEl.textContent = money(priced.unit);
      statusEl.textContent = '';
    }

    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      loadCatalog().then(function () {
        var line = readConfig(form);
        addLine(line);
        statusEl.textContent = 'Added to cart.';
        openDrawer();
      }).catch(function () {
        statusEl.textContent = 'We couldn\'t add this right now. Please refresh, or call ' + PHONE_DISPLAY + '.';
      });
    });
    loadCatalog().then(update, function () {});
  }

  // ── Hub quick-add ─────────────────────────────────────────────────────────

  function quickAdd(button) {
    loadCatalog().then(function () {
      var product = catalog.models[button.dataset.quickAdd];
      var cheapest = product.cassettes.reduce(function (a, b) { return b.amount < a.amount ? b : a; });
      var options = {};
      product.optionGroups.forEach(function (g) { options[g.key] = g.choices[0].key; });
      addLine({ sku: button.dataset.quickAdd, cassette: cheapest.key, options: options, quantity: 1 });
      openDrawer();
    }, function () {
      catalogFailed = true;
      openDrawer();
    });
  }

  // ── Images ────────────────────────────────────────────────────────────────

  // Manufacturer photos are hotlinked; if one fails, show a labeled
  // placeholder instead of a broken image.
  function guardImage(img) {
    function swap() {
      var ph = document.createElement('div');
      ph.className = 'photo-placeholder';
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', img.dataset.fallbackLabel + ' photo coming soon');
      ph.innerHTML = '<span class="photo-placeholder__name">' + esc(img.dataset.fallbackLabel) + '</span><span class="photo-placeholder__note">Photo coming soon</span>';
      img.replaceWith(ph);
    }
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener('error', swap);
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    buildDrawer();
    document.getElementById('cart-drawer').addEventListener('click', handleCartClick);
    document.getElementById('cart-drawer').addEventListener('change', handleCartChange);

    var page = document.querySelector('[data-cart-page]');
    if (page) {
      page.addEventListener('click', handleCartClick);
      page.addEventListener('change', handleCartChange);
    }

    var navCart = document.getElementById('nav-cart');
    if (navCart && !page) {
      navCart.addEventListener('click', function (e) {
        e.preventDefault();
        openDrawer();
      });
    }

    document.querySelectorAll('form[data-configurator]').forEach(mountConfigurator);
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-quick-add]');
      if (btn) quickAdd(btn);
    });
    document.querySelectorAll('img[data-fallback-label]').forEach(guardImage);

    // Another tab changed the cart.
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        cart = readCart();
        render();
      }
    });

    renderBadge();
    if (cart.length || page) {
      loadCatalog().then(function () {
        // Drop lines the catalog no longer sells.
        var valid = cart.filter(priceLine);
        if (valid.length !== cart.length) {
          cart = valid;
          saveCart();
        } else {
          render();
        }
      }, function () {
        catalogFailed = true;
        render();
      });
    }
    render();
  }

  window.ffiStore = { initiateCheckout: initiateCheckout, serializeCart: serializeCart, openCart: openDrawer };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
