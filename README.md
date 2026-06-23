# Ayan Malik — Portfolio

A single-page, cinematic portfolio for a Network · Cloud · Security engineer.
Dark, atmospheric "flowing data" aesthetic — a real-time particle tunnel
(packets travelling a fibre line) behind confident, restrained typography.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-three-fiber
· drei · postprocessing · GSAP/ScrollTrigger · Framer Motion**.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Node 18.18+ (developed on Node 22). Everything is static — `next build`
prerenders the page; there is no server runtime or database.

---

## Editing content

**All copy lives in one file:** [`lib/siteConfig.ts`](lib/siteConfig.ts).
Name, role, summary, stats, experience, projects, skills, certifications,
education, languages and contact details are exported from there — edit text
without touching any component.

### Wiring the CV (TODO)

`siteConfig.cvPath` is set to `/Ayan-Malik-CV.pdf` and already wired into the
**Download CV** buttons (nav + mobile menu + contact). Drop the real PDF into
`public/Ayan-Malik-CV.pdf` and the buttons work — no code change needed. The
`// TODO(ayan)` marker is in `lib/siteConfig.ts`.

### Swapping project images

Each project in `siteConfig.projects[]` has an `image` field pointing at the
provided cover SVG (e.g. `/project-aws.svg`). To use a real screenshot later,
drop it in `public/` and change that one path — the card layout (16:9) is
unchanged.

---

## Assets

On-brand SVGs live in `public/`:

| File | Used for |
|------|----------|
| `monogram.svg` | Nav mark + hero accent |
| `favicon.svg` | Browser tab icon |
| `og-card.svg` | Social share card (`og:image` / Twitter card) |
| `project-*.svg` | Project card cover art |
| `grain.svg` | Animated film-grain overlay |

Images are served **unoptimised** (`next.config.mjs`) because they are all
first-party vector art — nothing to rasterise, and no image function needed on
Vercel.

---

## Tuning the 3D field

The two files that control the look:

### `components/scene/SceneCanvas.tsx`

- **Particle count / device tiers** — `detectTier()` returns `count` per
  breakpoint (desktop `7600`, tablet `4800`, mobile `2200`). Raise/lower `count`
  to trade richness for performance. Bloom is **off below 768px** by design.
- **Glow intensity** — the `<Bloom>` props:
  - `intensity` (currently `0.5`) — overall glow strength.
  - `luminanceThreshold` (`0.42`) — *raise* to bloom only the brightest cores,
    *lower* to make more of the field glow. (This is the main "not too bright"
    dial.)
  - `radius` (`0.62`) — glow spread.

### `components/scene/ParticleTunnel.tsx`

- `RADIUS` / `LENGTH` — tunnel girth and depth.
- `SCROLL_TRAVEL` — how far a full-page scroll pushes you down the tunnel.
- `uSize` (in the uniforms) — base point size.
- Fragment shader `core * 0.3` and vertex `vAlpha * 0.5` — per-particle
  brightness. Lower these to calm the field further; raise to intensify.

> If the hero ever feels too hot, the order to reach for: raise
> `luminanceThreshold`, then lower `uSize`, then lower `count`.

---

## Performance & accessibility

- **Reduced motion** (`prefers-reduced-motion`): the tunnel renders a single
  static frame (`frameloop="demand"`, no animation, no pointer parallax) and all
  reveals collapse to simple fades. Scroll is never hijacked.
- **Mobile budget**: particle count is cut hard and postprocessing/Bloom is
  disabled below 768px; pixel ratio is capped at `dpr={[1, 2]}`.
- **Lazy 3D**: the WebGL canvas is `dynamic(... { ssr: false })` with a loader,
  so first paint isn't blocked. The three.js bundle is a separate chunk.
- **Graceful fallback**: if WebGL is unavailable, a CSS gradient backdrop shows
  and the page is fully usable.
- Semantic HTML, visible focus rings, alt text, and dark scrims behind hero text
  for contrast.

---

## Deploy (Vercel)

1. Push to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new) (framework
   auto-detects as Next.js) → **Deploy**. No env vars required.
3. You get a `your-name.vercel.app` URL — put it in LinkedIn's
   *Website / Contact info* field and pin it as a Featured link.

Update `siteConfig.url` if you add a custom domain (it feeds the OG/metadata
`metadataBase`).
