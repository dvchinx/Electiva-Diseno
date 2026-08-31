/* ============================================================
   AgitaYDecide · Demo "agita y decide"
   Es el gesto central del producto, así que la guía lo deja
   probar en vez de describirlo. Funciona con clic, con teclado
   y con el acelerómetro real en móvil.
   ============================================================ */
(function () {
  "use strict";

  const shaker  = document.querySelector("[data-shaker]");
  const verdict = document.querySelector("[data-verdict]");
  const counter = document.querySelector("[data-shake-count]");
  const phoneEl = document.querySelector("[data-phone-result]");
  if (!shaker || !verdict) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const OPCIONES = [
    "Pizza, obviamente",
    "El sitio de siempre",
    "Cocinas tú",
    "Sushi",
    "Arepas",
    "Domicilio y sofá",
    "Ese que nadie propuso",
    "Paga el que dudó",
    "Ruleta otra vez",
    "Empanadas",
    "La opción rara",
    "Café y ya"
  ];

  let ultima = -1;
  let veces = 0;
  let bloqueado = false;

  /* Evita repetir la misma respuesta dos veces seguidas: la marca
     promete decidir, no dar vueltas sobre lo mismo. */
  const elegir = () => {
    let i;
    do { i = Math.floor(Math.random() * OPCIONES.length); }
    while (i === ultima && OPCIONES.length > 1);
    ultima = i;
    return OPCIONES[i];
  };

  const agitar = () => {
    if (bloqueado) return;
    bloqueado = true;

    shaker.setAttribute("data-shaking", "true");
    verdict.textContent = "…";
    verdict.setAttribute("data-new", "false");

    const espera = reduceMotion ? 0 : 780;

    setTimeout(() => {
      const resultado = elegir();
      verdict.textContent = resultado;
      // reinicia la animación de entrada del resultado
      verdict.setAttribute("data-new", "false");
      void verdict.offsetWidth;
      verdict.setAttribute("data-new", "true");

      if (phoneEl) phoneEl.textContent = resultado;

      veces += 1;
      if (counter) counter.textContent = String(veces);

      shaker.setAttribute("data-shaking", "false");
      bloqueado = false;
    }, espera);
  };

  shaker.addEventListener("click", agitar);
  shaker.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); agitar(); }
  });

  /* ---------- Acelerómetro real ----------
     En móvil el gesto es literal. iOS 13+ exige pedir permiso desde
     una interacción del usuario, así que lo pedimos en el primer clic. */
  let motionOn = false;

  const activarMovimiento = () => {
    if (motionOn || !("DeviceMotionEvent" in window)) return;
    motionOn = true;

    let ultimoDisparo = 0;

    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;

      const fuerza = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
      const ahora = Date.now();

      // Umbral alto + margen de 1,2 s para no dispararse al caminar
      if (fuerza > 32 && ahora - ultimoDisparo > 1200) {
        ultimoDisparo = ahora;
        agitar();
      }
    });
  };

  const pedirPermisoMovimiento = () => {
    const DME = window.DeviceMotionEvent;
    if (DME && typeof DME.requestPermission === "function") {
      DME.requestPermission()
        .then((estado) => { if (estado === "granted") activarMovimiento(); })
        .catch(() => { /* el usuario dijo que no: seguimos con clic */ });
    } else {
      activarMovimiento();
    }
  };

  shaker.addEventListener("click", pedirPermisoMovimiento, { once: true });
})();
