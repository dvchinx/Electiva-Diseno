/* ============================================================
   AgitaYDecide · Scroll
   Barra de progreso, revelado por scroll, índice activo,
   parallax de fondo, contadores y barras de personalidad.
   ============================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Parallax suave del fondo del héroe ---------- */
  const blobs = $$(".blob");
  const parallax = () => {
    if (reduceMotion || !blobs.length) return;
    if (window.scrollY > window.innerHeight * 1.3) return; // fuera de vista: no calculamos
    const y = window.scrollY;
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 0.06;
      b.style.translate = `0 ${y * depth}px`;
    });
  };

  /* ---------- Barra de progreso de lectura ---------- */
  const progress = $(".progress");
  let ticking = false;

  const onScroll = () => {
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = `scaleX(${pct})`;
    }
    parallax();
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  /* ---------- Revelado al entrar en pantalla ---------- */
  const revealables = $$("[data-reveal]");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target); // se revela una sola vez
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealables.forEach((el) => {
      // Escalonado automático entre hermanos con data-stagger en el padre
      const parent = el.parentElement;
      if (parent && parent.hasAttribute("data-stagger")) {
        const idx = Array.from(parent.children).indexOf(el);
        el.style.setProperty("--reveal-delay", `${idx * 80}ms`);
      }
      io.observe(el);
    });
  } else {
    revealables.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Índice lateral activo (scroll spy) ---------- */
  const links = $$(".nav__link");
  const sections = links
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      a.setAttribute("aria-current", on ? "true" : "false");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      // De todas las secciones visibles, la que esté más arriba manda.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Contadores animados ---------- */
  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1400;

    if (reduceMotion) { el.textContent = target + suffix; return; }

    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      // easeOutExpo: arranca rápido y se asienta, igual que el gesto de agitar
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Barras de personalidad ---------- */
  const fillBar = (bar) => {
    const pct = Number(bar.getAttribute("data-value")) || 50;
    const fill = bar.querySelector(".pbar__fill");
    const knob = bar.querySelector(".pbar__knob");
    if (fill) fill.style.width = pct + "%";
    if (knob) knob.style.left = pct + "%";
  };

  /* ---------- Disparadores comunes ---------- */
  const lazyTargets = [...$$("[data-count]"), ...$$(".pbar__track[data-value]")];

  if ("IntersectionObserver" in window) {
    const once = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.hasAttribute("data-count")) animateCount(el);
        else fillBar(el);
        once.unobserve(el);
      });
    }, { threshold: 0.4 });

    lazyTargets.forEach((el) => once.observe(el));
  } else {
    lazyTargets.forEach((el) => {
      if (el.hasAttribute("data-count")) animateCount(el);
      else fillBar(el);
    });
  }

  onScroll();
})();
