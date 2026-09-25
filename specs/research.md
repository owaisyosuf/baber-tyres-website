# Market & Competitor Research

**Date:** 2026-09-25
**Purpose:** Evidence base for `requirements.md`. Findings here justify features; features without a
finding or an owner decision behind them are scope creep.

---

## 1. Competitive Landscape (Pakistan / Karachi)

| Competitor | Type | What they do well | Gap we can exploit |
|---|---|---|---|
| [Tyre Point](https://tyrepoint.pk/) | National retail chain, since 1985 | Search by brand / car / tread pattern, full price list pages | Generic chain — no local M.A. Jinnah Road presence or personal service |
| [PakWheels AutoStore](https://www.pakwheels.com/accessories-spare-parts/tyres-karachi/164660) | Marketplace | Huge inventory (177+ listings in Karachi), price range PKR 2,720–300,000 | Marketplace, not a shop — no fitting service, no relationship |
| [Techno Tyres](https://technotyre.com/) | Karachi shop | Local Karachi competitor, tyre repairing service pages | Direct competitor — study their service page structure |
| [SehgalMotors](https://sehgalmotors.pk/collections/wheel-tyres) | Online store | Size filtering 16"–20", nationwide delivery | E-commerce heavy; we compete on walk-in trust + instant WhatsApp response |
| [Daraz](https://www.daraz.pk/auto-tyres-wheels/) | Marketplace | COD, reach | No fitting, no expertise, no after-sales |
| [Saif Traders](https://saiftraders.pk/tyre-size-guide-pakistan/) | Retailer + content | Strong SEO content (tyre size guides, brand price pages) | Their content strategy is proven — worth mirroring |

**Takeaway:** National players own "buy tyres online Pakistan". We should not fight there. We win on
**local + Karachi + M.A. Jinnah Road + instant WhatsApp response + fitting on site**.

---

## 2. Brands in the Pakistani Market

Brands to support in the Sanity `brand` taxonomy:

- **Premium / imported:** Bridgestone, Dunlop, Yokohama, Continental, Michelin
- **Local:** General Tyre, Service (Servis) Tyres, Ghandhara
- **Chinese value segment:** Linglong, Zextour and similar — a large and growing share of the market

**Takeaway:** Brand is a first-class filter. Customers shop by brand name as much as by size, and the
value/premium split is a real decision axis for Pakistani buyers.
Source: [PakWheels — Best Tyre Brands in Pakistan 2026](https://www.pakwheels.com/blog/best-tyre-brands-in-pakistan-2026/),
[China Tyre Prices Guide](https://www.pakwheels.com/blog/the-complete-guide-to-china-tyre-prices-in-pakistan/)

---

## 3. Pricing Reality (for field validation, not for publishing)

Market-wide car tyre prices span roughly **PKR 990 – 199,999**, driven by size, brand, vehicle type.

Observed per-tyre ranges:

| Vehicle | Range (per tyre) |
|---|---|
| Honda City | Rs. 11,500 – 16,000 |
| Toyota Corolla | Rs. 12,500 – 18,000 |
| Honda Civic | Rs. 14,000 – 20,000 |
| 145/70 R12 (Alto class, Dunlop entry) | Rs. 12,000 – 15,000 |
| 265/70 R16 (SUV, Dunlop) | Rs. 40,000 – 50,000 |

**Takeaway:** The price field must be a plain number formatted as PKR, and must tolerate a wide range
(4 to 6 digits). Prices move — this is exactly why Sanity-editable pricing is a constitutional
requirement. Actual Baber Tyres prices come from the owner, never from this table.
Source: [PakWheels Tyres](https://www.pakwheels.com/accessories-spare-parts/tyres/164652),
[Saif Traders — Dunlop Prices](https://saiftraders.pk/dunlop-tyres-price-in-pakistan-rates-and-why-to-buy/)

---

## 4. Tyre Sizes — Local Fitment Data

Sizes actually common on Karachi roads:

| Size | Vehicles |
|---|---|
| 145/70 R12 | Suzuki Alto |
| 145/80 R12 | Suzuki Bolan |
| 165/70 R14 | Suzuki Swift (older) |
| 175/65 R15 | Suzuki Swift (older variants) |
| 185/55 R16 | Suzuki Swift (2022–2024) |
| 185/65 R15 | Honda City, Toyota Yaris, Honda Grace |
| 195/65 R15 | Common all-round size |
| 265/70 R16 | SUV segment |

**Takeaway:** Size must be **structured data, not free text** — store width / profile / rim as separate
fields so filtering works. A "find tyres for my car" mapping (vehicle → size) is high value because
most Pakistani buyers know their car, not their tyre size.
Source: [PakWheels — How to Read Tyre Size](https://www.pakwheels.com/blog/how-to-read-tyre-size-pakistan/),
[Tyre Point — OE Sizes by Vehicle](https://tyrepoint.pk/vehicles-with-available-oe-size-tyres/)

---

## 5. Tyre Finder UX — What Works

Industry standard is **multiple entry paths to the same catalog**:

1. **By vehicle** — make → model → year → variant (best for non-technical buyers)
2. **By size** — width / profile / rim dropdowns (best for repeat buyers)
3. **By brand** — brand landing pages
4. **By vehicle type** — car / SUV / bike / truck

Michelin and others report that **poor UX is the main thing holding back online tyre commerce**.
Advanced players now offer OCR ("point your camera at the sidewall") to read size automatically.

**Takeaway for v1:** Ship **size search + brand filter + category filter**. A simplified
**vehicle → size lookup** for the top ~15 Pakistani models is a strong differentiator and cheap to
build from a static mapping table. OCR is out of scope.
Source: [Toyo Tire Finder](https://www.toyotires.com/tire-finder),
[Michelin Tyre Size Recognition](https://mobilityintelligence.michelin.com/en/products/tire-size-recognition/),
[Wheel-Size widgets](https://services.wheel-size.com/)

---

## 6. Services to Feature

Standard Karachi tyre shop service set — confirm with owner which are actually offered:

- Tyre fitting / installation
- Computerized wheel alignment (3D alignment is a selling point locally)
- Computerized wheel balancing
- Puncture repair (tread area)
- Nitrogen inflation
- Air pressure check
- Alloy rim inspection
- Tyre rotation & inspection

Competitors market on: skilled technicians, **same-day turnaround**, honest rates, quality materials,
clean workspace.

**Takeaway:** Services deserve their own page with one section per service. These are the queries that
bring in nearby, ready-to-buy customers.
Source: [Techno Tyre — Repairing](https://technotyre.com/tyre-repairing/),
[Karachi alignment directory](https://www.karachi2.ebizpk.com/wheel-balancing-alignment-karachi.htm)

---

## 7. Local SEO — Highest-Leverage Findings

- **Google Business Profile carries ~32% of local ranking weight** — the single biggest factor. It
  matters more than the website itself for "near me" searches.
- **Reviews carry ~20%.** Volume and recency beat a perfect average: 200 reviews at 4.6★ typically
  outranks 15 reviews at 4.9★.
- **NAP consistency** (Name, Address, Phone identical across GBP, website, and every directory) is a
  direct trust signal. Ours: *Baber Tyres Corporation / M.A. Jinnah Road, Karachi / 0317-4724400*.
- **Category setup:** primary "Tire Shop", secondary "Auto Repair Shop", "Wheel Alignment Service".
- **Keywords** split two ways: localized ("tyre shop M.A. Jinnah Road", "tyre shop Karachi") and
  service-specific ("wheel alignment Karachi", "puncture repair near me").

**Takeaway:** The website must feed the GBP, not duplicate it. Concretely: identical NAP in one config
module, LocalBusiness structured data, embedded map, per-service pages targeting service keywords, and
a visible path for happy customers to leave a Google review.
Source: [Tireweb — GBP Guide](https://www.tireweb.com/resources/tire-shop-google-business-profile-guide),
[Tireweb — Local SEO for Tire Shops](https://www.tireweb.com/resources/local-seo-for-tire-shops),
[BizIQ — SEO for Tire Shops 2026](https://biziq.com/blog/seo-for-tire-shops-how-local-customers-find-you-in-2026-and-how-to-claim-your-share/)

---

## 8. Decisions This Research Drives

| # | Decision | Rationale |
|---|---|---|
| R1 | Tyre size stored as structured fields (width/profile/rim), not a string | Section 4 — filtering is impossible on free text |
| R2 | Brand is a Sanity document type with its own landing pages | Sections 2, 7 — customers search by brand; brand pages rank |
| R3 | Catalog supports size search + brand filter + category filter | Section 5 |
| R4 | Vehicle → size lookup for top ~15 Pakistani models | Section 5 — buyers know their car, not their size |
| R5 | Dedicated per-service sections targeting service keywords | Sections 6, 7 |
| R6 | NAP in a single config module + LocalBusiness schema | Section 7 — consistency is a ranking signal |
| R7 | Prominent "review us on Google" path | Section 7 — reviews are ~20% of local ranking |
| R8 | Price is a number field, PKR-formatted, owner-editable | Section 3 — prices move constantly |
| R9 | Positioning is local Karachi trust, not national e-commerce | Section 1 — we cannot outrank marketplaces on generic terms |

---

## 9. Open Questions for the Owner

1. Which services does Baber Tyres actually offer? (alignment? balancing? nitrogen? 3D alignment?)
2. Which brands are stocked, and is there a flagship/authorized-dealer brand?
3. Categories to serve: car only, or bike / truck / SUV as well?
4. Does the shop have a Google Business Profile already, and existing reviews?
5. Shop timings, and open on which days?
6. Are real shop photos available, or do we need a photo plan?
7. Any delivery/mobile fitting service, or strictly walk-in?
