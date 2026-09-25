# Design — Baber Tyres Corporation Website

**Version:** 0.2.0 (Open decisions D1–D2 resolved by owner, 2026-09-25)
**Date:** 2026-09-25
**Governed by:** [`constitution.md`](./constitution.md) v1.0.1
**Implements:** [`requirements.md`](./requirements.md) v0.2.0

---

## 1. Architecture Overview

```
┌──────────────┐      publish      ┌──────────────┐
│ Sanity Studio│ ────────────────► │ Sanity Cloud │
│  (/studio)   │                   │   Dataset    │
└──────────────┘                   └──────┬───────┘
       ▲                                  │
       │ owner edits                      │ ① GROQ over CDN (build + ISR)
       │                                  │ ② webhook on publish
       │                                  ▼
┌──────┴────────────────────────────────────────────┐
│              Next.js App (Vercel)                 │
│  Server Components ── GROQ ── tag-based cache     │
│  /api/revalidate ◄── Sanity webhook               │
└───────────────────────┬───────────────────────────┘
                        │ HTML + minimal JS
                        ▼
                    Visitor (mobile-first)
                        │
                        ▼  wa.me deep link
                    WhatsApp → 0317-4724400
```

**Key property:** the owner publishes in Studio → Sanity fires a webhook → `/api/revalidate` purges the
affected cache tags → the live site reflects the change within seconds. No rebuild, no deploy
(satisfies FR-F1, S2).

---

## 2. Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Rendering | Server Components + ISR with cache tags | Content is read-heavy and rarely changes per request; keeps client JS near zero (NFR-2, NFR-7) |
| Data fetch | GROQ via `next-sanity` | First-party, integrates with Next's cache |
| Cache invalidation | Sanity webhook → `revalidateTag` | Meets "no redeploy" without polling or short TTLs |
| Filtering | URL search params, server-side | Shareable, back/forward-correct, no client state library (FR-B2) |
| Styling | Tailwind CSS v4, CSS-variable tokens | Tokens map 1:1 to the constitution's locked palette |
| Fonts | `next/font/google`, self-hosted at build | No render-blocking third-party request |
| Animation | Framer Motion, client components only where used | Scoped so motion never blocks first paint |
| Images | `next/image` + Sanity image pipeline | Automatic AVIF/WebP, correct sizing (NFR-5) |
| Forms | None | WhatsApp is the only inquiry channel (FR-D3) |

**Explicitly rejected:** client-side state management (no global store needed), a component library
beyond Tailwind (Constitution §III), any analytics that blocks paint.

---

## 3. Project Structure

```
baber-tyres/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # fonts, tokens, header/footer, sticky CTA
│   │   ├── page.tsx                   # homepage
│   │   ├── tyres/
│   │   │   ├── page.tsx               # catalog (reads searchParams)
│   │   │   └── [slug]/page.tsx        # product detail
│   │   ├── brands/
│   │   │   ├── page.tsx               # all brands
│   │   │   └── [slug]/page.tsx        # brand landing
│   │   ├── categories/[slug]/page.tsx # category landing
│   │   ├── services/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── studio/[[...tool]]/page.tsx
│   │   ├── api/revalidate/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── not-found.tsx
│   │   └── globals.css                # design tokens
│   ├── components/
│   │   ├── layout/    Header, Footer, StickyContact, Container, Section
│   │   ├── product/   ProductCard, ProductGrid, ProductGallery, StockBadge, PriceTag
│   │   ├── filter/    FilterPanel, FilterChips, SizeSelect, BrandFilter, PriceRange
│   │   ├── brand/     BrandCard, BrandBadge, BrandStrip
│   │   ├── ui/        Button, Card, Badge, Heading, Skeleton, EmptyState, Reveal
│   │   └── seo/       JsonLd
│   ├── lib/
│   │   ├── sanity/    client.ts, queries.ts, image.ts, types.ts
│   │   ├── site.ts    # NAP config — single source (R6)
│   │   ├── whatsapp.ts# deep-link builder (FR-D2)
│   │   ├── format.ts  # PKR + tyre-size formatters
│   │   └── filters.ts # searchParams ⇄ GROQ
│   └── sanity/
│       ├── schemas/   product.ts, brand.ts, category.ts, service.ts, siteSettings.ts
│       └── structure.ts
├── public/
└── specs/             # constitution, research, requirements, design, tasks
```

---

## 4. Route Map

