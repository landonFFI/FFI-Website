// Detect root vs pages/ subfolder
const isPages = window.location.pathname.includes('/pages/');
const root = isPages ? '../' : './';

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
        </div>
      </div>
      <a href="${root}pages/about.html">About</a>
      <a href="${root}pages/faq.html">FAQ</a>
      <a href="${root}pages/blog.html">Blog</a>
    </div>
    <a href="tel:4047473899" class="nav__phone">📞 (404) 747-3899</a>
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
    <div class="nav__mobile-section">Payment</div>
    <a href="${root}pages/merchant-services.html">Merchant Services</a>
    <div class="nav__mobile-section">Service Areas</div>
    <a href="${root}pages/atm-birmingham-al.html">Birmingham, AL</a>
    <a href="${root}pages/atm-montgomery-al.html">Montgomery, AL</a>
    <a href="${root}pages/atm-tuscaloosa-al.html">Tuscaloosa, AL</a>
    <div class="nav__mobile-section">Company</div>
    <a href="${root}pages/about.html">About</a>
    <a href="${root}pages/faq.html">FAQ</a>
    <a href="${root}pages/blog.html">Blog</a>
    <a href="${root}index.html#contact" style="color:var(--gold);margin-top:8px;">📞 (404) 747-3899</a>
  </div>
</nav>`;

// ── FOOTER ──
document.getElementById('site-footer').innerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div>
        <div class="footer__brand-name">Ford Frontier <span>Investments</span></div>
        <div class="footer__brand-tag">Alabama's ATM Experts</div>
        <p class="footer__brand-desc">Independent ATM Deployer (IAD) headquartered in Birmingham, Alabama. We install, service, and operate ATMs for businesses across Alabama — at no cost to you. We process all major networks.</p>
        <div class="footer__contact-item">📞 <a href="tel:4047473899">(404) 747-3899</a></div>
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
