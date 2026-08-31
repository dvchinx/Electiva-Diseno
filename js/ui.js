/* ============================================================
   AgitaYDecide · Interfaz
   Cargador, tema, navegación móvil, pestañas, copiado,
   controles en vivo y botones magnéticos.
   ============================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Cargador inicial ---------- */
  const preloader = $(".preloader");
  const hidePreloader = () => preloader && preloader.setAttribute("data-done", "true");
  window.addEventListener("load", () => setTimeout(hidePreloader, reduceMotion ? 0 : 650));
  // Red de seguridad: si algo tarda demasiado, no dejamos la página tapada.
  setTimeout(hidePreloader, 3500);

  /* ---------- Tema claro / oscuro ---------- */
  const root = document.documentElement;
  // Hay dos: uno en la cabecera móvil y otro al pie del índice.
  const themeBtns = $$("[data-theme-toggle]");

  const readStoredTheme = () => {
    try { return localStorage.getItem("ayd-theme"); } catch (e) { return null; }
  };
  const storeTheme = (v) => {
    try { localStorage.setItem("ayd-theme", v); } catch (e) { /* modo privado: se ignora */ }
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    themeBtns.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(theme === "light"));
      btn.setAttribute(
        "aria-label",
        theme === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro"
      );
    });
  };

  applyTheme(readStoredTheme() || "dark");

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      storeTheme(next);
    });
  });

  /* ---------- Navegación móvil ---------- */
  const nav = $("#nav");
  const navBtn = $("[data-nav-toggle]");

  const setNav = (open) => {
    if (!nav || !navBtn) return;
    nav.setAttribute("data-open", String(open));
    navBtn.setAttribute("aria-expanded", String(open));
    navBtn.setAttribute("aria-label", open ? "Cerrar el índice" : "Abrir el índice");
    document.body.style.overflow = open ? "hidden" : "";

    // El icono acompaña al estado: hamburguesa ↔ cerrar
    const use = navBtn.querySelector("use");
    if (use) use.setAttribute("href", open ? "#i-close" : "#i-menu");
  };

  if (navBtn) {
    navBtn.addEventListener("click", () => {
      setNav(nav.getAttribute("data-open") !== "true");
    });
  }
  // Al elegir una sección, el panel se cierra solo.
  $$(".nav__link").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  /* ---------- Pestañas accesibles ---------- */
  $$("[data-tabs]").forEach((group) => {
    const tabs = $$("[role='tab']", group);
    const panels = $$("[role='tabpanel']", group);

    const select = (idx) => {
      tabs.forEach((t, i) => {
        t.setAttribute("aria-selected", String(i === idx));
        t.tabIndex = i === idx ? 0 : -1;
      });
      panels.forEach((p, i) => { p.hidden = i !== idx; });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (e) => {
        const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!delta) return;
        e.preventDefault();
        const next = (i + delta + tabs.length) % tabs.length;
        select(next);
        tabs[next].focus();
      });
    });

    select(0);
  });

  /* ---------- Copiar al portapapeles ---------- */
  const toast = $(".toast");
  let toastTimer;

  const showToast = (msg) => {
    if (!toast) return;
    $(".toast__text", toast).textContent = msg;
    toast.setAttribute("data-show", "true");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.setAttribute("data-show", "false"), 1800);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Respaldo para file:// y navegadores sin permiso de portapapeles
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;opacity:0;";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch (err) {
        return false;
      }
    }
  };

  $$("[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const value = el.getAttribute("data-copy");
      const ok = await copyText(value);
      showToast(ok ? `${value} copiado` : `Copia manualmente: ${value}`);
    });
  });

  /* ---------- Escala tipográfica en vivo ---------- */
  const sizeInput  = $("#type-size");
  const sizeOut    = $("#type-size-out");
  const trackInput = $("#type-track");
  const trackOut   = $("#type-track-out");
  const typeSample = $("#type-sample");
  const typeText   = $("#type-text");

  const syncType = () => {
    if (!typeSample) return;
    if (sizeInput) {
      typeSample.style.fontSize = sizeInput.value + "px";
      if (sizeOut) sizeOut.textContent = sizeInput.value + "px";
    }
    if (trackInput) {
      const tr = (trackInput.value / 1000).toFixed(3);
      typeSample.style.letterSpacing = tr + "em";
      if (trackOut) trackOut.textContent = tr + "em";
    }
  };

  [sizeInput, trackInput].forEach((i) => i && i.addEventListener("input", syncType));
  if (typeText && typeSample) {
    typeText.addEventListener("input", () => {
      typeSample.textContent = typeText.value || "Agita y decide";
    });
  }
  syncType();

  /* ---------- Demos de curvas de aceleración ---------- */
  $$(".ease-demo").forEach((demo) => {
    const play = () => {
      demo.setAttribute("data-play", "false");
      // reinicia la animación forzando un reflow
      void demo.offsetWidth;
      demo.setAttribute("data-play", "true");
    };
    demo.addEventListener("click", play);
    demo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  });

  /* ---------- Interruptores de la sección Componentes ---------- */
  $$(".toggle").forEach((t) => {
    t.addEventListener("click", () => {
      t.setAttribute("aria-checked", t.getAttribute("aria-checked") === "true" ? "false" : "true");
    });
  });

  /* ---------- Botones magnéticos ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = Number(el.getAttribute("data-magnetic")) || 0.28;

      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Año en el pie ---------- */
  const year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