| Route | Type | Renders | Revalidation tag |
|---|---|---|---|
| `/` | Static + ISR | Hero, size finder, brand strip, categories, services, location | `home`, `brand`, `service`, `settings` |
| `/tyres` | Dynamic (searchParams) | Filtered catalog | `product`, `brand`, `category` |
| `/tyres/[slug]` | Static params + ISR | Product detail | `product:<slug>` |
| `/brands` | Static + ISR | All brands, grouped by relationship | `brand` |
| `/brands/[slug]` | Static params + ISR | Brand landing + its products | `brand:<slug>`, `product` |
| `/categories/[slug]` | Static params + ISR | Category landing + its products | `category:<slug>`, `product` |
| `/services` | Static + ISR | Three services | `service` |
| `/about` | Static + ISR | Importer/dealer story | `settings` |
| `/contact` | Static + ISR | NAP, map, hours, delivery note | `settings` |
| `/studio/[[...tool]]` | Client | Sanity Studio | — |

**Catalog URL contract** (FR-B2):
`/tyres?brand=yokohama,dunlop&category=truck&width=185&profile=65&rim=15&min=5000&max=40000&page=2`
Every filter is a param; no filter state lives in React alone.

---

## 5. Data Model (Sanity Schemas)

### 5.1 `brand`

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `slug` | slug | required, from `name` |
| `logo` | image | optional (falls back to a typographic mark) |
| `relationship` | string | **required** — `importer` \| `dealer` \| `stocked` |
| `description` | text | optional |
| `displayOrder` | number | sorts within its relationship group |
| `seo` | object | `title`, `description` |

Seed data: `importer` → Yokohama, Rapid, Michelin, Duhow · `dealer` → Dunlop, General, Armstrong ·
`stocked` → remaining brands (OQ-2).

### 5.2 `category`

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `slug` | slug | required — `car`, `suv`, `truck`, `lifter`, `offroad` |
| `description` | text | used as landing-page copy |
| `icon` | string | key into an internal SVG icon map |
| `displayOrder` | number | — |
| `seo` | object | — |

### 5.3 `product`

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `slug` | slug | required |
| `brand` | reference → brand | required |
| `category` | reference → category | required |
| `width` | number | required |
| `profile` | number | required |
| `rim` | number | required |
| `sizeLabelOverride` | string | optional — for commercial notations (`11R22.5`, `7.00-12`) that the metric triple cannot express (FR-B3) |
| `loadIndex` | string | optional |
| `speedRating` | string | optional |
| `price` | number | required, PKR, positive |
| `inStock` | boolean | default `true` |
| `images` | array[image + `alt`] | required, min 1, alt required (NFR-3) |
| `description` | text | optional |
| `featured` | boolean | surfaces on the homepage |
| `seo` | object | optional overrides |

Size display: `sizeLabelOverride` when present, else `` `${width}/${profile} R${rim}` `` — from one
shared formatter.

### 5.4 `service`

`name` · `slug` · `description` · `icon` · `displayOrder` · `seo`.
Seed: Tyre Fitting · Computerized Wheel Alignment · Computerized Wheel Balancing. **No others** (FR-C1).

### 5.5 `siteSettings` (singleton)

`shopName` · `addressLine` · `city` · `phone` · `whatsapp` · `hoursOpen` (10:00) · `hoursClose` (19:00) ·
`openDays` (Mon–Sat) · `closedDay` (Sunday) · `deliveryNote` · `mapLat` · `mapLng` · `mapEmbedUrl` ·
`googleReviewUrl` (nullable until OQ-1) · `defaultSeo`.

This document is the only source for NAP data (R6, FR-F4). `lib/site.ts` reads it and every component
imports from there — no contact detail is ever typed into a component.

---

## 6. Data Access

**Client** — `lib/sanity/client.ts`: project id, dataset, `apiVersion`, `useCdn: true`, and a
`token`-free read path. All queries are tagged for revalidation.

**Query set** — `lib/sanity/queries.ts`, one exported GROQ constant per need:
`HOMEPAGE_QUERY` · `PRODUCTS_QUERY(filters)` · `PRODUCT_BY_SLUG` · `BRANDS_QUERY` · `BRAND_BY_SLUG` ·
`CATEGORY_BY_SLUG` · `SERVICES_QUERY` · `SETTINGS_QUERY` · `SITEMAP_QUERY`.

**Filtering** — `lib/filters.ts` parses `searchParams` into a validated filter object (unknown or
malformed params are dropped, never passed through), then composes GROQ constraints. Values are
passed as GROQ **parameters**, never string-interpolated, so no query injection is possible.

