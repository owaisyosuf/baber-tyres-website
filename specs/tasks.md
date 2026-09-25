# Tasks — Baber Tyres Corporation Website

**Version:** 0.1.0 (Draft — awaiting owner approval)
**Date:** 2026-09-25
**Governed by:** [`constitution.md`](./constitution.md) v1.0.1
**Implements:** [`requirements.md`](./requirements.md) v0.2.0 · [`design.md`](./design.md) v0.2.0

---

## How to read this document

Tasks are ordered by dependency. A task is picked up only when everything in its **Depends on**
column is done. Every task traces to a requirement — a task with no requirement behind it is scope
creep and must be rejected (Constitution §VII).

**Checkpoints (◆)** are owner review gates. Work stops there until the owner approves, so that
direction is validated before more effort is spent on top of it.

### Universal Definition of Done

Applies to every task; individual acceptance criteria are *in addition* to these.

1. `next build` passes with zero TypeScript and zero ESLint errors
2. Verified at 360px, 768px, and 1440px — no horizontal scroll at any width
3. Keyboard navigable with a visible focus state on every interactive element
4. Only the tokens from Constitution §IV are used — no ad-hoc colors, spacing, or radii
5. No `any`, no dead code, no commented-out blocks, no unused dependencies
6. Server Component unless interactivity genuinely requires `"use client"`

---

## Phase 0 — Foundation

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T001** | Scaffold Next.js app | — | Constitution §III |

Create the Next.js app with App Router, TypeScript (strict), Tailwind CSS v4, and ESLint. Set up the
folder structure from `design.md` §3. Add `.env.example` documenting the six variable names from
`design.md` §14 — names only, no values.
**AC:** dev server runs; strict mode on; folder structure matches the design; `.env` is gitignored.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T002** | Design tokens & typography | T001 | Constitution §IV · NFR-8 |

Define all tokens from Constitution §IV as CSS variables in `globals.css` and wire them into the
Tailwind theme. Load Sora and Inter via `next/font/google`. Implement the fluid type scale from
`design.md` §7.2 and the spacing/radius/elevation system from §7.3.
**AC:** every token is reachable as a Tailwind utility; type scale renders correctly at 360px and
1440px; fonts self-hosted with no layout shift; tabular numerals available for prices.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T003** | Site config & shared helpers | T001 | R6 · FR-D2 · FR-F4 |

Build `lib/site.ts` (NAP config — the single source for shop name, address, phone, WhatsApp, hours,
closed day, delivery note), `lib/format.ts` (PKR formatter, tyre-size formatter honouring
`sizeLabelOverride`), and `lib/whatsapp.ts` (context-aware `wa.me` deep-link builder).
**AC:** the phone number appears in exactly one file; size formatter handles both `185/65 R15` and
`11R22.5`; WhatsApp builder URL-encodes message text correctly. Unit-tested.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T004** | UI primitives | T002 | design.md §7.5 |

`Button` (primary / whatsapp / secondary / ghost), `Badge`, `Card`, `Container`, `Section`, `Heading`.
**AC:** all four button variants match spec; 44×44px minimum touch target; amber buttons use
`#0A0A0B` text, never white; focus ring is 2px amber at 2px offset.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T005** | Icon set & tread motif | T002 | design.md §7.4, §7.7 |

Inline SVG icon set (24×24, 1.5px stroke, `currentColor`): WhatsApp, phone, location, clock, car,
SUV, truck, forklift, off-road, fitting, alignment, balancing, filter, close, chevron, check. Plus the
abstract tyre-tread pattern and the amber radial-glow backdrop.
**AC:** no icon font or runtime icon library; decorative SVG is `aria-hidden`; tread motif is
themeable and under 4KB.

---

## Phase 1 — Sanity Backend

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T006** | Sanity project & client | T001 | Constitution §III |

Create the Sanity project and dataset. Configure `lib/sanity/client.ts` with project id, dataset, API
version, and CDN reads. Wire environment variables.
**AC:** a test query returns data; no token is committed; client is importable from Server Components.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T007** | Content schemas | T006 | FR-F1, FR-F2, FR-F3, FR-F4 · FR-B3 |

Implement all five schemas exactly as specified in `design.md` §5: `brand` (with the
`relationship` field — importer/dealer/stocked), `category`, `product` (structured
width/profile/rim plus `sizeLabelOverride`), `service`, `siteSettings` (singleton).
**AC:** validation blocks publishing a product without image, alt text, or price; `relationship` is
required on every brand; `siteSettings` is enforced as a singleton.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T008** | Studio route | T007 | FR-F1 |

