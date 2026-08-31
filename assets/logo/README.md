# Logo AgitaYDecide

**Concepto:** una mano agitando un teléfono, con los arcos del movimiento a
los lados. No representa el producto, representa *el gesto*.

## Archivos

| Archivo | Qué es |
|---|---|
| `logo-agita.svg` | **Original entregado.** SVG de 218 KB que en realidad envuelve dos PNG de 1024×1024 (color + máscara de alfa). Se conserva como fuente. |
| `logo-agita-mask.png` | Silueta en escala de grises (458×501, 26 KB). Es la que usa la web como máscara. |
| `logo-agita.png` | PNG transparente recortado, en el teal original `#138AAA`. Para descarga y uso externo. |
| `isotipo.svg` | Símbolo suelto, color heredado. |
| `logotipo.svg` | Lockup horizontal (símbolo + palabra), color heredado. |
| `favicon.png` · `apple-touch-icon.png` | Iconos de pestaña y de pantalla de inicio. |

> **Ojo:** `isotipo.svg` y `logotipo.svg` apuntan a `logo-agita-mask.png` por
> ruta relativa. Si los mueves o los envías sueltos, lleva también el PNG o el
> logo saldrá vacío. Para mandar el logo a alguien externo, usa
> `logo-agita.png`, que es autocontenido.

## Cómo funciona el color

El original es **ráster**, no vectorial: es un PNG de silueta. Un PNG no puede
heredar `currentColor`, así que la web no lo pinta — lo **recorta**.

Se usa su canal alfa como máscara de luminancia sobre un rectángulo de color:

```html
<mask id="m-agita" maskUnits="userSpaceOnUse" x="0" y="0" width="458" height="501">
  <image href="assets/logo/logo-agita-mask.png" width="458" height="501"/>
</mask>
<rect width="458" height="501" fill="currentColor" mask="url(#m-agita)"/>
```

Resultado: el logo se comporta como si fuera vectorial en lo que al color
respecta. Hereda el color de su contenedor, así que la misma definición sirve
en fondo claro, fondo oscuro y sobre el color de acento, sin versiones
separadas. Lo que **no** hereda es la nitidez infinita: al ser ráster, por
encima de ~460 px de ancho empieza a verse blando.

## Dónde vive en el código

En `index.html`, dentro del bloque `<svg class="sprite">` que abre el `<body>`:
la `<mask>` se declara **una sola vez** (fuera de los `<symbol>`, para que
`<use>` no duplique su id) y de ahí cuelgan `#iso` y `#logotipo`.
Las ~15 apariciones del logo en la página son todas `<use href="#iso">` o
`<use href="#logotipo">`, así que un cambio ahí se propaga a todas.

## Si más adelante hay una versión vectorial

Sería una mejora real: bordes nítidos a cualquier tamaño y unos 26 KB menos.
Basta con sustituir el contenido de los dos `<symbol>` por los `<path>`
correspondientes (con `fill="currentColor"`) y borrar la `<mask>`. El resto
de la página no se toca.