**Revalidation** — `/api/revalidate` verifies the Sanity webhook signature, reads the changed
document's `_type` and `slug`, and calls `revalidateTag` for the affected tags. An unsigned or
invalid request is rejected with 401 and changes nothing.

**Failure behaviour (NFR-11)** — if a Sanity fetch throws, the page renders its static shell with
header, contact actions, and an inline notice. The site never shows a blank error page; a visitor can
always reach WhatsApp.

---

## 7. Design System

### 7.1 Color Tokens

Locked by Constitution §IV:

```css
:root {
  --color-background:  #0A0A0B;
  --color-surface:     #16161A;
  --color-accent:      #FF9500;
  --color-accent-glow: #FFB340;
  --color-text:        #FAFAFA;
  --color-muted:       #8A8A94;
}
```

**Derived neutrals** — required for borders and elevation. These are tonal steps on the existing
neutral ramp, not new hues:

```css
--color-surface-raised: #1E1E24;  /* hover / elevated cards */
--color-border:         #26262D;  /* hairlines, dividers */
--color-border-strong:  #34343D;  /* focused / active edges */
```

> **Ratified in Constitution v1.0.1** (2026-09-25). No new hue introduced — amber remains the sole
> accent, and the neutral ramp is now closed; a further step requires another amendment.

**Functional status colors** — permitted by Constitution §IV solely for stock state:

```css
--color-in-stock:  #22C55E;
--color-out-stock: #71717A;   /* muted grey, not red — out of stock is not an error */
```

**Usage rules:**
- Amber is for action and emphasis only — CTAs, active filters, focus rings, badges, small accents.
- Amber is **never** a large background fill. Maximum ~10% of any viewport.
- Body copy is `--color-text` on `background`/`surface` (16.5:1 and 14.2:1 — both clear AA).
- Amber on `background` is 8.9:1 — safe for large text, icons, and borders. **Never** for small body copy.
- Amber CTA buttons use `#0A0A0B` text on amber (8.9:1) — dark-on-amber, never white-on-amber.

### 7.2 Typography

| Role | Face | Weights | Use |
|---|---|---|---|
| Display | **Sora** | 600, 700, 800 | H1–H3, hero, section titles, prices |
| Body | **Inter** | 400, 500, 600 | Paragraphs, labels, UI, nav |

Both via `next/font/google`, self-hosted at build, `display: swap`, subset `latin`.

**Scale** (mobile → desktop, fluid via `clamp()`):

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 40 → 72px | 800 | −0.03em | Hero H1 |
| `h1` | 32 → 48px | 700 | −0.02em | Page titles |
| `h2` | 26 → 36px | 700 | −0.02em | Section titles |
| `h3` | 20 → 24px | 600 | −0.01em | Card titles, subsections |
| `body-lg` | 17 → 18px | 400 | 0 | Lead paragraphs |
| `body` | 16px | 400 | 0 | Default (NFR-3 minimum) |
| `small` | 14px | 400 | 0 | Metadata, captions |
| `label` | 12px | 600 | 0.08em, uppercase | Eyebrows, badges |

**Rules:** line-height 1.1 for display, 1.6 for body. Measure capped at `70ch`. Prices use
`font-variant-numeric: tabular-nums` so columns align.

### 7.3 Spacing, Radius, Elevation

Spacing scale (Tailwind default 4px base): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
Section vertical rhythm: 64px mobile → 96px tablet → 128px desktop.
Container: `max-width 1280px`, side padding 16px mobile / 24px tablet / 32px desktop (never less
than 16px at any width).

Radii: `sm 6px` (badges, chips) · `md 10px` (buttons, inputs) · `lg 16px` (cards) · `xl 24px` (hero panels).

**Elevation is built from borders and glow, not drop shadows** — drop shadows read poorly on near-black:

| Level | Treatment |
|---|---|
| Flat | `background` |
| Raised | `surface` + 1px `border` |
| Hover | `surface-raised` + 1px `border-strong` + subtle amber glow |
| Accent | amber border + `0 0 24px rgba(255,149,0,0.18)` glow |

### 7.4 Photography-Independent Visual Strategy (NFR-12)

No real shop photography exists. The site earns its premium feel from:

1. **Typographic scale** — oversized, tight-tracked display type as the primary visual element.
2. **Tread-pattern geometry** — an abstract SVG tyre-tread motif, used at low opacity as section
   dividers and hero backdrop. Vector, themeable, weightless.
