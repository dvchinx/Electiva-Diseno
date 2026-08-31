# AgitaYDecide · Manual de Marca

Proyecto para la electiva **Diseño Web**: sitio de *branding guidelines* de
AgitaYDecide, una app móvil ficticia que decide por ti cuando nadie se decide
(pones las opciones, agitas el teléfono, la app pone el punto final).

## Integrantes

- Jesús Flórez
- David Martinez

## Cómo verlo

Sin build, sin dependencias, sin `npm install`. Abre `index.html` en el navegador.

Un detalle: con `file://` algunos navegadores bloquean el portapapeles. Si quieres
que el botón de copiar códigos HEX funcione igual que en producción, levanta un
servidor local:

```bash
python -m http.server 8000
# luego abre http://localhost:8000
```

## Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. **Settings → Pages → Source: Deploy from a branch**.
3. Rama `main`, carpeta `/ (root)`. Guardar.
4. En un par de minutos queda en `https://<usuario>.github.io/<repo>/`.

El archivo `.nojekyll` ya está incluido para que Jekyll no toque nada.

## Estructura

```
index.html          Documento único con las 14 secciones
css/
  tokens.css        Design tokens: color, tipografía, espaciado, motion
  base.css          Reset y tipografía base
  layout.css        Navegación, retícula, secciones, responsive
  components.css    Botones, tarjetas, muestras, pestañas, cursor…
  animations.css    Keyframes, revelados por scroll, patrones
  sections.css      Estilos propios de cada sección
js/
  ui.js             Cargador, tema, menú, pestañas, copiar, controles en vivo
  scroll.js         Progreso, revelado, índice activo, parallax, contadores
  cursor.js         Cursor de marca
  shake.js          Demo «agita y decide» (clic, teclado y acelerómetro)
assets/logo/        Logo en SVG + instrucciones para reemplazarlo
```

## Secciones

| # | Sección | Contenido |
|---|---|---|
| 00 | Portada | Héroe animado con la demo interactiva de agitar |
| 01 | Esencia | Propósito, promesa, misión, visión, valores |
| 02 | Personalidad | Arquetipo, ejes de personalidad, somos / no somos |
| 03 | Voz y tono | Seis reglas, vocabulario, ejemplos bien y mal |
| 04 | Logo | Versiones, área de respeto, mínimos, usos incorrectos |
| 05 | Color | Paleta copiable, proporción de uso, contraste WCAG |
| 06 | Tipografía | Tres familias, escala, laboratorio en vivo |
| 07 | Iconografía | Construcción sobre rejilla y set base de 8 iconos |
| 08 | Grafismos | Cuatro tramas de marca y sus reglas |
| 09 | Imagen | Dirección de fotografía e ilustración |
| 10 | Movimiento | Principios, curvas jugables, tabla de duraciones |
| 11 | Componentes | Botones, entradas, contenedores, pantalla completa |
| 12 | Aplicaciones | Tarjeta, redes, merch, ficha de tienda |
| 13 | Recursos | Descargas, dudas frecuentes, créditos |

## Logo

Una mano agitando un teléfono con los arcos del movimiento. El original es
**ráster** (un PNG de silueta envuelto en SVG), así que la web usa su canal
alfa como máscara de luminancia: el logo hereda `currentColor` y funciona en
claro, oscuro y sobre el acento sin versiones separadas.
Detalles en [`assets/logo/README.md`](assets/logo/README.md).

## Accesibilidad

- Contraste mínimo 4.5:1 en todo el texto; los ratios están documentados en la sección 05.
- `prefers-reduced-motion` detiene animaciones, parallax y cursor personalizado.
- Navegación completa por teclado, con enlace de salto al contenido y foco visible.
- Sin JavaScript la página sigue siendo legible: los revelados solo se aplican si hay JS.

## Nota

AgitaYDecide es una **marca ficticia** creada como ejercicio académico.
No representa a ningún producto ni empresa real.
