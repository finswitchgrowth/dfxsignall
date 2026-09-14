# DFXSIGNALL — Website

Premium 3D informational website for **DFXSIGNALL — Trade Smarter Together**.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Three.js / React Three Fiber and Framer Motion.

> **Scope:** informational website only. Login, registration, client dashboard, admin, payments and support tickets
> render a branded **“Coming soon”** screen. No accounts, payments or deposits are handled by this site.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Deploy (Vercel)

1. Push this folder to a GitHub repository.
2. Import it in Vercel (framework preset: Next.js — no extra settings needed).
3. Add environment variable `NEXT_PUBLIC_SITE_URL=https://dfxsignall.cv` (used for canonical URLs, sitemap, Open Graph).
4. Attach the `dfxsignall.cv` domain.

Security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, nosniff) are set in `next.config.ts`.

## Where to edit content

| What | File |
| --- | --- |
| Brand copy, navigation, contact email, homepage metrics | `content/site.ts` |
| Signal packages (name, price, features, access, status, featured, order) | `content/packages.ts` |
| FAQ | `content/faq.ts` |
| Insights / blog posts | `content/blog.ts` |
| Instrument coverage list and demo reference prices | `content/markets.ts` |
| Terms, Privacy, Risk Disclosure text | `content/legal.ts` |
| Colours, typography, buttons, surfaces (design system) | `app/globals.css` |

Until an admin panel exists, these files are the source of truth.

## Brand asset rule

The official logo lives at `public/brand/dfxsignall-logo.png` and is **the original supplied file** (byte-identical).
`components/brand/BrandLogo.tsx` only *frames* it with CSS (emblem / wordmark / lockup crops, soft edges, screen blending
so the black ground disappears). Never redraw, retype or replace the logo. `app/icon.png` and `app/apple-icon.png`
are resized copies of the same file.

To use real photos in blog posts, put them in `public/` and set `image: "/your-photo.jpg"` on the post.

## Honesty guardrails built in

- Market prices, charts, indicators and signal examples are **simulated** and labelled *Demo* everywhere they appear.
  Set `LIVE_DATA_ENABLED` in `content/markets.ts` only after a licensed data provider is connected server-side.
- Metrics with no measured value (`value: null`) show “At launch” — do not replace them with invented numbers.
- No testimonials, awards, clients, licences or performance results are shown. Add them only when real and verifiable.
- Package prices are marked indicative; package CTAs are disabled (“Coming soon”).
- Security page separates what is true of this website today from principles for the future platform.

## 3D engine

`components/3d/`

- `HeroScene` — composes `MarketSphere` (data globe), `DataNodes`, `SignalBeam` (travelling pulses), `FloatingCharts`
  (3D candlesticks), `TradingGrid` and `ParticleField`; reacts to pointer, device orientation and scroll.
- `SecurityCore` — secure core, shield shell, gimbal rings and encrypted links.
- `EcosystemNetwork` — core + four pillar hubs (Signals · Analysis · Education · Growth).
- `SceneCanvas` — resilient host: lazy-mounts near the viewport, pauses off-screen, lowers DPR/density on low-power
  devices, renders a still frame for reduced-motion users, and falls back to static SVG visuals if WebGL is missing,
  errors, or loses context.
- `LazyScenes` — dynamic imports so three.js never blocks the first paint.

## Routes

Public: `/ /about /platform /signals /markets /packages /pricing /how-it-works /security /faq /blog /blog/[slug] /contact /support /terms /privacy /risk-disclosure`

Coming soon (noindex): `/login /register /forgot-password /payment /dashboard/* /admin/*`

Also: `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, JSON-LD (Organization, FAQPage, Article, BreadcrumbList), loading, error and 404 states.

## Before going live

- Have the Terms, Privacy Policy and Risk Disclosure reviewed by qualified legal counsel for the jurisdictions you serve.
- Confirm the contact email in `content/site.ts`.
- Confirm or update indicative package prices.
