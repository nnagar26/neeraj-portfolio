// Mobile menu toggle
function toggleMenu(){
  const nav = document.getElementById('nav');
  const btn = document.querySelector('.menu');
  if (!nav || !btn) return;
  const isOpen = nav.classList.toggle('open');
  const icon = btn.querySelector('.menu-icon');
  const label = btn.querySelector('.menu-label');
  btn.setAttribute('aria-expanded', String(isOpen));
  btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  if (icon) icon.textContent = isOpen ? '✕' : '☰';
  if (label) label.textContent = isOpen ? 'Close menu' : 'Open menu';
}

const menuButton = document.querySelector('.menu');
if (menuButton) menuButton.addEventListener('click', toggleMenu);

const siteHeader = document.querySelector('.site-header');
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (_) {}
  const initial = saved === 'dark' || saved === 'light' ? saved : 'light';
  function setTheme(mode){
    root.setAttribute('data-theme', mode);
    try { localStorage.setItem('theme', mode); } catch (_) {}
    if (btn) {
      btn.textContent = mode === 'dark' ? '☀︎' : '🌙';
      btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', String(mode === 'dark'));
    }
  }
  setTheme(initial);
  if (btn) btn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

(function(){
  const els = [...document.querySelectorAll('[data-reveal], .card, .edu-item, .section h2')];
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
})();

(function(){
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    window.scrollTo({ top: Math.max(target.getBoundingClientRect().top + window.scrollY - headerHeight - 20, 0), behavior: 'smooth' });
    const nav = document.getElementById('nav');
    if (nav && nav.classList.contains('open')) toggleMenu();
  }));
})();

function throttle(func, limit) {
  let inThrottle = false;
  return function(...args) {
    if (inThrottle) return;
    func.apply(this, args);
    inThrottle = true;
    setTimeout(() => { inThrottle = false; }, limit);
  };
}
function applyScrollState(){
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 100);
  if (backToTopButton) backToTopButton.classList.toggle('show', window.scrollY > 400);
}
window.addEventListener('scroll', throttle(applyScrollState, 100), { passive: true });
applyScrollState();
