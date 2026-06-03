/**
 * =====================================================
 *  NEXUS ANALYTICS — MAIN JAVASCRIPT
 *  All UI logic + Amplitude event tracking
 * =====================================================
 */

// ── NAV SCROLL BEHAVIOUR ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── MOBILE MENU ──────────────────────────────────────
function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  m.classList.toggle('open');
}

// ── SCROLL ANIMATIONS ────────────────────────────────
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;
    el.textContent = (isFloat ? value.toFixed(1) : Math.round(value).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// ── CTA HANDLER ──────────────────────────────────────
// This is the main function tracked in Amplitude
function handleCTA(buttonName, section) {
  // Track CTA click in Amplitude
  trackEvent('CTA Clicked', {
    button: buttonName,
    section: section,
    url: window.location.href,
  });

  // Open the appropriate modal
  if (buttonName === 'Request Demo') {
    openModal('demoModal');
  } else {
    openModal('signupModal');
  }
}

// ── NAV TRACKING ─────────────────────────────────────
function trackNav(item) {
  trackEvent('Nav Clicked', { item });
}

// ── FEATURE VIEW TRACKING ─────────────────────────────
function trackFeatureView(featureName) {
  trackEvent('Feature Viewed', { feature: featureName });
}

// ── PRICING TRACKING ─────────────────────────────────
function trackPricingView(plan) {
  trackEvent('Pricing Plan Viewed', { plan });
}

// ── FORM SUBMIT ──────────────────────────────────────
function handleFormSubmit(type) {
  const isDemo = type === 'Request Demo';

  const name = document.getElementById(isDemo ? 'demoName' : 'signupName').value.trim();
  const email = document.getElementById(isDemo ? 'demoEmail' : 'signupEmail').value.trim();

  if (!name || !email) {
    showToast('⚠️ Please fill in your name and email.');
    return;
  }
  if (!email.includes('@')) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }

  // Track form submission
  trackEvent('Form Submitted', {
    form_type: type,
    has_company: isDemo ? !!document.getElementById('demoCompany').value : false,
    team_size: isDemo ? document.getElementById('demoTeamSize').value : null,
  });

  // Identify the user in Amplitude
  identifyUser(email, {
    name: name,
    email: email,
    sign_up_type: type,
    sign_up_date: new Date().toISOString(),
  });

  // Close modal and show success
  closeModal(isDemo ? 'demoModal' : 'signupModal');

  if (isDemo) {
    showToast('🎉 Demo booked! Check your inbox for a calendar invite.');
  } else {
    showToast('✅ Account created! Welcome to Nexus Analytics.');
  }

  // Add a live event to the dashboard mockup
  addLiveEvent('Form Submitted', `type: ${type}`, 'cta');
}

// ── MODAL CONTROLS ───────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';

  const label = id === 'demoModal' ? 'Demo Modal' : 'Sign Up Modal';
  trackEvent('Modal Opened', { modal: label });
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

// ── TOAST NOTIFICATIONS ───────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── LIVE EVENT STREAM SIMULATION ─────────────────────
const eventNames = [
  { name: 'Page View', prop: 'path: /pricing', type: 'page' },
  { name: 'Page View', prop: 'path: /features', type: 'page' },
  { name: 'CTA Clicked', prop: 'button: Sign Up', type: 'cta' },
  { name: 'CTA Clicked', prop: 'button: Request Demo', type: 'cta' },
  { name: 'Feature Viewed', prop: 'feature: Funnels', type: 'page' },
  { name: 'Feature Viewed', prop: 'feature: Cohorts', type: 'page' },
  { name: 'Pricing Plan Viewed', prop: 'plan: Growth', type: 'cta' },
  { name: 'Form Submitted', prop: 'type: Sign Up', type: 'cta' },
];

function addLiveEvent(name, prop, type, isNew = true) {
  const stream = document.getElementById('eventStream');
  if (!stream) return;

  const item = document.createElement('div');
  item.className = 'event-item';
  item.innerHTML = `
    <span class="event-dot ${type}"></span>
    <span class="event-name">${name}</span>
    <span class="event-prop">${prop}</span>
    <span class="event-time">${isNew ? 'just now' : '1s ago'}</span>
  `;

  stream.insertBefore(item, stream.firstChild);
  if (stream.children.length > 4) {
    stream.removeChild(stream.lastChild);
  }

  // Update times of existing items
  Array.from(stream.children).forEach((el, i) => {
    const timeEl = el.querySelector('.event-time');
    if (i === 0) timeEl.textContent = 'just now';
    else if (i === 1) timeEl.textContent = '2s ago';
    else if (i === 2) timeEl.textContent = '5s ago';
    else timeEl.textContent = `${(i + 1) * 3}s ago`;
  });
}

// Auto-simulate events every few seconds to show Amplitude working
setInterval(() => {
  const ev = eventNames[Math.floor(Math.random() * eventNames.length)];
  addLiveEvent(ev.name, ev.prop, ev.type);
}, 3500);

// ── SECTION VIEW TRACKING ────────────────────────────
// Track when user scrolls to important sections
const sectionTracker = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.id) {
      trackEvent('Section Viewed', { section: entry.target.id });
    }
  });
}, { threshold: 0.3 });

['features', 'pricing', 'how-it-works', 'testimonials'].forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionTracker.observe(el);
});

// ── SCROLL DEPTH TRACKING ─────────────────────────────
let scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
window.addEventListener('scroll', () => {
  const scrollPct = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );
  [25, 50, 75, 100].forEach(milestone => {
    if (scrollPct >= milestone && !scrollMilestones[milestone]) {
      scrollMilestones[milestone] = true;
      trackEvent('Scroll Depth Reached', { depth_percent: milestone });
    }
  });
}, { passive: true });

// ── TIME ON PAGE ─────────────────────────────────────
const pageStartTime = Date.now();
window.addEventListener('beforeunload', () => {
  const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
  trackEvent('Page Exit', { time_on_page_seconds: timeOnPage });
});

console.log('[Nexus] All tracking initialized');
