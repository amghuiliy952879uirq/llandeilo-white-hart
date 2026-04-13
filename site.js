/**
 * Site-wide behaviour (static HTML — no bundler).
 * Replaces former inline <script> blocks.
 * Mobile nav dropdown toggles are bound here (no inline onclick on .nav-dropdown > a).
 */
(function () {
  'use strict';

  function initMobileMenu() {
    var openMenuBtn = document.querySelector('.menu-open-btn');
    var closeMenuBtn = document.querySelector('.menu-close-btn');
    var mainNav = document.querySelector('.main-nav');
    if (!openMenuBtn || !closeMenuBtn || !mainNav) return;
    openMenuBtn.addEventListener('click', function () {
      mainNav.classList.add('active');
    });
    closeMenuBtn.addEventListener('click', function () {
      mainNav.classList.remove('active');
    });
  }

  function initLangToggle() {
    var langToggleBtns = document.querySelectorAll('.lang-toggle-btn');
    var savedLang = localStorage.getItem('site-lang') || 'en';
    if (savedLang === 'cy') document.body.classList.add('welsh');
    langToggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.body.classList.toggle('welsh');
        var currentLang = document.body.classList.contains('welsh') ? 'cy' : 'en';
        localStorage.setItem('site-lang', currentLang);
      });
    });
  }

  function initNavDropdowns() {
    document.querySelectorAll('.nav-dropdown > a').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        if (window.innerWidth > 992) return;
        e.preventDefault();
        var parent = toggle.parentElement;
        document.querySelectorAll('.nav-dropdown').forEach(function (d) {
          if (d !== parent) d.classList.remove('active');
        });
        parent.classList.toggle('active');
      });
    });
  }

  function initFadeUp() {
    var observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('main section').forEach(function (section) {
      if (section.querySelector('.fade-up')) return;
      section.classList.add('fade-up');
    });

    // Ensure all buttons animate in consistently (no inline JS/CSS).
    document.querySelectorAll('.btn').forEach(function (btn) {
      if (!btn.classList.contains('fade-up')) btn.classList.add('fade-up');
    });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initFooterYear() {
    var yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
  }

  /** Hotel rooms: sync carousel dots with visible slide (mobile flex layout). */
  function initMenusFoodDrinksToggle() {
    var btnFood = document.getElementById('btn-food');
    var btnDrinks = document.getElementById('btn-drinks');
    var wrapFood = document.getElementById('wrapper-food');
    var wrapDrinks = document.getElementById('wrapper-drinks');
    if (!btnFood || !btnDrinks || !wrapFood || !wrapDrinks) return;

    function activateFood() {
      wrapFood.style.display = 'block';
      wrapDrinks.style.display = 'none';
      btnFood.classList.add('btn-active');
      btnDrinks.classList.remove('btn-active');
      wrapFood.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
    }
    function activateDrinks() {
      wrapFood.style.display = 'none';
      wrapDrinks.style.display = 'block';
      btnDrinks.classList.add('btn-active');
      btnFood.classList.remove('btn-active');
      wrapDrinks.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
    }
    btnFood.addEventListener('click', function (e) {
      e.preventDefault();
      activateFood();
    });
    btnDrinks.addEventListener('click', function (e) {
      e.preventDefault();
      activateDrinks();
    });
  }

  function initRoomGalleryDots() {
    document.querySelectorAll('#rooms .room-gallery').forEach(function (carousel) {
      if (getComputedStyle(carousel).display !== 'flex') return;
      var dotsWrap = carousel.nextElementSibling;
      if (!dotsWrap || !dotsWrap.classList.contains('carousel-dots')) return;
      var dots = [].slice.call(dotsWrap.querySelectorAll('.carousel-dot'));
      var imgs = [].slice.call(carousel.querySelectorAll('img'));
      if (!dots.length || !imgs.length) return;
      imgs.forEach(function (img, i) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.58) {
                dots.forEach(function (d, j) {
                  d.classList.toggle('active', j === i);
                });
              }
            });
          },
          { root: carousel, threshold: [0.55, 0.65, 0.75] }
        );
        io.observe(img);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initLangToggle();
    initNavDropdowns();
    initFadeUp();
    initFooterYear();
    initMenusFoodDrinksToggle();
    initRoomGalleryDots();
  });
})();
