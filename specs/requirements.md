# Requirements — Baber Tyres Corporation Website

**Version:** 0.2.0 (Draft — owner answers incorporated 2026-09-25)
**Governed by:** [`constitution.md`](./constitution.md)
**Evidence base:** [`research.md`](./research.md)

---

## 1. Purpose

A website for Baber Tyres Corporation (M.A. Jinnah Road, Karachi) that converts local search traffic
into WhatsApp inquiries and walk-ins, establishes the business as a **tyre importer and dealer** —
not just a retail shop — and that the owner can keep up to date without a developer.

This is **not** an online store. Per Constitution §II.2, every surface terminates in an inquiry.

## 2. Confirmed Business Facts

| Field | Value |
|---|---|
| Name | Baber Tyres Corporation |
| Address | M.A. Jinnah Road, Karachi |
| Phone / WhatsApp | 0317-4724400 |
| Hours | Monday–Saturday, 10:00 AM – 7:00 PM |
| Closed | Sunday |
| **Importer of** | Yokohama, Rapid, Michelin, Duhow |
| **Dealer of** | Dunlop, General, Armstrong |
| Total brands | 20+ as dealer and/or importer |
| Services | Tyre fitting · Computerized wheel alignment · Computerized wheel balancing |
| Categories | Car · SUV/4x4 · Truck/Commercial · Lifter/Forklift · Off-road |
| Fulfilment | Walk-in **and** delivery available (delivery charges apply) |
| Inquiries | WhatsApp only — no contact form, no email |
| Photography | None available — design must not depend on real shop photos |
| Google Business Profile | Status unknown — to be checked |

## 3. Positioning

Per R9, we do not compete with PakWheels/Daraz on national e-commerce. Our differentiators, in order:

1. **Importer and dealer of 20+ brands** — direct import means genuine stock and better pricing. This
   is the single strongest trust signal the business has and must be prominent sitewide.
2. **Full vehicle coverage** — car to truck to forklift to off-road. Most local competitors are
   car-only.
3. **Location** — M.A. Jinnah Road, Karachi, with delivery as an option.
4. **Instant WhatsApp response.**

## 4. Success Criteria

| # | Metric | Target |
|---|---|---|
| S1 | WhatsApp inquiries from the site | Measurable and growing month over month |
| S2 | Owner self-serves product/price/stock updates | 100%, no developer involvement |
| S3 | Lighthouse Performance (mobile) | ≥ 90 |
| S4 | Ranking for "tyre shop Karachi" / "tyre importer Karachi" | Page 1 within 6 months |
| S5 | Brand-intent traffic ("Yokohama tyres Karachi") landing on brand pages | Growing |

## 5. Personas

**P1 — Car/SUV owner (primary).** Knows their size or their car. On a phone, on mobile data. Wants:
do you have my size, what's the price, are you genuine, can I message you now.

**P2 — Commercial buyer.** Needs truck, lifter/forklift, or off-road tyres, often in quantity. Cares
about genuine import, availability, and bulk pricing. Low tolerance for a site that looks car-only.

**P3 — Brand-loyal buyer.** Searching "Yokohama tyres Karachi" or "Michelin dealer Karachi". Must land
on a credible brand page that proves we are the importer/dealer.

**P4 — Service seeker.** Needs alignment or balancing, nearby, today.

**P5 — The owner (content editor).** Non-technical. Adds products, changes prices, marks stock —
from a phone, no code, no redeploy.

---

## 6. Functional Requirements

### Epic A — Homepage

**FR-A1 — Hero**
Acceptance criteria:
- Business name, one-line value proposition, and "M.A. Jinnah Road, Karachi" visible immediately
- Importer/dealer status stated in the hero — e.g. "Importer & Dealer of 20+ Tyre Brands"
- Two actions above the fold: **Browse Tyres** and **WhatsApp**
- No horizontal scroll at 360px; LCP element optimized with priority loading
- Composition works without photography (NFR-12)

**FR-A2 — Size finder**
As P1/P2, I can jump straight to my size from the homepage.

Acceptance criteria:
- Width / profile / rim dropdowns, plus a vehicle-category selector
- Submitting navigates to the catalog with filters applied via URL query params
- Works without JavaScript — the form submits to a filtered URL
- Helper text explains where to read the size off the sidewall

**FR-A3 — Brand showcase with importer/dealer distinction**
As P3, I can see which brands we carry and in what capacity.

Acceptance criteria:
- Brands are Sanity-managed (R2), each tagged **Importer**, **Dealer**, or **Stocked**
- Importer and dealer brands are visually distinguished and shown first
- "20+ brands" is communicated, with the headline brands named
- Each brand links to its brand page (FR-B6)
- Section hides entirely if no brands are published

**FR-A4 — Vehicle category entry points**
Acceptance criteria:
- Five entry cards: Car · SUV/4x4 · Truck/Commercial · Lifter/Forklift · Off-road
- Each links to the catalog filtered to that category
- Commercial categories carry equal visual weight to car (P2 must not feel like an afterthought)

