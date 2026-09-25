# Baber Tyres Corporation — Project Constitution

**Version:** 1.0.1
**Ratified:** 2026-09-25
**Last amended:** 2026-09-25
**Status:** Active

This document defines the non-negotiable principles governing the Baber Tyres Corporation website.
Every requirement, design decision, and implementation task MUST comply with it. Where a spec and
this constitution conflict, the constitution wins.

---

## I. Business Identity

| Field | Value |
|---|---|
| Business name | Baber Tyres Corporation |
| Location | M.A. Jinnah Road, Karachi, Pakistan |
| Phone / WhatsApp | 0317-4724400 |
| Primary audience | Karachi vehicle owners — car, SUV, bike, truck |
| Business model | Physical retail shop; website drives inquiries and walk-ins |

The business identity above is the single source of truth. Contact details MUST NOT be hardcoded in
multiple places — they live in one config module and are imported everywhere.

---

## II. Core Principles

### 1. Mobile-First, Always
The majority of visitors arrive on mid-range Android phones over mobile data. Every layout is
designed at 360px width first and enhanced upward. A feature that only works well on desktop is
not done.

### 2. Inquiry Over Checkout
This site does not sell online. There is no cart, no payment gateway, no order state. Every product
and service surface terminates in a WhatsApp or call action. Introducing e-commerce requires a
constitutional amendment, not a feature ticket.

### 3. Owner-Editable Content
Products, prices, stock status, brands, and service descriptions MUST be editable by a
non-technical owner through Sanity Studio. If changing a price requires a developer, a code change,
or a redeploy, the implementation is wrong.

### 4. Speed Is a Feature
Slow sites lose customers on mobile data. Enforced budgets:
- Lighthouse Performance ≥ 90 on mobile
- Largest Contentful Paint ≤ 2.5s on 4G
- No client-side JavaScript for content that can be server-rendered
- All images served through `next/image` in AVIF/WebP with explicit dimensions

### 5. Local SEO Is Not Optional
The site exists to be found by people searching for tyres in Karachi. Every page ships a unique
title and meta description, semantic heading structure, and LocalBusiness structured data. Product
pages carry Product schema. Sitemap and robots.txt are generated, not hand-written.

### 6. Trust Through Clarity
No fake reviews, no invented certifications, no stock-photo "team" that does not exist, no prices
that do not match the shop. Any claim on the site must be true of the real business.

---

## III. Technology Constraints

**Locked stack — changing any row requires an amendment:**

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS |
| CMS | Sanity (headless) |
| Animation | Framer Motion |
| Hosting | Vercel |

**Rules:**
- TypeScript strict mode is on. No `any` in committed code.
- Server Components are the default. `"use client"` only where interactivity genuinely requires it.
- No UI framework beyond Tailwind (no Bootstrap, no Material UI). Small headless primitives
  (e.g. Radix) are permitted for accessibility-critical components.
- No jQuery, no CSS-in-JS runtime libraries.
- Secrets live in environment variables only. No API token is ever committed.

---

## IV. Design System (Locked)

### Color Tokens
| Token | Hex | Use |
|---|---|---|
| `background` | `#0A0A0B` | Page base |
| `surface` | `#16161A` | Cards, panels, elevated sections |
| `accent` | `#FF9500` | Primary CTAs, active states, highlights |
| `accent-glow` | `#FFB340` | Hover states, glow effects, focus rings |
| `text` | `#FAFAFA` | Primary copy |
| `muted` | `#8A8A94` | Secondary copy, labels, metadata |

### Derived Neutrals

Tonal steps on the same neutral ramp, for elevation and edges. These introduce **no new hue** — on
near-black, borders and raised surfaces carry depth where drop shadows cannot.

| Token | Hex | Use |
|---|---|---|
| `surface-raised` | `#1E1E24` | Hover and elevated card states |
| `border` | `#26262D` | Hairlines, dividers, default card edges |
| `border-strong` | `#34343D` | Focused, active, and hovered edges |

### Functional Status Colors

Permitted **only** as stock-state indicators. Never decorative, never an accent.

| Token | Hex | Use |
|---|---|---|
| `in-stock` | `#22C55E` | In-stock indicator |
| `out-stock` | `#71717A` | Out-of-stock indicator — muted grey, not red; out of stock is not an error |