Mount Sanity Studio at `/studio` with a custom desk structure: settings pinned as a singleton,
products grouped by category, brands grouped by relationship.
**AC:** authentication required; usable in a phone browser; publishing works end to end.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T009** | GROQ queries & types | T007 | design.md §6 |

Implement the query set in `lib/sanity/queries.ts` and generated TypeScript types. All queries are
cache-tagged per the route map in `design.md` §4.
**AC:** every query is parameterised — no string interpolation of user input anywhere; types are
generated, not hand-written; each query carries its correct tags.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T010** | Revalidation webhook | T009 | FR-F1 · S2 |

`/api/revalidate` verifies the Sanity webhook signature, then calls `revalidateTag` for the affected
document type and slug.
**AC:** a valid signed request revalidates and returns 200; an unsigned or tampered request returns
401 and changes nothing; a Studio publish is live within seconds with no redeploy.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T011** | Seed content | T008 | §2 Confirmed Business Facts · OQ-2 |

Populate: `siteSettings` (Mon–Sat 10:00–19:00, Sunday closed, delivery note, M.A. Jinnah Road,
0317-4724400); five categories (car, SUV, truck, lifter, off-road); three services (fitting,
computerized alignment, computerized balancing — **no others**); brands with correct relationships —
importer: Yokohama, Rapid, Michelin, Duhow · dealer: Dunlop, General, Armstrong; plus representative
sample products across every category.
**AC:** no service outside the three exists; every brand carries a relationship; at least one product
per category, including one using `sizeLabelOverride` for a commercial size.

---

## Phase 2 — Layout Shell

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T012** | Header & navigation | T004, T009 | FR-D1 |

Sticky header: wordmark, nav (Tyres, Brands, Services, About, Contact), and a WhatsApp action at
desktop widths. Mobile drawer.
**AC:** drawer traps focus, closes on `Esc`, restores focus to its trigger; current route indicated
to assistive technology.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T013** | Footer | T003, T009 | R6 · FR-A6 |

NAP block, hours with the Sunday closure, delivery note, category and brand links, WhatsApp and call.
All values sourced from `siteSettings`.
**AC:** no contact detail is hardcoded; hours render from settings.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T014** | Sticky mobile contact bar | T004 | FR-D1 |

Fixed bottom bar below 768px: WhatsApp (primary) + Call, respecting safe-area inset.
**AC:** hidden at `md` and above; never covers footer actions; hides while the filter sheet is open;
both actions have descriptive accessible names.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T015** | Root layout & base SEO | T012, T013, T014 | FR-G1, FR-G2 |

Wire the shell into `app/layout.tsx`. Default metadata, skip-to-content link, and sitewide
`LocalBusiness` JSON-LD including `openingHoursSpecification` (Mon–Sat 10:00–19:00, Sunday closed).
**AC:** JSON-LD validates in Google's Rich Results Test; skip link works; one `h1` per page.

---

## ◆ Checkpoint 1 — Design Direction

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T016** | Homepage hero | T005, T015 | FR-A1 |

Build the hero only: business name, importer/dealer line, two CTAs, radial amber glow, tread motif.
Deploy a preview.

**AC:** LCP element is optimized with priority loading; no horizontal scroll at 360px; composition
works with zero photography (NFR-12).

> **STOP.** The owner reviews the live preview and approves the visual direction — colours, type,
> glow, and overall feel — before any further UI is built on top of it. Changing direction here costs
> one task; changing it after Phase 5 costs fifteen.

---

## Phase 3 — Catalog

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T017** | Product card & badges | T004, T009, ◆1 | FR-B1 · design.md §7.5 |

`ProductCard`, `ProductGrid`, `StockBadge`, `PriceTag`, `BrandBadge`.
**AC:** `BrandBadge` renders all three relationship states distinctly; out-of-stock cards stay
visible and still offer an inquiry; the card's inner WhatsApp control is not nested inside the card
link; price uses tabular numerals.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T018** | Filter logic | T009 | FR-B2 · design.md §6 |