**FR-A5 — Services summary**
Condensed view of the three services, linking to the Services page.

**FR-A6 — Location, hours & delivery block**
Acceptance criteria:
- Address, hours (Mon–Sat 10 AM–7 PM, Sunday closed), phone, embedded map
- Delivery availability stated, with "charges apply" made clear — no implied free delivery
- All values come from the shared NAP config (R6)

---

### Epic B — Product Catalog & Discovery

**FR-B1 — Catalog listing**
Acceptance criteria:
- Server-rendered product grid
- Card shows: image, name, brand (with importer/dealer badge), size, price in PKR, stock status
- Out-of-stock items remain listed but visually distinct — the customer may still inquire
- Empty state offers a WhatsApp fallback ("size nahi mili? humein message karein")
- Pagination or incremental loading beyond 24 items

**FR-B2 — Filtering**
Acceptance criteria:
- Filters: **brand** (multi-select), **size** (width/profile/rim), **category** (car/SUV/truck/lifter/off-road), **price range**
- Filter state lives in the URL — shareable, and back/forward behave correctly
- Active filters shown as removable chips with "Clear all"
- Mobile filters use a bottom sheet or collapsible panel, not a shrunken desktop sidebar
- Result count updates and is announced to assistive technology

**FR-B3 — Structured size data**
Per R1, size is stored as separate numeric fields — width, profile, rim — never free text.

Acceptance criteria:
- Sanity validation enforces all three
- One shared helper renders the display string (`185/65 R15`)
- Filtering operates on the numeric fields
- The schema accommodates commercial sizing conventions used for truck and forklift tyres

**FR-B4 — Product detail page**
Acceptance criteria:
- Shows name, brand + relationship badge, full size, category, price, stock status, description, images
- Primary CTA **Inquire on WhatsApp**, pre-filled with product name and size
- Secondary CTA **Call**
- Related products (same size or same brand)
- Unique SEO metadata and Product structured data
- Meaningful alt text on every image

**FR-B5 — Category landing pages**
Acceptance criteria:
- A page per category (car, SUV, truck, lifter, off-road) with its own copy and SEO metadata
- Targets category keywords ("truck tyres Karachi", "forklift tyres Karachi")
- Lists that category's products

**FR-B6 — Brand landing pages**
As P3, searching a brand name brings me to a page that proves our standing.

Acceptance criteria:
- A page per brand: logo, description, importer/dealer status stated explicitly, and that brand's products
- Unique SEO metadata targeting "<brand> tyres Karachi" and "<brand> dealer/importer Karachi"
- Sanity-managed, created automatically for every published brand

---

### Epic C — Services

**FR-C1 — Services page**
Acceptance criteria:
- One section each for: **tyre fitting**, **computerized wheel alignment**, **computerized wheel balancing**
- Only these three. Puncture repair and nitrogen inflation are explicitly **not** offered and must not appear (Constitution §II.6)
- Services are Sanity-managed
- Each section targets its own keyword phrasing in headings (R5)
- Each has its own WhatsApp CTA

**FR-C2 — Service inquiry**
WhatsApp CTA per service, pre-filled with that service name.

**FR-C3 — Delivery information**
Acceptance criteria:
- Delivery is presented as available with charges applicable
- Stated without quoting a rate — charges depend on location and order, so the CTA is "WhatsApp for delivery charges"

---

### Epic D — Contact & Conversion

**FR-D1 — Persistent contact actions**
Acceptance criteria:
- Sticky WhatsApp and call actions on every page at mobile widths (Constitution §IV)
- Never obscure primary content or the footer's own actions
- Keyboard reachable and correctly labelled

**FR-D2 — WhatsApp deep links**
Acceptance criteria:
- `wa.me` links built from the number in the shared NAP config
- Context-aware message text: product name + size on product pages, brand on brand pages, service name on service sections, generic elsewhere
- The number lives in exactly one config module (R6)

**FR-D3 — Contact page**
Acceptance criteria:
- Address, phone, WhatsApp, hours, embedded Google Map
- **No contact form** — WhatsApp and call are the only channels (owner decision)
- Delivery availability noted

**FR-D4 — Google review path**
A visible, non-intrusive prompt inviting satisfied customers to review on Google (R7).
Blocked until the Google Business Profile status is confirmed — see OQ-1.

---

### Epic E — About & Trust

**FR-E1 — About page**
Acceptance criteria:
- Genuine story centred on importer and dealer standing across 20+ brands
- Names the import brands (Yokohama, Rapid, Michelin, Duhow) and dealership brands (Dunlop, General, Armstrong)
- No invented awards, certifications, statistics, or stock-photo staff (Constitution §II.6)
- Reads credibly without photography (NFR-12)

---

### Epic F — Content Management (Sanity)

**FR-F1 — Product management**
Acceptance criteria:
- Studio at a dedicated authenticated route
- Product fields: name, slug, brand (reference), width, profile, rim, category, price, stock status, images, alt text, description, featured flag
- Validation blocks publishing without image, alt text, and price
- Changes appear live with no redeploy
- Studio usable in a phone browser

