# Handoff — Baber Tyres Website

_Last updated: 2026-10-03 (office PC)_

Is file se kaam wahin se shuru karein jahan chhora tha. Claude Code kholein aur kahein:
**"HANDOFF.md parho aur wahan se shuru karo."**

---

## 1. Kahan kya hai

| Cheez | Link / ID |
|---|---|
| Live site | https://baber-tyres-website.vercel.app |
| Live Studio (products add/edit) | https://baber-tyres-website.vercel.app/studio |
| GitHub repo | https://github.com/owaisyosuf/baber-tyres-website (branch `main`) |
| Vercel project | `baber-tyres-website` (GitHub login, Hobby plan). Har `main` push par khud deploy hota hai (~45 sec) |
| Sanity project | ID `88kcfa1h`, dataset `production`. **Doosri Gmail** wale account se login (sanity.io/manage) |
| Local Studio | http://localhost:3000/studio (jab `npm run dev` chal raha ho) |
| Owner guide | `docs/studio-guide.md` (Roman Urdu) |

Content (products, prices, photos, logos) **Sanity cloud** mein hai, kisi computer par nahi. Code GitHub → Vercel.

### Poora circle
```
Code:    Laptop → GitHub → Vercel (deploy)
Content: Studio → Sanity cloud ← Vercel site (parhti hai)
Refresh: Studio Publish → Sanity webhook → /api/revalidate → cache expire → naya content live
```

---

## 2. Naye computer par setup

1. Node.js 20+ aur Git install hon. (`node -v`, `git --version`)
2. Repo clone karein:
   ```
   git clone https://github.com/owaisyosuf/baber-tyres-website.git
   cd baber-tyres-website
   npm install
   ```
3. **`.env.local` banayein.** Ye file GitHub par nahi hoti (secrets hain). Dusre computer ki
   `.env.local` ko **mehfooz tareeqe** se copy karein (USB ya password manager, GitHub/WhatsApp par
   nahi). Is mein ye naam hone chahiyein:
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`,
   `NEXT_PUBLIC_SITE_URL` (local par `http://localhost:3000`), `SANITY_API_READ_TOKEN`,
   `SANITY_API_WRITE_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SHOW_SAMPLE_DRAFTS=true`
   - `SANITY_REVALIDATE_SECRET` khali ho to value Vercel → Settings → Environment Variables se lein.
4. Chalayein: `npm run dev` → http://localhost:3000
5. Checks: `npx vitest run`, `npx eslint`, `npx tsc --noEmit`

Office PC ki kuch files git mein nahi hain: `stock.xlsx` (stock sheet), `RAPID PCR.xlsx`,
`RAPID 4X4.xlsx`, `ALL.png` (Rapid PCR photo), `.env.vercel.local`, `ss*.png` (screenshots, hata
sakte hain). `*.xlsx` gitignored hai.

---

## 3. Ab tak kya ho chuka (sab GitHub par push)

- **Phase A–D:** nav mein Home, "Direct Importer" trust strip, floating WhatsApp; category/service
  photos, 7 brand logos; sab pages par PageHero banner, naye Brands/About/Contact/Services pages;
  "How buying works"; search (size/brand/vehicle, suggestions, na mile to WhatsApp)
- `stock.xlsx` se 5 products Sanity mein; **2 published** (Rapid 195/65 R15, Rapid Ecoterra 265/65 R17)
- **Rapid PCR import (2026-10-03):** `RAPID PCR.xlsx` se **75 naye products published** (195/65 R15
  pehle se tha, price same). Ab Rapid PCR ke 76 products live hain.
  - Category: rim 13–17 → **Car** (51), rim 18–19 → **SUV / 4x4** (24). "SUV / 4x4" ek hi category
    rahegi (owner ka faisla).
  - Pattern: NIL → khali; P609/609 → `609`; P607 → `607`; 601, 606, ECO SPORT jaise hain.
  - Price: sirf **RETAIL PRICE**. Sab ki ek hi photo: `ALL.png`, magenta background hata kar
    1920×1280 transparent PNG.
  - IDs `product-rapid-<w>-<p>-r<rim>`, naam `Rapid 185/65 R15`, `createIfNotExists` se banaye.
  - Import script repo mein nahi (ek dafa ka kaam, scratchpad mein tha). Agli dafa yehi tareeqa:
    Excel → JSON → `next-sanity` client → pehle dry run, phir `transaction().createIfNotExists`.
