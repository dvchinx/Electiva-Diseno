/* ============================================================
   AgitaYDecide · Cursor de marca
   Un punto que sigue exacto al ratón y un aro que llega tarde:
   la misma idea de "oscilación que se asienta" del resto del motion.
   Solo se activa con puntero fino y sin reducción de movimiento.
   ============================================================ */
(function () {
  "use strict";

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  const dot  = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  }, { passive: true });

  const loop = () => {
    // interpolación lineal: el aro persigue al punto con retraso
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* El aro crece sobre cualquier elemento interactivo */
  const interactive = "a, button, .swatch, .ease-demo, .card--hover, input, .toggle, [data-magnetic]";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactive)) ring.setAttribute("data-hover", "true");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactive)) ring.setAttribute("data-hover", "false");
  });

  /* Si el ratón sale de la ventana, escondemos el cursor propio */
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = ring.style.opacity = "";
  });
})();
