/* Homepage interactions: sticky bar, scroll-spy, progress, reveal, mobile nav */
(function () {
  'use strict';

  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var navToggle = document.getElementById('navToggle');
  var toTop = document.getElementById('toTop');

  /* mobile nav */
  if (navToggle && topbar) {
    navToggle.addEventListener('click', function () {
      topbar.classList.toggle('open');
    });
    topbar.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { topbar.classList.remove('open'); });
    });
  }

  /* scroll effects */
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (topbar) topbar.classList.toggle('is-stuck', y > 12);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }

    if (toTop) toTop.classList.toggle('show', y > 520);

    /* scroll-spy */
    var sections = document.querySelectorAll('main section[id]');
    var current = '';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 140) current = s.id;
    });
    document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* back to top */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* visitor counter: if the StatCounter badge never loads and the busuanzi
     fallback never kicked in, hide the whole block (no broken-image icon). */
  setTimeout(function () {
    var box = document.querySelector('.visitors');
    var img = document.querySelector('.sc-badge');
    if (!box || !img) return;
    if (img.complete && img.naturalWidth > 0) return;      // 徽章已正常显示
    var fb = document.getElementById('bz-fallback');
    if (fb && fb.offsetParent !== null) return;             // 已回退到不蒜子
    box.style.display = 'none';
  }, 8000);
})();