**FR-F2 — Brand management**
Acceptance criteria:
- Brand document: name, slug, logo, description, **relationship** (importer / dealer / stocked), display order
- Removing a brand that products reference is prevented or handled safely

**FR-F3 — Service management**
Service document: name, slug, description, icon, display order.

**FR-F4 — Site settings**
Single settings document holding shop name, address, phone, WhatsApp number, hours, closed day,
delivery note, and map coordinates — the source feeding the shared NAP config (R6).

---

### Epic G — SEO & Discoverability

**FR-G1 — Per-page metadata.** Unique title and description on every page; overridable in Sanity.

**FR-G2 — Structured data.**
- LocalBusiness sitewide, from the shared NAP (R6), including opening hours and the Sunday closure
- Product schema on product pages
- BreadcrumbList on catalog, category, brand, and product pages

**FR-G3 — Generated sitemap and robots.txt**, covering all published products, brands, categories, and services.

**FR-G4 — Keyword targeting.** Localized terms ("tyre shop Karachi", "tyre shop M.A. Jinnah Road"),
importer terms ("tyre importer Karachi", "<brand> importer Pakistan"), category terms ("truck tyres
Karachi", "forklift tyres Karachi"), and service terms ("wheel alignment Karachi") — naturally, without stuffing.

**FR-G5 — Social preview.** Open Graph and Twitter card metadata on all pages.

---

## 7. Non-Functional Requirements

| ID | Requirement | Acceptance |
|---|---|---|
| NFR-1 | Mobile-first | Designed at 360px first; verified at 360 / 768 / 1440 |
| NFR-2 | Performance | Lighthouse mobile ≥ 90; LCP ≤ 2.5s on 4G |
| NFR-3 | Accessibility | WCAG 2.1 AA; keyboard navigable; visible focus; AA contrast on body text |
| NFR-4 | Reduced motion | Non-essential animation disabled under `prefers-reduced-motion` |
| NFR-5 | Images | `next/image`, AVIF/WebP, explicit dimensions, lazy except LCP |
| NFR-6 | Type safety | TypeScript strict; no `any` committed |
| NFR-7 | Rendering | Server Components by default |
| NFR-8 | Design system | Only the six locked tokens; amber is the sole accent (Constitution §IV) |
| NFR-9 | Secrets | Environment variables only |
| NFR-10 | Browser support | Latest 2 versions of major browsers; Android Chrome and iOS Safari |
| NFR-11 | Resilience | Sanity fetch failure still renders a usable page with contact options |
| **NFR-12** | **Photography-independent design** | No shop photography exists. The design must carry itself on typography, layout, brand logos, CSS/SVG graphics, and product imagery from brand catalogs. No stock photos posing as this shop (Constitution §II.6) |

---

## 8. Out of Scope (v1)

Per Constitution §VIII, plus owner decisions:

- Online payments, cart, checkout
- User accounts / login
- **Vehicle → size finder** (deferred by owner; revisit in v2)
- **Contact form** (WhatsApp is the only inquiry channel)
- Puncture repair and nitrogen inflation content — not offered by the business
- Urdu script localization · blog · live POS inventory sync · on-site reviews · sidewall OCR · competitor price comparison

---

## 9. Open Questions

| # | Question | Blocks |
|---|---|---|
| OQ-1 | Does a Google Business Profile exist for the shop? | FR-D4, local SEO plan |
| OQ-2 | Full list of the 20+ brands, each tagged importer / dealer / stocked | FR-A3, FR-B6, FR-F2 |
| OQ-3 | Domain name for the site | Deployment |
| OQ-4 | Is there a business email for site contact/ownership records? | Deployment, GBP |

None of these block starting `design.md`. OQ-2 can be filled in during content entry; the schema
supports it regardless.

---

## 10. Traceability

| Requirement | Source |
|---|---|
| FR-B3 | R1 — structured size fields |
| FR-A3, FR-B6, FR-F2 | R2 — brand as first-class entity; extended with importer/dealer status |
| FR-B2 | R3 — size + brand + category filtering |
| — | R4 — vehicle → size lookup, **deferred by owner** |
| FR-C1, FR-G4 | R5 — per-service keyword targeting |
| FR-D2, FR-F4, FR-G2 | R6 — single NAP source |
| FR-D4 | R7 — reviews ≈ 20% of local ranking |
| FR-B1, FR-F1 | R8 — owner-editable PKR pricing |
| §3 Positioning | R9 — local trust over national e-commerce, strengthened by importer status |
| NFR-1…12 | Constitution §II, §III, §VI |

---

## 11. Approval

| Phase | Status |
|---|---|
| Requirements drafted | Complete |
| Owner answers incorporated | Complete (2026-09-25) |
| Owner review of v0.2.0 | **Approved** 2026-09-25 |
| Approved to proceed to `design.md` | **Yes** |