**Color rules:**
- Amber is the *only* accent. Adding a second accent hue requires an amendment.
- The neutral ramp is closed. Adding a further neutral step requires an amendment.
- Accent is reserved for action and emphasis. It is never a large background fill.
- Body text against `background` or `surface` MUST meet WCAG AA (4.5:1). Amber on dark is used for
  large text, icons, and borders — never for small body copy.
- Status colors are limited to the two tokens above, used only for stock state.

### Typography
- **Display face: Sora** (600/700/800) for headings, hero, and prices.
  **Body face: Inter** (400/500/600) for paragraphs, labels, and UI.
- Both self-hosted at build via `next/font/google`. No render-blocking third-party font request.
- Headings are bold, oversized, tight tracking. Body is comfortable and high-contrast.
- Minimum body size 16px on mobile. Line length capped around 70 characters.
- Prices and size figures use tabular numerals.

### Motion
- Motion communicates, it does not decorate: scroll reveals, hover glow on interactive elements,
  page transitions.
- Durations 150–400ms. No looping or auto-playing animation that competes with content.
- `prefers-reduced-motion` MUST be honored — all non-essential motion disabled.

### Layout
- Dark premium surfaces, generous whitespace, clear visual hierarchy.
- Consistent spacing scale and border radii across the site — no one-off values.
- A sticky WhatsApp/call action is reachable from every page on mobile.

---

## V. Content & Data Rules

- **Sanity is the source of truth** for products, brands, services, and page copy. Hardcoded
  product data in components is prohibited.
- Every product document requires: name, brand, size, category, price, stock status, at least one
  image, and alt text.
- Images MUST have descriptive alt text. Decorative images are explicitly marked as such.
- Prices are stored as numbers and displayed with a single shared formatter (PKR).
- Content is authored in English; Roman Urdu phrasing is permitted where it serves customers better.

---

## VI. Quality Standards

**Accessibility (WCAG 2.1 AA):**
- Semantic HTML. Landmarks, real headings, real buttons and links.
- Every interactive element is keyboard reachable with a visible focus state.
- Forms have associated labels and clear, specific error messages.

**Code:**
- Components are small and single-purpose. Shared logic is extracted, not copy-pasted.
- Naming is descriptive; comments explain *why*, never *what*.
- No dead code, no commented-out blocks, no unused dependencies.

**Before any work is called done:**
1. Builds clean with zero TypeScript and zero lint errors
2. Verified at 360px, 768px, and 1440px
3. Keyboard-navigable end to end
4. Meets the performance budget in Section II.4

---

## VII. Development Workflow

Spec-driven, with approval gates. No phase begins before the previous one is approved.

```
constitution.md  →  requirements.md  →  design.md  →  tasks.md  →  implementation
   (this file)        user stories +     architecture,   numbered,     task by task,
                      acceptance         schema,         traceable     reviewed
                      criteria           design system   to specs
```

**Rules:**
- No implementation code is written before `tasks.md` is approved.
- Every task traces back to a numbered requirement. Work with no requirement behind it is scope
  creep and is rejected.
- Discovering a missing requirement mid-implementation means pausing and updating the spec — not
  improvising.

---

## VIII. Out of Scope (v1)

Explicitly excluded. Each requires an amendment to introduce:

- Online payments, cart, or checkout
- User accounts, login, or customer profiles
- Multi-language / Urdu script localization
- Blog or CMS-authored articles
- Live inventory sync with any external POS system
- Customer-submitted reviews or ratings

---

## IX. Governance

- This constitution supersedes all other project documents and conventions.
- Amendments require: explicit owner approval, a written rationale, a version bump, and an update to
  any spec the change invalidates.
- Versioning is semantic — MAJOR for removing or redefining a principle, MINOR for adding one,
  PATCH for clarifications that change no rule.
- Every spec review and code review checks compliance with this document.

---

## Amendment Log

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-25 | Initial ratification |
| 1.0.1 | 2026-09-25 | §IV clarified: added derived neutral tokens (`surface-raised`, `border`, `border-strong`) for elevation and edges, and named the two functional stock-status tokens explicitly. No new hue introduced; amber remains the sole accent. Locked the display and body typefaces to Sora and Inter. Raised by `design.md` D1/D2; approved by owner. |