3. **Radial amber glow** — a large soft radial gradient behind the hero, giving depth on near-black.
4. **Brand logos as texture** — a marquee-free, static brand strip. Real logos, real credibility.
5. **Numeric proof** — "20+ Brands", "4 Brands Imported Directly", "3 Services" as bold type blocks.
6. **Product images from brand catalogs** — clearly product shots, never staged as our premises.

**Prohibited:** stock photos of a generic garage, a stock-photo "team", or any imagery implying
facilities or staff we have not verified (Constitution §II.6).

### 7.5 Component Specifications

**Button**

| Variant | Appearance | Use |
|---|---|---|
| `primary` | Amber fill, `#0A0A0B` text, glow on hover | Browse Tyres, main CTA |
| `whatsapp` | Amber fill + WhatsApp glyph | Every inquiry action |
| `secondary` | Transparent, `border-strong`, text colour | Call, View All |
| `ghost` | Text only, amber on hover | Tertiary links |

Min touch target 44×44px. Focus: 2px amber ring, 2px offset. Disabled: muted, no glow, `cursor: not-allowed`.

**ProductCard**
Image (4:3, `next/image`, lazy) → brand name + relationship badge → product name (`h3`, 2-line clamp)
→ size (tabular) → price (`display` weight, amber) → stock badge. Whole card is one link; the
WhatsApp action inside it is a separate, correctly nested control. Hover: `surface-raised`, border
brightens, image scales 1.03 over 300ms.

**BrandBadge** — `label` type, uppercase. `Importer` = amber fill on dark. `Dealer` = amber outline.
`Stocked` = muted outline. This badge is the visual carrier of the positioning in §3 of requirements.

**StockBadge** — dot + text. In Stock = green dot. Out of Stock = grey dot, plus copy inviting an
inquiry anyway.

**FilterPanel** — desktop: sticky left column, 280px. Mobile: bottom sheet triggered by a "Filters (n)"
button, full-height, with Apply/Clear pinned to the bottom. Filter changes push to the URL; the server
re-renders results.

**FilterChips** — active filters as removable amber-outlined chips above the grid, with "Clear all".

**StickyContact** — mobile only (`< 768px`). Fixed bottom bar: WhatsApp (primary, ~70% width) + Call.
Sits above safe-area inset. Hides while the filter sheet is open. Labelled for screen readers.

**Section / Container** — enforce the rhythm and gutters from §7.3 so no page invents its own spacing.

