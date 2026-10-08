/* WYNEX — slim interactions. Vanilla, no deps. Works without JS (native details, plain links). */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme: light default, toggle in hero, remembered */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function paintTheme(t) {
    if (t === 'dark') document.documentElement.dataset.theme = 'dark';
    else document.documentElement.removeAttribute('data-theme');
    $$('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-set') === t));
    });
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0d0d10' : '#faf9f5');
  }
  var saved = null;
  try { saved = localStorage.getItem('wynex-theme'); } catch (e) { saved = null; }
  paintTheme(saved === 'dark' ? 'dark' : 'light');
  $$('[data-theme-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-theme-set');
      try { localStorage.setItem('wynex-theme', t); } catch (e) { /* private mode */ }
      paintTheme(t);
    });
  });

  /* sticky header + active nav */
  var head = $('.site-head');
  var links = $$('.nav-list a');
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || 0;
      if (head) head.classList.toggle('is-stuck', y > 8);
      var line = y + (head ? head.offsetHeight : 64) + 24, cur = null, i;
      for (i = 0; i < secs.length; i++) if (secs[i].offsetTop <= line) cur = secs[i];
      if (window.innerHeight + y >= document.body.scrollHeight - 2) cur = secs[secs.length - 1] || null;
      links.forEach(function (a) {
        var on = !!cur && a.getAttribute('href') === '#' + cur.id;
        a.classList.toggle('is-current', on);
        on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  var toggle = $('#navToggle'), nav = $('#nav');
  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setNav(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 820) setNav(false); });
  }

  /* scroll reveal */
  function show(el) {
    el.classList.add('is-in');
    window.setTimeout(function () { el.removeAttribute('data-reveal'); }, 900);
  }
  var items = [];
  if (!reduceMotion && 'IntersectionObserver' in window) {
    items = $$('[data-reveal]').filter(function (el) { return !el.closest('details:not([open])'); });
    items.forEach(function (el, i) { el.style.setProperty('--rd', Math.min((i % 4) * 0.06, 0.2).toFixed(2) + 's'); });
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
    window.addEventListener('load', function () {
      var lim = (window.innerHeight || 800) * 0.94;
      items.forEach(function (el) { if (el.getBoundingClientRect().top < lim) show(el); });
    });
  }

  /* year */
  var yr = $('#year');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
