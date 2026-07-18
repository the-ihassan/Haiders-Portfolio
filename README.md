# Haider Ali — Personal Portfolio

A static, premium-feel personal portfolio built with vanilla HTML, CSS and JavaScript —
no framework, no build step. Just open `index.html`.

## Stack

- **HTML5 / CSS3 / vanilla JS (ES6)**
- **p5.js** — animated particle network background (mouse-reactive, capped particle count for performance)
- **GSAP + ScrollTrigger** — scroll reveals, magnetic buttons, subtle card tilt
- **Lenis** — smooth inertia scrolling
- All three libraries load from the cdnjs CDN — no npm install needed

## Structure

```
portfolio/
├── index.html
├── css/
│   ├── style.css        design tokens, layout, components
│   └── responsive.css   tablet / mobile breakpoints
├── js/
│   ├── main.js           nav, scroll-spy, typing effect, form, back-to-top
│   ├── animation.js       GSAP scroll reveals + micro-interactions
│   └── particles.js       p5.js background sketch
├── assets/
│   ├── images/            og-cover.svg, placeholders
│   ├── icons/
│   ├── certificates/
│   └── Haider-Ali-CV.pdf  placeholder CV — replace with the real one
├── favicon/favicon.svg
├── sitemap.xml
├── robots.txt
└── README.md
```

## Running locally

No build tools required. Either:

1. Double-click `index.html`, or
2. Serve it locally for the best experience with fonts/CDN scripts:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```

## Customizing

- **Colors, spacing, radii** — all defined as CSS custom properties at the top of `css/style.css` (`:root`).
- **Copy** — section content lives directly in `index.html`; search for the section id (`#hero`, `#about`, etc.).
- **Projects / certificates** — each is a repeated card block in `index.html`; duplicate a card and edit the text, links and gradient colors (`--g1`, `--g2` inline styles on `.project-thumb`).
- **CV** — swap `assets/Haider-Ali-CV.pdf` for the real file (same name, or update the `href` in the hero's "Download CV" button).
- **Real photos** — the hero avatar and project thumbnails currently use SVG/gradient placeholders. Drop real images into `assets/images/` and swap the relevant markup.

## Accessibility notes

- Skip-to-content link, semantic landmarks (`header`, `main`, `footer`, `nav`), and ARIA labels throughout.
- All interactive elements have visible focus states (`:focus-visible`).
- Respects `prefers-reduced-motion`: particle background renders once and stops, GSAP entrance/scroll animations are skipped, and content is shown immediately.
- Palette avoids pure red/green pairing and targets AA contrast for body text on the dark background.

## Performance

- Particle count auto-scales to viewport area (35–90 particles) to stay smooth on smaller devices.
- Canvas uses `p.clear()` instead of an opaque background redraw to keep the gradient page background visible without extra compositing cost.
- Fonts are loaded with `preconnect` and `display=swap`.

## Notes

This is a template populated with the personal details from the project brief (name, phone,
WhatsApp, Instagram, location, education). Project cards, certificates, and the CV are
placeholders — replace with real content before publishing.
