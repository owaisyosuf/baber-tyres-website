# Handoff — Baber Tyres Website

_Last updated: 2026-09-29 (office PC → laptop)_

Is file se kaam wahin se shuru karein jahan chhora tha. Laptop par Claude Code kholein aur kahein:
**"HANDOFF.md parho aur wahan se shuru karo."**

---

## 1. Kahan kya hai

| Cheez | Link / ID |
|---|---|
| Live site | https://baber-tyres-website.vercel.app |
| Live Studio (products add/edit) | https://baber-tyres-website.vercel.app/studio (CORS set hone ke baad chalega — neeche dekhein) |
| GitHub repo | https://github.com/owaisyosuf/baber-tyres-website (branch `main`) |
| Vercel project | `baber-tyres-website` (GitHub login, Hobby plan). Har `main` push par khud deploy hota hai |
| Sanity project | ID `88kcfa1h`, dataset `production` — **doosri Gmail** wale account se login (sanity.io/manage) |
| Local Studio | http://localhost:3000/studio (jab `npm run dev` chal raha ho) |

Content (products, prices, photos, logos) **Sanity cloud** mein hai, kisi computer par nahi. Code GitHub → Vercel.

---

## 2. Laptop par setup (pehli dafa)

1. Node.js 20+ aur Git install hon. (`node -v`, `git --version`)
2. Repo clone karein:
   ```
   git clone https://github.com/owaisyosuf/baber-tyres-website.git
   cd baber-tyres-website
   npm install
   ```
3. **`.env.local` banayein** — ye file GitHub par nahi hoti (secrets hain). Office PC ki `F:\BTC WEBSITE\.env.local` ko **mehfooz tareeqe** se laptop par copy karein (USB, ya apne password manager se — GitHub/WhatsApp group par nahi). Is mein ye naam hone chahiye:
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SITE_URL` (local par `http://localhost:3000`), `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SHOW_SAMPLE_DRAFTS=true`
4. Chalayein: `npm run dev` → http://localhost:3000
5. Checks: `npx vitest run` (307 tests pass hone chahiye), `npx eslint`, `npx tsc --noEmit`

Optional files jo sirf office PC par hain (git mein nahi): `stock.xlsx` (stock sheet), `.env.vercel.local` (Vercel ke 5 variables — Vercel mein pehle hi lag chuke hain), `ss*.png` (screenshots — hata sakte hain).

---

## 3. Ab tak kya ho chuka (sab GitHub par push)

- **Phase A:** nav mein Home, trust strip mein "Direct Importer" (count nahi), floating WhatsApp button
- **Phase B:** category aur service mein photo field; 3 service photos + 5 category photos (Pexels/Unsplash free) + 7 brand logos Sanity mein; logos crop nahi hote
- **Phase C:** sab andar ke pages par banner (PageHero); Brands, About, Contact, Services ka naya design; CTA boxes
- **Phase D:** "How buying works" (3 steps, photos ke saath); header/mobile/Tyres page par search — size/brand/vehicle pehchanta hai, suggestions dropdown, kuch na mile to WhatsApp
- Standard tyre sizes (finder + filter), headings par gradient (header/footer samet), card hover lift, chhota footer
- Build fix: koi product published na ho tab bhi build nahi tootta
- `stock.xlsx` se 5 products Sanity mein add kiye; **2 published** (Rapid 195/65 R15, Rapid Ecoterra 265/65 R17)
- **Vercel deploy ho gaya** — 13 pages check, sitemap/canonical sahi URL par, webhook bina signature ke 401 deta hai

---

## 4. AGLA KAAM (yahin se shuru karein)

### 4a. Sanity settings — owner karega (sanity.io/manage → project 88kcfa1h → API)
1. **CORS origin:** `https://baber-tyres-website.vercel.app` — **Allow credentials ✓**. (Is ke baghair live `/studio` mein login nahi hoga)
2. **Webhook:**
   | Field | Value |
   |---|---|
   | Name | `Vercel revalidate` |
   | URL | `https://baber-tyres-website.vercel.app/api/revalidate` |
   | Dataset | `production` |
   | Trigger | Create, Update, Delete |
   | Filter | `_type in ["product", "brand", "category", "service", "siteSettings"]` |
   | Projection | `{ _type, "slug": slug.current }` |
   | Method | POST |
   | Secret | `.env.local` wala `SANITY_REVALIDATE_SECRET` (Vercel mein bhi yahi hai) |
   | Drafts/Versions | off |

### 4b. Test (Claude karega)
Live Studio mein kisi product ka price badal kar Publish → live site chand seconds mein update ho. Na ho to Sanity webhook ki "attempts log" dekhein.

---

## 5. Khulay sawal / baqi kaam

- **General brand logo ⚠️** — site par American "General Tire" (Continental) ka logo laga hai. Agar shop **GTR (General Tyre & Rubber Co. of Pakistan)** ke tyre bechti hai (Euro Star GTR ka hai) to logo badalna hoga. Owner se confirm karna hai.
- **3 drafts photo ke intezar mein** (owner ne abhi skip kaha): Yokohama BluEarth 195/65 R15, Dunlop 6.50-10 Forklift Tyre, General Euro Star 195/65 R15. Photo lagao → Publish.
- Yokohama BluEarth ka **pattern** (AE-01 / ES32 / AE-50?) aur Rapid 195/65 R15 ka pattern pata ho to naam/photo sahi karein.
- Published products ke **alt text** behtar karein (abhi "Rapid", "Rapid Ecoterra").
- Balancing service ki photo mein machine nahi — shop ki asli photo mile to Studio mein badlein.
- **Mobile view** browser mein test nahi hua (360px) — T035 mein karna hai.
- **Soft 404:** ghalat URL (maslan `/tyres/abc`) 404 page dikhata hai magar HTTP 200 deta hai (`noindex` laga hai). T037 mein dekhna hai.
- **Vercel Hobby plan** sirf non-commercial ke liye hai — business site ke liye Pro ($20/mo) ya hosting ka faisla owner ka.
- **Custom domain** (babertyres.com / .pk?) — owner ke paas hai ya lena hai?

## 6. Project tasks (specs/tasks.md)
- T001–T034 ✅
- T036 deploy ✅ (bas 4a baqi)
- **T035** browser verification (mobile samet) — agla
- **◆ Checkpoint 2** — owner ka pre-launch review
- T037 security review · T038 Google Business Profile · T039 Studio handover (Roman Urdu guide)
