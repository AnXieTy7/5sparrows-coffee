/* 5 Sparrows — small enhancements only (theme toggle, mobile nav, scroll reveal) */

(function () {
  'use strict';

  // ---------- Theme toggle ----------
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  let userTheme = null; // in-memory only (localStorage not available in some sandboxes)

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  // Default: respect system
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(prefersDark.matches ? 'dark' : 'light');

  prefersDark.addEventListener('change', (e) => {
    if (!userTheme) applyTheme(e.matches ? 'dark' : 'light');
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      userTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(userTheme);
    });
  }

  // ---------- Mobile nav ----------
  const navToggle = document.querySelector('.nav__toggle');
  const nav = document.querySelector('.nav');
  const navBackdrop = document.querySelector('.nav-backdrop');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    if (navBackdrop) navBackdrop.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      setNav(!nav.classList.contains('is-open'));
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setNav(false))
    );
    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => setNav(false));
    }
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setNav(false);
    });
    // If viewport grows past mobile breakpoint, ensure menu is closed.
    window.matchMedia('(min-width: 881px)').addEventListener('change', (e) => {
      if (e.matches) setNav(false);
    });
  }

  // ---------- Sticky header shadow ----------
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Reveal-on-scroll ----------
  const revealTargets = document.querySelectorAll(
    '.about__media, .about__copy, .service, .menu__col, .gallery__item, .testimonial, .ig-tile, .process__steps li, .book__copy, .book__form'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));

    // Safety net: if for any reason an element is still hidden after 8s
    // (e.g. prerender / scroll-snapshot tools), force-show it.
    setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    }, 8000);
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Year ----------
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