**EmptyState** — heading, explanatory line, and a WhatsApp CTA ("Yeh size nahi mili? Humein message
karein — stock aata rehta hai").

### 7.6 Motion (Constitution §IV)

| Interaction | Spec |
|---|---|
| Scroll reveal | Fade + 16px rise, 400ms, `ease-out`, once, staggered 60ms across a group |
| Button hover | Glow + 1.02 scale, 150ms |
| Card hover | Border + image scale, 300ms |
| Filter sheet | Slide up, 250ms, `ease-out` |
| Page transition | 200ms cross-fade |
| Accordion | Height auto, 250ms |

Hard rules: nothing loops, nothing autoplays, nothing animates above the fold before LCP. Under
`prefers-reduced-motion: reduce`, all transforms and fades are disabled and elements render in their
final state (NFR-4).

### 7.7 Iconography

Inline SVG only, from one internal icon set — 24×24, 1.5px stroke, `currentColor`. Covers: WhatsApp,
phone, location, clock, truck, car, SUV, forklift, off-road, alignment, balancing, fitting, filter,
close, chevron, check. No icon font, no runtime icon library.

---

## 8. Page Layouts

**Homepage** — Hero (name, importer/dealer line, two CTAs, radial glow + tread motif) → trust strip
("20+ Brands · 4 Imported Directly · Karachi") → size finder → category grid (5 cards, equal weight)
→ featured products → brand strip grouped by relationship → services (3 cards) → location/hours/
delivery → footer.

**Catalog `/tyres`** — page title + result count → filter chips → [filter panel | product grid] →
pagination. Mobile: filter button pinned under the header.

**Product `/tyres/[slug]`** — breadcrumb → [gallery | details: brand + badge, name, size, price, stock,
WhatsApp CTA, Call, specs table, description] → related products.

**Brand `/brands/[slug]`** — hero with logo, name, and an explicit relationship statement ("Baber Tyres
Corporation is a direct importer of Yokohama tyres in Karachi") → that brand's products → WhatsApp CTA.

**Category `/categories/[slug]`** — hero with category copy → products → CTA.

**Services** — intro → three service sections, each with icon, description, keyword-targeted heading,
and WhatsApp CTA → delivery note → location.

**About** — importer/dealer story, brands named, what the shop stands for, hours, location. No
invented credentials.

**Contact** — NAP block, hours (Mon–Sat 10–7, Sunday closed), delivery note, WhatsApp + Call, embedded
map. No form.

---

## 9. Responsive Behaviour

| Breakpoint | Width | Grid | Notes |
|---|---|---|---|
| Base | 360px+ | 1 col products, 2 col categories | Sticky contact bar visible |
| `sm` | 640px+ | 2 col products | — |
| `md` | 768px+ | 2–3 col | Sticky bar hidden; header shows full nav |
| `lg` | 1024px+ | 3 col + filter sidebar | — |
| `xl` | 1280px+ | 4 col | Container caps |

Every layout is authored at 360px first (NFR-1).

---

## 10. Accessibility Implementation

- Landmarks: `header`/`nav`/`main`/`footer`; one `h1` per page; no skipped heading levels.
- Skip-to-content link, visible on focus.
- Focus ring: 2px `--color-accent`, 2px offset, never removed.
- Filter results use `aria-live="polite"` for the count.
- Filter sheet traps focus, closes on `Esc`, restores focus to its trigger.
- Images: meaningful `alt` from Sanity (enforced by schema); decorative SVG marked `aria-hidden`.
- WhatsApp/call links carry descriptive accessible names, not bare icons.
- Verified by keyboard-only pass plus axe on every route before any task is called done.

## 11. SEO Implementation

- `generateMetadata` per route; Sanity `seo` overrides win when present.
- JSON-LD via a `JsonLd` component: `LocalBusiness` (sitewide, with `openingHoursSpecification`
  reflecting Mon–Sat 10:00–19:00 and Sunday closed), `Product` on product pages, `BreadcrumbList` on
  catalog/brand/category/product.
- `sitemap.ts` and `robots.ts` generate from Sanity — products, brands, categories, services, static pages.
- Canonical URLs on every page. Filtered catalog views canonicalize to `/tyres` to avoid duplicate-content splintering.
- Open Graph + Twitter cards; product OG image from the product's first image.

## 12. Performance Strategy

- Server Components by default; `"use client"` limited to FilterPanel, ProductGallery, StickyContact, Reveal.
- Hero image/graphic `priority`; everything else lazy.
- Fonts self-hosted, `swap`, preloaded — no layout shift.
- Sanity images sized via the image pipeline with correct `sizes`; AVIF/WebP.
- No third-party script blocks render; analytics (if added) loads `afterInteractive`.
- Budget enforced per Constitution §II.4: Lighthouse mobile ≥ 90, LCP ≤ 2.5s on 4G.

## 13. States

| State | Treatment |
|---|---|
| Loading | Skeletons matching final layout — never a spinner on a full page |
| Empty catalog | `EmptyState` with WhatsApp CTA |
| Out of stock | Listed, muted badge, inquiry still available |
| Sanity failure | Static shell + contact actions + inline notice (NFR-11) |
| 404 | Branded page with links to catalog, services, WhatsApp |

## 14. Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SITE_URL
SANITY_API_READ_TOKEN        # server-only, private dataset reads
SANITY_REVALIDATE_SECRET     # server-only, webhook signature
```

No secret is committed; `.env.example` documents the names only (Constitution §III, NFR-9).

## 15. Deployment

Vercel, production branch `main`. Sanity webhook on the production dataset targets
`/api/revalidate`. Domain pending OQ-3. Studio is deployed with the app at `/studio` and is
authentication-gated by Sanity.

---

## 16. Design Decisions

| # | Decision | Status |
|---|---|---|
| D1 | Derived neutral tokens (`surface-raised`, `border`, `border-strong`) | **Approved** — ratified in Constitution v1.0.1 |
| D2 | Display typeface **Sora**, body **Inter** | **Approved** — locked in Constitution §IV |
| D3 | Logo: typographic wordmark in Sora 800 until a real logo exists | Default applied |
| D4 | Brand strip uses official brand assets only | Default applied |

## 17. Approval

| Phase | Status |
|---|---|
| Design drafted | Complete |
| Constitution v1.0.1 amendment (D1, D2) | **Approved** 2026-09-25 |
| Owner review | **Approved** 2026-09-25 |
| Approved to proceed to `tasks.md` | **Yes** |