`lib/filters.ts`: parse and validate `searchParams`, drop unknown or malformed values, compose GROQ
constraints as parameters.
**AC:** malformed input never reaches a query; the URL contract from `design.md` §4 round-trips
exactly; unit-tested including hostile input.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T019** | Filter UI | T018, T017 | FR-B2 |

Desktop sticky sidebar (280px); mobile bottom sheet with "Filters (n)" trigger and pinned
Apply/Clear; active filters as removable chips with "Clear all".
**AC:** filter changes push to the URL and the server re-renders; back/forward work; sheet traps
focus and closes on `Esc`; result count is announced via `aria-live`.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T020** | Catalog page `/tyres` | T019 | FR-B1, FR-B2 |

Server-rendered filtered grid with result count and pagination beyond 24 items.
**AC:** a filtered URL is shareable and renders identically on a cold load; empty state shows the
WhatsApp fallback; canonical points to `/tyres`.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T021** | Product detail `/tyres/[slug]` | T017 | FR-B4 |

Gallery, brand + relationship badge, size, price, stock, specs table, description, WhatsApp and call
CTAs, related products, `Product` JSON-LD, unique metadata.
**AC:** the WhatsApp message is pre-filled with product name and size; every image has meaningful
alt text; JSON-LD validates; `generateStaticParams` covers all published products.

---

## Phase 4 — Landing Pages

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T022** | Brand pages | T017 | FR-B6 · R2 |

`/brands` grouped by relationship, and `/brands/[slug]` with logo, an explicit relationship statement
("…is a direct importer of Yokohama tyres in Karachi"), that brand's products, and a WhatsApp CTA.
**AC:** metadata targets "<brand> tyres Karachi" and "<brand> importer/dealer Karachi"; a page exists
for every published brand; the relationship statement is generated from data, never hardcoded.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T023** | Category pages | T017 | FR-B5 |

`/categories/[slug]` for car, SUV, truck, lifter, off-road — category copy, products, CTA.
**AC:** commercial categories get the same design quality as car; metadata targets "truck tyres
Karachi", "forklift tyres Karachi", etc.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T024** | Services page | T004, T009 | FR-C1, FR-C2, FR-C3 |

Three sections — fitting, computerized alignment, computerized balancing — each with icon,
keyword-targeted heading, description, and its own WhatsApp CTA. Delivery note with "WhatsApp for
delivery charges".
**AC:** puncture repair and nitrogen inflation appear nowhere on the site; each CTA pre-fills its
service name; no delivery rate is quoted.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T025** | About page | T009 | FR-E1 |

Importer/dealer story naming the import brands (Yokohama, Rapid, Michelin, Duhow) and dealership
brands (Dunlop, General, Armstrong), what the shop stands for, hours and location.
**AC:** zero invented awards, certifications, statistics, or staff imagery (Constitution §II.6);
reads credibly without photography.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T026** | Contact page | T003, T009 | FR-D3 |

NAP block, hours, delivery note, WhatsApp and call, embedded Google Map. **No form.**
**AC:** no form field exists anywhere; map is lazy-loaded and does not block LCP; all values come
from `siteSettings`.

---

## Phase 5 — Homepage Completion

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T027** | Trust strip & size finder | T016, T018 | FR-A2 |

Numeric trust strip ("20+ Brands · 4 Imported Directly · Karachi") and the width/profile/rim finder
with a vehicle-category selector.
**AC:** submitting navigates to `/tyres` with filters applied; **works with JavaScript disabled**
(plain form submission to a filtered URL); helper text explains where to read the sidewall.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T028** | Category grid & featured products | T017, T023 | FR-A4 |

Five category cards of equal visual weight, plus a featured-products row driven by the `featured` flag.
**AC:** commercial categories are not visually subordinate to car; the featured row hides if nothing
is flagged.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T029** | Brand strip, services & location blocks | T022, T024, T026 | FR-A3, FR-A5, FR-A6 |

Brand strip grouped by relationship (importer and dealer first), services summary, and the
location/hours/delivery block.
**AC:** brand section hides entirely when no brands are published; delivery is stated as chargeable,
never implied free; hours reflect the Sunday closure.

---

## Phase 6 — Polish & Hardening

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T030** | Motion layer | T029 | Constitution §IV · NFR-4 |

`Reveal` component and the interaction motion from `design.md` §7.6.
**AC:** nothing loops or autoplays; nothing animates above the fold before LCP; under
`prefers-reduced-motion: reduce` all motion is disabled and elements render in their final state.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T031** | States & resilience | T020, T021 | NFR-11 · design.md §13 |

