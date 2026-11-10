"use strict";

// Navegación
(function initNavigation() {
  const nav = document.getElementById("site-nav");
  const links = document.getElementById("nav-links");
  const toggle = document.getElementById("nav-toggle");

  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  toggle?.addEventListener("click", () => {
    links?.classList.toggle("open");
  });

  document.querySelectorAll("a[data-nav]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href");

      if (!target?.startsWith("#") || target.length < 2) return;

      const section = document.getElementById(target.slice(1));
      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth" });
      links?.classList.remove("open");
    });
  });

  if (!("IntersectionObserver" in window)) return;

  const anchors = [...document.querySelectorAll(".nav-links a[data-nav]")];

  const sections = anchors
    .map((anchor) => {
      const href = anchor.getAttribute("href");
      return href?.startsWith("#")
        ? document.getElementById(href.slice(1))
        : null;
    })
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        anchors.forEach((anchor) => {
          anchor.classList.toggle(
            "active",
            anchor.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

// Animaciones al desplazarse
(function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal, .reveal-stagger");

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((element) => observer.observe(element));
})();

// Contadores animados
(function initCounters() {
  const counters = document.querySelectorAll(".stat-chip b[data-count]");

  if (!counters.length) return;

  function animateCounter(element) {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();

    if (!Number.isFinite(target)) return;

    function update(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent = Math.round(target * eased) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

// Desplazamiento horizontal
(function initHorizontalScroll() {
  const track = document.querySelector(".reel-track");

  if (!track) return;

  track.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      track.scrollLeft += event.deltaY;
      event.preventDefault();
    },
    { passive: false }
  );
})();