- **Vercel deploy** ho gaya
- **Sanity CORS + webhook** set (2026-09-29). Test: Studio mein price badla → live par chand seconds
  mein badal gaya ✅
- **T035 browser verification** (`c54c81d`):
  - 21 pages 360 / 768 / 1024 / 1440px par, bina overflow ya JS error
  - Har WhatsApp link ka number aur message sahi
  - Filters, back/forward, cold load, mobile filter sheet, sticky bar aur search sab theek
  - Fix: 768px par header 18px bahar nikalta tha (header WhatsApp button ab `lg` se dikhta hai);
    logo aur breadcrumb links ab 44px touch target
  - iPhone 16 size (Chrome device mode) par owner ne check kiya, sab theek. **Asli iOS Safari par
    test nahi hua.** Chrome mode sirf screen size simulate karta hai, engine Chrome ka hi hota hai.
- **T037 security review** (`b96638b`):
  - Koi secret client JS mein nahi
  - Webhook bina/jaali signature par 401
  - Sab GROQ queries parameterized
  - Sanity public API se drafts nahi dikhte
  - Security headers lagaye: `frame-ancestors 'self'`, `X-Frame-Options`, `nosniff`,
    `Referrer-Policy`; `x-powered-by` band
  - **Soft 404** (`/tyres/abc` 200 deta hai) jaan boojh kar chhora: Cache Components mein shell 200
    ke saath stream hota hai, page par `noindex` lagta hai
  - `npm audit` ke 16 maslay sab Sanity CLI/build tools mein hain, runtime mein nahi. Fix = Sanity 5
    par downgrade (breaking), is liye nahi kiya. Sanity update aane par dobara dekhein.
- **T039 guide** (`a1a1f65`): `docs/studio-guide.md`, Roman Urdu (login, price, stock, naya tyre,
  naya brand, content rules)

---

## 4. Baqi kaam

| Task | Kya baqi hai |
|---|---|
| **T035** | Asli iPhone Safari par ek dafa filter, search, WhatsApp check (optional) |
| **◆ Checkpoint 2** | Owner poori site ko `specs/requirements.md` ke saath review kare |
| **T036** | Custom domain lagana, `www`/apex redirect. Phir Sanity CORS aur webhook URL naye domain par, aur Vercel mein `NEXT_PUBLIC_SITE_URL` |
| **T038** | Google Business Profile: naam, pata, phone site se bilkul milein; review link `siteSettings.googleReviewUrl` mein |
| **Rapid LT + 4x4** | Owner **nayi sheet** dega. `RAPID 4X4.xlsx` use **nahi** karni. Sheet aane par poochna: LT ki category, mud tyres Off-road ya SUV, pattern spellings (Effivan, Tuftrail?, X-Terrain?…), "THREE A" alag brand hai ya nahi, `155R13 C 8PLY` / `31x10.50 R15` jaise sizes, aur har pattern ki photo (`ALL.png` car tread hai, 4x4 par ghalat) |
| **T039** | Owner ki Gmail ko sanity.io/manage → Members mein **Editor** invite karna; owner guide se khud product add + price change kare |

Tasks status: T001–T035, T037 ✅ · T036 (domain baqi) · T038 · T039 (owner practice baqi)

**Content rule (price lists):** Owner ki Excel files mein dealers ki **NET price** wali sheets bhi hoti
hain (jaise "ZAFCOM ONLY", "SM TRADERS ONLY"). Ye kabhi site par nahi jayengi, sirf **RETAIL PRICE**.
