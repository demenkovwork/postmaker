# compeye studio

Web builder for **compeye.app**-branded TikTok carousel cards & covers. Edit text,
colors, upload a competitor screenshot, and export crisp **1080×1350 @2× → 2160×2700**
PNGs — single image or the whole carousel as a `.zip`.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for the control panel UI
- Pixel-exact slide layout in `styles/slide.css` (do not change the 1080×1350 sizes)
- Fonts: **JetBrains Mono** + **Space Grotesk** via `next/font/google` (bundled, no
  network dependency at export time)
- PNG export: **`html-to-image`** (`toPng`, `pixelRatio: 2`)
- Multi-slide zip: **`jszip`** + **`file-saver`**

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- Two slide types: **Cover** (profile/first slide) and **Card** (carousel slide)
- Badge presets for common competitive-intelligence signals + free text
- Multi-slide carousel: add / reorder / delete slides
- Live preview, scaled to fit; export renders at real size offscreen for sharpness
- Draft autosaved to `localStorage` (survives reload)
- Responsive: panel on top, preview below on mobile
- Download current slide as PNG, or the whole carousel as `.zip`

## Title highlight syntax

In a Cover title, wrap a word in asterisks to highlight it in the brand accent:
`Who's *winning* the SaaS race?`

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo → **Deploy**.
3. No configuration needed; you get a `*.vercel.app` URL.

Or run `npx vercel` locally.

## Quality notes

- The exported node is mounted offscreen at real 1080×1350 size, so the capture is
  never a scaled (blurry) preview.
- `await document.fonts.ready` runs before export so custom fonts are embedded.
- Uploaded screenshots are read as base64 (`FileReader`) to avoid CORS-tainted canvas.
