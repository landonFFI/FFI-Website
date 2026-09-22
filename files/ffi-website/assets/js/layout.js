// ── META PIXEL ──
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '699729932886668');
fbq('track', 'PageView');

// Detect depth: root, /pages/, or /pages/atm/
const path = window.location.pathname;
const isAtmProduct = path.includes('/pages/atm/');
const isPages = path.includes('/pages/') && !isAtmProduct;
const root = isAtmProduct ? '../../' : (isPages ? '../' : './');

// ── NAV ──
document.getElementById('site-nav').innerHTML = `
<nav class="navbar">
  <div class="nav-left">
    <a href="${root}index.html" class="nav__logo">
      Ford Frontier <span>Investments</span>
      <small>Alabama's ATM Experts</small>
    </a>
  </div>
  <div class="nav-center">
      <div class="nav__dropdown">
        <a href="#">ATM Services</a>
        <div class="nav__dropdown-menu">
          <a href="${root}pages/free-atm-placement.html">Free ATM Placement</a>
          <a href="${root}pages/atm-partnership.html">ATM Partnership Program</a>
          <a href="${root}pages/mobile-atm-events.html">Mobile ATMs for Events</a>
          <a href="${root}pages/cash-loading.html">Cash Loading Services</a>
          <a href="${root}pages/outdoor-atm.html">Outdoor ATM Placement</a>
          <a href="${root}pages/wireless-atm.html">Wireless ATM Service</a>
          <a href="${root}pages/atm-processing.html">ATM Processing</a>
          <a href="${root}pages/atm-route-acquisition.html">ATM Route Acquisition</a>
          <a href="${root}pages/atm-route-acquisition.html">Sell Your ATM or Route</a>
        </div>
      </div>
      <div class="nav__dropdown">
        <a href="#">Buy an ATM</a>
        <div class="nav__dropdown-menu">
          <a href="${root}pages/buy-atm.html">All ATM Models</a>
          <a href="${root}pages/buy-atm.html#hyosung">Hyosung ATMs</a>
          <a href="${root}pages/buy-atm.html#genmega">Genmega ATMs</a>
          <a href="${root}pages/buy-atm.html#used">Used / Refurbished</a>
        </div>
      </div>
      <a href="${root}pages/merchant-services.html">Merchant Services</a>
      <div class="nav__dropdown">
        <a href="#">Service Areas</a>
        <div class="nav__dropdown-menu">
          <a href="${root}pages/atm-birmingham-al.html">Birmingham, AL</a>
          <a href="${root}pages/atm-montgomery-al.html">Montgomery, AL</a>
          <a href="${root}pages/atm-tuscaloosa-al.html">Tuscaloosa, AL</a>
          <a href="${root}pages/tuscaloosa-strip.html">The Strip — Tuscaloosa</a>
          <a href="${root}pages/bars-nightclubs.html">Bars &amp; Nightclubs</a>
          <a href="${root}pages/convenience-stores.html">Convenience Stores</a>
          <a href="${root}pages/gentlemens-clubs.html">Gentlemen's Clubs</a>
          <a href="${root}pages/gas-stations.html">Gas Stations</a>
          <a href="${root}pages/multi-location.html">Multi-Location Operators</a>
        </div>
      </div>
      <a href="${root}pages/about.html" class="nav__link--aux">About</a>
      <a href="${root}pages/faq.html" class="nav__link--aux">FAQ</a>
      <a href="${root}pages/blog.html" class="nav__link--aux">Blog</a>
    </div>
    <div class="nav-right">
      <a href="tel:+12052108121" class="nav__phone">📞 (205) 210-8121</a>
      <a href="${root}index.html#contact" class="btn btn--primary nav__cta">Get Started</a>
    </div>
  <button class="nav__hamburger" id="hamburger" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
  <div class="nav__mobile" id="mobile-nav">
    <div class="nav__mobile-section">ATM Services</div>
    <a href="${root}pages/free-atm-placement.html">Free ATM Placement</a>
    <a href="${root}pages/atm-partnership.html">ATM Partnership Program</a>
    <a href="${root}pages/buy-atm.html">Buy an ATM</a>
    <a href="${root}pages/mobile-atm-events.html">Mobile ATMs for Events</a>
    <a href="${root}pages/cash-loading.html">Cash Loading Services</a>
    <a href="${root}pages/outdoor-atm.html">Outdoor ATM Placement</a>
    <a href="${root}pages/wireless-atm.html">Wireless ATM Service</a>
    <a href="${root}pages/atm-processing.html">ATM Processing</a>
    <a href="${root}pages/atm-route-acquisition.html">ATM Route Acquisition</a>
    <a href="${root}pages/atm-route-acquisition.html">Sell Your ATM or Route</a>
    <div class="nav__mobile-section">Payment</div>
    <a href="${root}pages/merchant-services.html">Merchant Services</a>
    <div class="nav__mobile-section">Service Areas</div>
    <a href="${root}pages/atm-birmingham-al.html">Birmingham, AL</a>
    <a href="${root}pages/atm-montgomery-al.html">Montgomery, AL</a>
    <a href="${root}pages/atm-tuscaloosa-al.html">Tuscaloosa, AL</a>
    <a href="${root}pages/tuscaloosa-strip.html">The Strip — Tuscaloosa</a>
    <a href="${root}pages/bars-nightclubs.html">Bars &amp; Nightclubs</a>
    <a href="${root}pages/convenience-stores.html">Convenience Stores</a>
    <a href="${root}pages/gentlemens-clubs.html">Gentlemen's Clubs</a>
    <a href="${root}pages/gas-stations.html">Gas Stations</a>
    <a href="${root}pages/multi-location.html">Multi-Location Operators</a>
    <div class="nav__mobile-section">Company</div>
    <a href="${root}pages/about.html">About</a>
    <a href="${root}pages/faq.html">FAQ</a>
    <a href="${root}pages/blog.html">Blog</a>
    <a href="${root}index.html#contact" style="color:var(--gold);margin-top:8px;">📞 (205) 210-8121</a>
  </div>
</nav>`;

