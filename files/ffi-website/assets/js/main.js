// FAQ accordion
document.querySelectorAll('.faq-item__q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    item.classList.toggle('open');
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

// Active nav link
const currentPage = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
document.querySelectorAll('.nav-center a, .nav__dropdown-menu a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href.includes(currentPage) && currentPage !== '') a.style.color = 'var(--gold)';
});

// ── HERO COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const countDown = el.dataset.countDown ? parseInt(el.dataset.countDown, 10) : null;
  const duration = 1600; // ms
  const start = performance.now();

  if (countDown !== null) {
    // Count DOWN from countDown to 0
    const from = countDown;
    const to = 0;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(from - eased * (from - to));
      el.textContent = prefix + (current > 0 ? current.toLocaleString() : '0');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + '0';
    };
    requestAnimationFrame(step);
  } else {
    // Count UP from 0 to target
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + (progress >= 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

// Trigger counters when hero stats enter viewport
const statEls = document.querySelectorAll('.hero__stat-num[data-count], .hero__stat-num[data-count-down]');
if (statEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => counterObserver.observe(el));
}

// ── CONTACT FORM → Web3Forms (sends to Landon@fordfrontierinvestments.com) ──
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);

    try {
      const res = await fetch('https://hook.us2.make.com/aq1gnoiw6yd807k79n4v7ahbgqhvyjsd', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#2d7a3a';
        btn.style.borderColor = '#2d7a3a';
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      btn.textContent = 'Error — Try Again';
      btn.style.background = '#a33';
      btn.style.borderColor = '#a33';
      btn.disabled = false;
      console.error('Form error:', err);
    }
  });
}
