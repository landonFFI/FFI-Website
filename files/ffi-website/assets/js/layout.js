// Detect depth: root, /pages/, or /pages/atm/
const path = window.location.pathname;
const isAtmProduct = path.includes('/pages/atm/');
const isPages = path.includes('/pages/') && !isAtmProduct;
const root = isAtmProduct ? '../../' : (isPages ? '../' : './');

// ── NAV ──
document.getElementById('site-nav').innerHTML = `
<nav class="nav">
  <div class="nav__inner">
    <a href="${root}index.html" class="nav__logo">
      Ford Frontier <span>Investments</span>
      <small>Alabama's ATM Experts</small>
    </a>
    <div class="nav__links">
      <div class="nav__dropdown">
        <a href="#">ATM Services</a>
        <div class="nav__dropdown-menu">
          <a href="${root}pages/free-atm-placement.html">Free ATM Placement</a>
          <a href="${root}pages/atm-partnership.html">ATM Partnership Program</a>
          <a href="${root}pages/mobile-atm-events.html">Mobile ATMs for Events</a>
          <a href="${root}pages/cash-loading.html">Cash Loading Services</a>
          <a href="${root}pages/wireless-atm.html">Wireless ATM Service</a>
          <a href="${root}pages/atm-processing.html">ATM Processing</a>
          <a href="${root}pages/atm-route-acquisition.html">ATM Route Acquisition</a>
          <a href="${root}pages/bars-nightclubs.html">Bars &amp; Nightclubs</a>
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
        </div>
      </div>
      <a href="${root}pages/about.html">About</a>
      <a href="${root}pages/faq.html">FAQ</a>
      <a href="${root}pages/blog.html">Blog</a>
    </div>
    <a href="tel:2052108121" class="nav__phone">📞 (205) 210-8121</a>
    <a href="${root}index.html#contact" class="btn btn--primary nav__cta">Get Started</a>
    <button class="nav__hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav__mobile" id="mobile-nav">
    <div class="nav__mobile-section">ATM Services</div>
    <a href="${root}pages/free-atm-placement.html">Free ATM Placement</a>
    <a href="${root}pages/atm-partnership.html">ATM Partnership Program</a>
    <a href="${root}pages/buy-atm.html">Buy an ATM</a>
    <a href="${root}pages/mobile-atm-events.html">Mobile ATMs for Events</a>
    <a href="${root}pages/cash-loading.html">Cash Loading Services</a>
    <a href="${root}pages/wireless-atm.html">Wireless ATM Service</a>
    <a href="${root}pages/atm-processing.html">ATM Processing</a>
    <a href="${root}pages/atm-route-acquisition.html">ATM Route Acquisition</a>
    <a href="${root}pages/bars-nightclubs.html">Bars &amp; Nightclubs</a>
    <div class="nav__mobile-section">Payment</div>
    <a href="${root}pages/merchant-services.html">Merchant Services</a>
    <div class="nav__mobile-section">Service Areas</div>
    <a href="${root}pages/atm-birmingham-al.html">Birmingham, AL</a>
    <a href="${root}pages/atm-montgomery-al.html">Montgomery, AL</a>
    <a href="${root}pages/atm-tuscaloosa-al.html">Tuscaloosa, AL</a>
    <a href="${root}pages/tuscaloosa-strip.html">The Strip — Tuscaloosa</a>
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
        <div class="footer__contact-item">📞 <a href="tel:2052108121">(205) 210-8121</a></div>
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
        <a href="${root}index.html#contact">Contact Us</a>
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
</footer>`;