// ── HAMBURGER TOGGLE ──
// Uses document-level delegation so it works regardless of DOM timing
document.addEventListener('click', function(e) {
  var btn = e.target.closest('#hamburger, .nav__hamburger');
  if (!btn) return;
  var mobileNav = document.getElementById('mobile-nav');
  if (!mobileNav) return;
  var isOpen = mobileNav.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  var spans = btn.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
// Close mobile nav when a nav link is clicked (also delegated)
document.addEventListener('click', function(e) {
  var link = e.target.closest('#mobile-nav a');
  if (!link) return;
  var mobileNav = document.getElementById('mobile-nav');
  var btn = document.querySelector('#hamburger, .nav__hamburger');
  if (!mobileNav || !btn) return;
  mobileNav.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  var spans = btn.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
});

// ── FOOTER ──
document.getElementById('site-footer').innerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div>
        <div class="footer__brand-name">Ford Frontier <span>Investments</span></div>
        <div class="footer__brand-tag">Alabama's ATM Experts</div>
        <p class="footer__brand-desc">Independent ATM Deployer (IAD) headquartered in Birmingham, Alabama. We install, service, and operate ATMs for businesses across Alabama — at no cost to you. We process all major networks.</p>
        <div class="footer__contact-item">📞 <a href="tel:+12052108121">(205) 210-8121</a></div>
        <div class="footer__contact-item">✉ <a href="mailto:Landon@fordfrontierinvestments.com">Landon@fordfrontierinvestments.com</a></div>
        <div class="footer__contact-item">📍 Birmingham, Alabama</div>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">ATM Services</div>
        <a href="${root}pages/free-atm-placement.html">Free ATM Placement</a>
        <a href="${root}pages/atm-partnership.html">ATM Partnership</a>
        <a href="${root}pages/buy-atm.html">Buy an ATM</a>
        <a href="${root}pages/mobile-atm-events.html">Mobile ATMs for Events</a>
        <a href="${root}pages/cash-loading.html">Cash Loading</a>
        <a href="${root}pages/wireless-atm.html">Wireless ATM Service</a>
        <a href="${root}pages/atm-processing.html">ATM Processing</a>
        <a href="${root}pages/atm-route-acquisition.html">Route Acquisition</a>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">Payment Services</div>
        <a href="${root}pages/merchant-services.html">Merchant Services</a>
        <a href="${root}pages/merchant-services.html#rate-tracker">Rate Tracker Program</a>
        <a href="${root}pages/atm-processing.html">ATM Transaction Processing</a>
        <a href="${root}pages/wireless-atm.html">Wireless Connectivity</a>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">Service Areas</div>
              <a href="${root}pages/atm-birmingham-al.html">Birmingham, AL</a>
        <a href="${root}pages/atm-montgomery-al.html">Montgomery, AL</a>
        <a href="${root}pages/atm-tuscaloosa-al.html">Tuscaloosa, AL</a>
        <a href="${root}index.html#contact">All of Alabama</a>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">Company</div>
        <a href="${root}pages/about.html">About Ford Frontier</a>
        <a href="${root}pages/contact.html">Contact Us</a>
        <a href="${root}pages/faq.html">FAQ</a>
        <a href="${root}pages/blog.html">ATM Business Blog</a>
        <a href="${root}pages/buy-atm.html">ATM Catalog</a>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__copy">© 2025 Ford Frontier Investments, LLC. All rights reserved. Birmingham, Alabama.</div>
      <div class="footer__legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
  <div style="text-align:center;padding:8px 0 4px;border-top:1px solid #222;margin-top:12px;">
    <a href="/admin/lead.html" target="_blank" style="color:#444;font-size:11px;text-decoration:none;letter-spacing:1px;">ADMIN</a>
  </div>
</footer>`;

// ── SITEWIDE CART (buy-atm page only) ──
if (window.location.pathname.includes('buy-atm') || window.location.pathname.includes('/atm/')) {
// Inject cart button and drawer into every page
(function() {
  const cartHTML = `
    <button class="cart-btn" id="ffi-cart-btn" aria-label="View Cart">
      🛒
      <span class="cart-badge" id="cart-badge"></span>
    </button>
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-drawer" id="cart-drawer">
      <div class="cart-drawer__head">
        <span class="cart-drawer__title">Your Order</span>
        <button class="cart-close" id="cart-close-btn">✕</button>
      </div>
      <div class="cart-drawer__body" id="cart-body">
        <div class="cart-empty">No items yet</div>
      </div>
      <div class="cart-drawer__foot" id="cart-foot" style="display:none;">
        <div class="cart-total">
          <span class="cart-total__label">Order Total</span>
          <span class="cart-total__amount" id="cart-total-amt">$0</span>
        </div>
        <p style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:16px;line-height:1.5;">Free shipping nationwide. Tax calculated where required. Pay securely by card or bank account (ACH) on the next page.</p>
        <p id="cart-error" style="color:#e05252;font-size:13px;display:none;margin-bottom:12px;"></p>
        <button class="btn btn--primary" id="cart-checkout-btn" style="width:100%;justify-content:center;">Proceed to Checkout</button>
      </div>
    </div>
`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = cartHTML;
  document.body.appendChild(wrapper);

  // ── CART STATE (global so product pages can call window.ffiCart.add()) ──
  window.ffiCart = (function() {
    let cart = [];

    function fmt(n) {
      return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function render() {
      const body   = document.getElementById('cart-body');
      const foot   = document.getElementById('cart-foot');
      const badge  = document.getElementById('cart-badge');

      if (!body) return;

      if (cart.length === 0) {
        body.innerHTML = '<div class="cart-empty">No items yet</div>';
        foot.style.display = 'none';
        badge.style.display = 'none';
        return;
      }

      badge.style.display = 'flex';
      badge.textContent = cart.length;
      foot.style.display = 'block';

      let html = '';
      let total = 0;
      cart.forEach(function(item) {
        total += item.price;
        html += '<div class="cart-item">' +
          '<div class="cart-item__name">' + item.machine + '</div>' +
          '<div class="cart-item__config">' + item.cassette +
            (item.addons.length ? '<br>' + item.addons.join(', ') : '') + '</div>' +
          '<div class="cart-item__price">' + fmt(item.price) + '</div>' +
          '<button class="cart-item__remove" onclick="ffiCart.remove(' + item.id + ')">Remove</button>' +
          '</div>';
      });
      body.innerHTML = html;
      document.getElementById('cart-total-amt').textContent = fmt(total);
    }

    function openCart() {
      document.getElementById('cart-drawer').classList.add('open');
      document.getElementById('cart-overlay').classList.add('open');
    }

    function closeCart() {
      document.getElementById('cart-drawer').classList.remove('open');
      document.getElementById('cart-overlay').classList.remove('open');
    }

    // Send the cart to Stripe Checkout. The server re-prices every item from
    // its own catalog, so only SKUs and option keys are sent.
    function checkout() {
      if (cart.length === 0) return;
      const btn = document.getElementById('cart-checkout-btn');
      const err = document.getElementById('cart-error');
      btn.disabled = true;
      btn.textContent = 'Redirecting to secure checkout...';
      err.style.display = 'none';

      fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'atm', items: cart.map(function(i) { return i.config; }) })
      })
        .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
        .then(function(r) {
          if (!r.ok || !r.data.url) throw new Error(r.data.error || 'Checkout failed');
          if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
          window.location.href = r.data.url;
        })
        .catch(function(e) {
          err.textContent = e.message || 'Something went wrong. Please call (205) 210-8121.';
          err.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Proceed to Checkout';
        });
    }

    // Wire up buttons
    document.getElementById('ffi-cart-btn').addEventListener('click', openCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
    document.getElementById('cart-checkout-btn').addEventListener('click', checkout);

    return {
      add: function(item) {
        item.id = Date.now();
        cart.push(item);
        render();
        openCart();
      },
      remove: function(id) {
        cart = cart.filter(function(i) { return i.id !== id; });
        render();
      },
      openCart: openCart,
      checkout: checkout,
      fmt: fmt
    };
  })();

})();

}
