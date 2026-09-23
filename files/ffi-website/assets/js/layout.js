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

// Detect depth: root, /pages/, or two levels deep (/pages/atm/, /pages/blog/)
const path = window.location.pathname;
const isAtmProduct = path.includes('/pages/atm/') || path.includes('/pages/blog/');
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
  <a href="${root}pages/cart.html" class="nav__cart" id="nav-cart" aria-label="Cart, 0 items">
    <svg class="nav__cart-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
    <span class="nav__cart-count" id="nav-cart-count" hidden>0</span>
  </a>
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

// ── STORE (cart icon, drawer, configurator) ──
// store.js runs on every page so the cart badge and drawer are always there.
(function() {
  var script = document.createElement('script');
  script.src = root + 'assets/js/store.js';
  document.body.appendChild(script);
})();