// ── SITEWIDE CART (buy-atm page only) ──
if (window.location.pathname.includes('buy-atm') || window.location.pathname.includes('/atm/')) {
// Inject cart button, drawer, and checkout modal into every page
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
        <p style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:16px;line-height:1.5;">Free shipping nationwide. Tax calculated where required. You will NOT be charged now — we will contact you within 24 hours to confirm your order and process payment.</p>
        <button class="btn btn--primary" id="cart-checkout-btn" style="width:100%;justify-content:center;">Proceed to Checkout</button>
      </div>
    </div>
    <div class="checkout-overlay" id="checkout-overlay">
      <div class="checkout-modal">
        <button class="checkout-modal__close" id="checkout-close-btn">✕</button>
        <div id="checkout-form-wrap">
          <h2>Complete Your Order</h2>
          <p class="sub">Fill out your info and we'll contact you within 24 hours to confirm your order, collect payment, and send paperwork.</p>
          <div class="order-summary-box" id="checkout-summary"></div>
          <div class="checkout-fields">
            <div class="checkout-row">
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" class="form-input" id="co-first" placeholder="John" />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name *</label>
                <input type="text" class="form-input" id="co-last" placeholder="Smith" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-input" id="co-email" placeholder="john@yourbusiness.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="co-phone" placeholder="(555) 000-0000" />
            </div>
            <div class="form-group">
              <label class="form-label">Business Name</label>
              <input type="text" class="form-input" id="co-biz" placeholder="Your Business Name" />
            </div>
            <div class="form-group">
              <label class="form-label">Shipping Address *</label>
              <input type="text" class="form-input" id="co-address" placeholder="123 Main St, City, State, ZIP" />
            </div>
            <div class="form-group">
              <label class="form-label">Notes / Questions</label>
              <textarea class="form-textarea" id="co-notes" placeholder="Any questions or special requests..."></textarea>
            </div>
            <p id="co-error" style="color:#e05252;font-size:13px;display:none;"></p>
            <button class="btn btn--primary" id="co-submit-btn" style="width:100%;justify-content:center;padding:18px;">
              Submit Order Request →
            </button>
            <p style="font-size:11px;color:rgba(255,255,255,0.3);text-align:center;line-height:1.6;margin-top:8px;">No payment collected now. We'll reach out within 24 hours.</p>
          </div>
        </div>
        <div class="success-state" id="success-state">
          <div class="success-state__icon">✅</div>
          <h2>Order Received!</h2>
          <p>Thanks — we'll reach out to <strong id="success-email" style="color:var(--gold);"></strong> within 24 hours to confirm your order, collect payment, and send your processing paperwork.</p>
          <br/>
          <button class="btn btn--ghost" id="success-close-btn" style="margin:0 auto;">Close</button>
        </div>
      </div>
    </div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = cartHTML;
  document.body.appendChild(wrapper);

  // ── CART STATE (global so product pages can call window.ffiCart.add()) ──
  window.ffiCart = (function() {
    const FORMSPREE = 'https://formspree.io/f/YOUR_FORM_ID';

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
            (item.addons.length ? '<br>' + item.addons.join(', ') : '') +
            '<br>Payment: ' + item.payment + '</div>' +
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

    function openCheckout() {
      if (cart.length === 0) return;
      let summaryHTML = '<div class="order-summary-box__title">Order Summary</div>';
      let total = 0;
      cart.forEach(function(item) {
        total += item.price;
        summaryHTML += '<div class="order-summary-box__item"><span>' + item.machine + ' — ' + item.cassette + '</span><span>' + fmt(item.price) + '</span></div>';
        item.addons.forEach(function(a) {
          summaryHTML += '<div class="order-summary-box__item" style="padding-left:12px;font-size:12px;color:rgba(255,255,255,0.4)"><span>+ ' + a + '</span></div>';
        });
      });
      summaryHTML += '<div class="order-summary-box__total"><span>Total</span><span>' + fmt(total) + '</span></div>';
      document.getElementById('checkout-summary').innerHTML = summaryHTML;
      closeCart();
      document.getElementById('checkout-overlay').classList.add('open');
    }

    function closeCheckout() {
      document.getElementById('checkout-overlay').classList.remove('open');
    }

    function submitOrder() {
      const first   = document.getElementById('co-first').value.trim();
      const last    = document.getElementById('co-last').value.trim();
      const email   = document.getElementById('co-email').value.trim();
      const phone   = document.getElementById('co-phone').value.trim();
      const address = document.getElementById('co-address').value.trim();
      const biz     = document.getElementById('co-biz').value.trim();
      const notes   = document.getElementById('co-notes').value.trim();
      const err     = document.getElementById('co-error');

      if (!first || !last || !email || !phone || !address) {
        err.textContent = 'Please fill in all required fields.';
        err.style.display = 'block';
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        err.textContent = 'Please enter a valid email address.';
        err.style.display = 'block';
        return;
      }
      err.style.display = 'none';

      const total = cart.reduce(function(s, i) { return s + i.price; }, 0);
      const orderDetails = cart.map(function(item) {
        return item.machine + ' — ' + item.cassette +
          (item.addons.length ? ' + ' + item.addons.join(', ') : '') +
          ' (' + item.payment + '): ' + fmt(item.price);
      }).join('\n');

      fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: first + ' ' + last,
          email: email, phone: phone,
          business: biz || 'Not provided',
          shipping_address: address,
          order_details: orderDetails,
          order_total: fmt(total),
          notes: notes || 'None',
          _subject: 'New ATM Order — ' + first + ' ' + last + ' — ' + fmt(total)
        })
      }).finally(function() {
        document.getElementById('checkout-form-wrap').style.display = 'none';
        document.getElementById('success-state').style.display = 'block';
        document.getElementById('success-email').textContent = email;
        cart = [];
        render();
      });
    }

    // Wire up buttons
    document.getElementById('ffi-cart-btn').addEventListener('click', openCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
    document.getElementById('cart-checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('checkout-close-btn').addEventListener('click', closeCheckout);
    document.getElementById('co-submit-btn').addEventListener('click', submitOrder);
    document.getElementById('success-close-btn').addEventListener('click', closeCheckout);

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
      openCheckout: openCheckout,
      fmt: fmt
    };
  })();

})();

}
