/* ==========================================================================
   WYNEX — main.js
   Vanilla ES2019, no dependencies, ~5 KB. Every feature degrades gracefully:
   with JavaScript disabled the page is still fully readable, navigable and
   the FAQ accordions still work (native <details>).

   To customise: change CONTACT below, or just edit the HTML — every link and
   value on the page is plain markup and works without this file.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------- contact details
     Kept here only for the bits JS has to build itself (mailto body, copy
     text). The visible links in the HTML are hand-written so they still work
     if this file never loads.                                              */
  var CONTACT = {
    email: 'ajlanabduljlaeel@gmail.com',   /* EDIT */
    upi: 'ajlanwynex@upi'                   /* EDIT */
  };

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------- 1. toast */
  var toastEl = $('#toast');
  var toastTimer;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.hidden = true; }, 2800);
  }

  /* ------------------------------------------------- 2. clipboard helpers */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  /* "Copy UPI ID" buttons */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      copyText(value).then(function () {
        var original = btn.textContent;
        btn.textContent = btn.getAttribute('data-copied') || 'Copied';
        toast(value + ' copied to clipboard');
        window.setTimeout(function () { btn.textContent = original; }, 1800);
      })['catch'](function () {
        toast('Copy failed — please note it down manually: ' + value);
      });
    });
  });

  /* "Book with UPI" deep links.
     On Android these open the UPI app; on desktop the OS has no handler, so we
     quietly put the UPI ID on the clipboard and say so. The click is never
     cancelled, so mobile apps still open normally. */
  $$('[data-upi-copy]').forEach(function (link) {
    link.addEventListener('click', function () {
      var value = link.getAttribute('data-upi-copy');
      copyText(value).then(function () {
        toast('UPI ID copied — complete the payment in your UPI app');
      })['catch'](function () { /* clipboard blocked: the link still works on mobile */ });
    });
  });

  /* --------------------------------------------- 3. sticky header + active nav */
  var head = $('.site-head');
  var navLinks = $$('.nav-list a');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;

      if (head) head.classList.toggle('is-stuck', y > 8);

      /* the current section is the last one whose top has passed the header */
      var line = y + (head ? head.offsetHeight : 64) + 24;
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= line) current = sections[i];
      }
      /* near the bottom of the page the last section wins even if it is short */
      if (window.innerHeight + y >= document.body.scrollHeight - 2) {
        current = sections[sections.length - 1] || null;
      }
      navLinks.forEach(function (a) {
        var on = !!current && a.getAttribute('href') === '#' + current.id;
        a.classList.toggle('is-current', on);
        if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
      });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------- 4. mobile navigation */
  var toggle = $('#navToggle');
  var nav = $('#nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    /* close after choosing a destination */
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setNav(false);
    });
  }

  /* ------------------------------------------------------ 5. scroll reveal */
  var GROUPS = [
    ['.hero .pill', '.hero h1', '.hero .lead', '.hero .btn-row', '.hero .facts'],
    ['.trust-strip .trust-strip-label', '.trust-strip .trust-items li'],
    ['#demos .sec-head', '#demos .demo', '#demos .demo-cta'],
    ['#who .sec-head', '#who .card'],
    ['#why .sec-head', '#why .card'],
    ['#includes .sec-head', '#includes .deliver li', '#includes .btn-row'],
    ['#pricing .sec-head', '#pricing .plan', '#pricing .note'],
    ['#ownership .ownership-text > *', '#ownership .own-card'],
    ['#trust .trust > *'],
    ['#faq .sec-head', '#faq .qa', '#faq .policy'],
    ['#process .sec-head', '#process .step'],
    ['#contact .sec-head', '#contact .cta-box > *', '#contact .form'],
  ];

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var items = [];
    GROUPS.forEach(function (selectors) {
      var group = [];
      selectors.forEach(function (sel) { group = group.concat($$(sel)); });
      /* de-dupe: an element matched by two selectors is revealed once */
      group = group.filter(function (el, i) { return group.indexOf(el) === i; });
      group.forEach(function (el, i) {
        el.setAttribute('data-reveal', '');
        el.style.setProperty('--rd', Math.min(i * 0.07, 0.35).toFixed(2) + 's');
        items.push(el);
      });
    });

    document.documentElement.classList.add('js-reveal');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    items.forEach(function (el) { io.observe(el); });
  }

  initReveal();

  /* --------------------------------------------------- 6. contact form
     Static site, no backend: the form validates, then hands a pre-filled
     message to the visitor's own mail app. Swap this block for a fetch() to
     Formspree / Web3Forms / your own endpoint when you have one.          */
  var form = $('#contactForm');

  if (form) {
    var note = $('#formNote');
    var defaultNote = note ? note.textContent.trim() : '';

    function fieldError(input, message) {
      var field = input.closest('.field');
      var slot = field ? $('.err', field) : null;
      if (field) field.classList.toggle('has-err', !!message);
      if (slot) slot.textContent = message || '';
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validate(input) {
      var value = input.value.trim();
      if (input.hasAttribute('required') && !value) {
        fieldError(input, 'Please fill this in.');
        return false;
      }
      if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        fieldError(input, 'Please enter a valid email address.');
        return false;
      }
      if (input.id === 'f-msg' && value && value.length < 10) {
        fieldError(input, 'A little more detail helps us quote accurately (10+ characters).');
        return false;
      }
      fieldError(input, '');
      return true;
    }

    var checked = ['#f-name', '#f-email', '#f-msg'].map(function (s) { return $(s); }).filter(Boolean);

    checked.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-err')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = checked.map(validate).every(Boolean);
      if (!ok) {
        var firstBad = $('.field.has-err input, .field.has-err textarea', form);
        if (firstBad) firstBad.focus();
        if (note) {
          note.textContent = 'Please fix the highlighted fields and try again.';
          note.className = 'form-note is-bad';
        }
        return;
      }

      var data = new FormData(form);
      var subject = 'Portfolio enquiry — ' + (data.get('need') || 'General') + ' — ' + (data.get('name') || '');
      var body = [
        'Name: ' + data.get('name'),
        'Email: ' + data.get('email'),
        'Interested in: ' + data.get('need'),
        '',
        'Project details:',
        data.get('message'),
        '',
        '— Sent from the WYNEX website contact form'
      ].join('\n');

      if (note) {
        note.textContent = 'Opening your email app with the message filled in. If nothing happens, email us at ' + CONTACT.email + '.';
        note.className = 'form-note is-ok';
      }
      window.location.href = 'mailto:' + CONTACT.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.setTimeout(function () {
        if (note) { note.textContent = defaultNote; note.className = 'form-note'; }
      }, 12000);
    });
  }

  /* ------------------------------------------------------ 7. placeholder
     Demo links are "#" until real URLs are added. Saying so is better than a
     dead link that silently scrolls to the top.                         */
  $$('[data-demo-placeholder]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
        e.preventDefault();
        toast('Demo link coming soon — ask us on WhatsApp to see a preview');
      }
    });
  });

  /* ------------------------------------------------------------ 8. footer */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
