/* ============================================================
   main.js — theme, scroll-reveal, nav, filter, counters
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("pf-theme"); } catch (e) {}
  if (stored) {
    root.setAttribute("data-theme", stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("pf-theme", next); } catch (e) {}
    });
  }

  /* ---------- Nav scrolled state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  var menuClose = document.getElementById("menuClose");
  function closeMenu() { if (menu) menu.classList.remove("open"); }
  if (burger) burger.addEventListener("click", function () { menu.classList.add("open"); });
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link via section spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = "#" + en.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Project filter ---------- */
  var filters = document.getElementById("filters");
  var grid = document.getElementById("projGrid");
  if (filters && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".proj-card"));
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var f = btn.getAttribute("data-f");
      filters.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hide", !show);
      });
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');

  function openLb(src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (lb) {
    lb.addEventListener('click', closeLb);
    lbImg.addEventListener('click', function(e) { e.stopPropagation(); });
    lbClose.addEventListener('click', closeLb);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLb(); });
  }

  /* ---------- Carousels ---------- */
  document.querySelectorAll('.carousel[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var imgs = track.querySelectorAll('img');
    var dotsEl = carousel.querySelector('.carousel-dots');
    var total = imgs.length;
    var current = 0;

    // build dots
    imgs.forEach(function (_, i) {
      var btn = document.createElement('button');
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', function () { go(i); });
      dotsEl.appendChild(btn);
    });

    function go(n) {
      current = (n + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsEl.querySelectorAll('button').forEach(function (b, i) {
        b.classList.toggle('active', i === current);
      });
    }

    setInterval(function () { go(current + 1); }, 3000);

    // click image to open lightbox
    track.querySelectorAll('img').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () { openLb(img.src, img.alt); });
    });
  });

})();
