# Actitud & Tendencia

Sitio web de **Actitud & Tendencia**, boutique de moda femenina — rediseñado en **React + Vite + Tailwind** con componentes animados estilo **React Bits**, respetando la paleta e identidad del manual de marca.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** (paleta de marca en `src/index.css`)
- **framer-motion** (animaciones / componentes React Bits)
- **embla-carousel** (carrusel del modal de producto)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción -> dist/
npm run preview  # previsualiza el build
```

## Estructura

```
src/
  components/
    reactbits/   → animaciones (SplitText, BlurText, ShinyText, Marquee,
                   TiltedCard, SpotlightCard, ScrollReveal, CountUp,
                   AuroraBackground, GradientText)
    layout/      → Navbar, Footer
    sections/    → Hero, TrustMarquee, Products, NuevosIngresos,
                   Manifesto, Lookbook, InstagramFeed, WhatsAppCTA
    ui/          → Button, WhatsAppIcon
  data/products.ts   → catálogo (nombre, precio, talles, fotos)
  lib/whatsapp.ts     → links de WhatsApp (+595 983 460 912)
public/
  brand/       → logo (dorado/oscuro/salvia/crema) + patrón floral
  productos/   → fotos de cada prenda
```

## Catálogo

Los productos se editan en [`src/data/products.ts`](src/data/products.ts). Las
fotos van en `public/productos/<id>/` (4 por prenda). El script
[`productos/sync_fotos.mjs`](productos/sync_fotos.mjs) copia sets de fotos desde
una carpeta de descargas al proyecto.

## Marca

- Paleta: Salvia `#A9C6B2` · Menta `#CDE9E4` · Lila `#D7C6E8` · Rosa `#F6B6C6` · Amarillo `#F8D873` · Dorado `#C9A44A`
- Tipografía: Montserrat + Cormorant Garamond (display)
- WhatsApp: +595 983 460 912 · Instagram: [@actitud_tendencia.sdg](https://instagram.com/actitud_tendencia.sdg)

> El sitio estático anterior (Claude Design) quedó archivado en `_legacy/`.
> Los assets originales extraídos del PDF están en `brand-assets/`.