Loading skeletons matching final layouts, empty states, branded 404, and graceful Sanity-failure
handling.
**AC:** a simulated Sanity outage still renders a usable page with working contact actions; no
full-page spinners; no blank error screen.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T032** | SEO completion | T021, T022, T023 | FR-G3, FR-G4, FR-G5 |

`sitemap.ts` and `robots.ts` generated from Sanity; canonicals everywhere; Open Graph and Twitter
cards; keyword-targeted copy pass.
**AC:** sitemap includes every published product, brand, category, service, and static page; filtered
catalog views canonicalize to `/tyres`; no keyword stuffing.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T033** | Accessibility audit | T030, T031 | NFR-3 · design.md §10 |

Keyboard-only pass plus axe on every route; fix everything found.
**AC:** zero axe violations; every route completable by keyboard alone; contrast verified on real
rendered output, not just token math.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T034** | Performance audit | T033 | NFR-2 · Constitution §II.4 |

Lighthouse mobile on every route; fix regressions.
**AC:** Performance ≥ 90 on mobile for every route; LCP ≤ 2.5s throttled to 4G; no third-party script
blocks render.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T035** | Browser verification | T034 | Constitution §VI |

Drive the real site in a browser: catalog filtering, a product inquiry, mobile sticky bar, filter
sheet, and every WhatsApp deep link. Capture evidence at 360px and 1440px.
**AC:** every WhatsApp link opens with the correct pre-filled message; filters behave correctly on
cold loads and back/forward; verified in Chrome and iOS Safari.

---

## ◆ Checkpoint 2 — Pre-Launch Review

Owner reviews the complete staging site against `requirements.md`. Launch is blocked until approved.

---

## Phase 7 — Launch

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T036** | Production deployment | ◆2 | design.md §15 |

Deploy to Vercel on `main`, configure production environment variables, point the Sanity webhook at
`/api/revalidate`, connect the domain (OQ-3).
**AC:** production build succeeds; a Studio publish reaches production within seconds; HTTPS and
`www`/apex redirects correct; no secret in the client bundle.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T037** | Security review | T036 | Constitution §III, §VI |

Review webhook signature verification, GROQ parameterisation, environment-variable exposure, and
`NEXT_PUBLIC_*` boundaries.
**AC:** no secret reachable from the client; webhook rejects unsigned requests; no unparameterised
query anywhere.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T038** | Local SEO handover | T036 | R7 · FR-D4 · OQ-1 |

Confirm Google Business Profile status. If absent, provide a step-by-step setup guide (categories:
primary "Tire Shop", secondary "Auto Repair Shop" and "Wheel Alignment Service"). Verify NAP matches
the site exactly. Wire the review link into `siteSettings` once available.
**AC:** NAP is character-identical between the site and the profile; the review path renders only
once `googleReviewUrl` is set.

| # | Task | Depends on | Implements |
|---|---|---|---|
| **T039** | Owner handover | T038 | S2 · FR-F1 |

Walk the owner through Sanity Studio: adding a product, changing a price, marking stock, adding a
brand. Short written guide in Roman Urdu.
**AC:** the owner completes a full add-product and price-change cycle unaided, and the change appears
live.

---

## Summary

| Phase | Tasks | Output |
|---|---|---|
| 0 — Foundation | T001–T005 | Scaffold, tokens, helpers, primitives, icons |
| 1 — Sanity | T006–T011 | Schemas, Studio, queries, webhook, seed content |
| 2 — Shell | T012–T015 | Header, footer, sticky contact, base SEO |
| ◆1 | T016 | **Design direction approval** |
| 3 — Catalog | T017–T021 | Cards, filters, catalog, product detail |
| 4 — Landing | T022–T026 | Brand, category, services, about, contact |
| 5 — Homepage | T027–T029 | Finder, categories, brands, services, location |
| 6 — Polish | T030–T035 | Motion, states, SEO, a11y, performance, browser QA |
| ◆2 | — | **Pre-launch approval** |
| 7 — Launch | T036–T039 | Deploy, security, local SEO, handover |

**39 tasks · 2 checkpoints.** Every task traces to a requirement in §Implements.

## Approval

| Phase | Status |
|---|---|
| Tasks drafted | Complete |
| Owner review | **Pending** |
| Approved to begin T001 | **Pending** |
