# Website update guide — Baber Tyres Corporation

Website ka saara content (tyres, rates, stock, brands) **Studio** se badalta hai. Aap jo bhi
**Publish** karenge, woh chand seconds mein live website par aa jayega. Kisi developer ki zaroorat
nahi.

**Studio ka link:** https://baber-tyres-website.vercel.app/studio
(Phone par bhi khulta hai, magar computer par kaam aasaan hai.)

---

## 0. Pehli dafa login

1. Upar wala link kholein.
2. **Google** chunein aur apni Gmail se login karein.
3. "No access" aaye to developer se kahein ke aap ki Gmail ko Sanity project mein **Editor** bana
   de (sanity.io/manage → Members → Invite).

Baayen taraf ye list nazar aayegi:

| Studio mein | Kya hai |
|---|---|
| Site Settings | Dukaan ka naam, pata, phone, timings |
| Products by Category | Tyres, gaari ki qism ke hisaab se (Car, SUV…) |
| All Products | Saare tyres ek list mein |
| Brands | Yokohama, Rapid, Dunlop… |
| Categories / Services | Gaari ki qismein aur dukaan ki services |

---

## 1. Rate (price) badalna

1. **All Products** kholein aur tyre chunein. (Upar search box mein naam ya size likh kar dhoond
   sakte hain.)
2. **Price (PKR)** mein naya rate likhein. Sirf number: `16700`. "Rs" ya comma na lagayein.
3. Neeche daayen kone mein **Publish** dabayein.
4. Website par tyre ka page refresh karein. Naya rate nazar aayega.

---

## 2. Stock khatam / wapas aana

1. Tyre kholein.
2. **In stock** ka switch **band** karein, to website par "Out of stock" likha aayega.
   Stock wapas aaye to switch **on** kar dein.
3. **Publish** dabayein.

Tyre website se hatana ho to **Delete** na karein. Pehle stock band kar dein, kyunke customer
phir bhi WhatsApp par pooch sakta hai.

---

## 3. Naya tyre add karna

1. **All Products** kholein, upar **+** (Create) dabayein.
2. Ye fields bharein:

| Field | Kya likhein | Misaal |
|---|---|---|
| **Name** | Brand + pattern + size | `Rapid P329 195/65 R15` |
| **Slug** | **Generate** dabayein, khud likhne ki zaroorat nahi | `rapid-p329-195-65-r15` |
| **Brand** | List se chunein | Rapid |
| **Category** | Gaari ki qism | Car |
| **Width (mm)** | Size ka pehla number | `195` |
| **Profile** | Doosra number | `65` |
| **Rim (inches)** | "R" ke baad wala number | `15` |
| **Size label override** | Sirf truck/forklift ke ajeeb sizes ke liye, warna **khali** | `11R22.5`, `6.50-10` |
| **Tread pattern** | Agar maloom ho, warna khali | `P329` |
| **Price (PKR)** | Sirf number | `16700` |
| **In stock** | On | |
| **Images** | Tyre ki photo upload karein | |
| **Alt text** (photo ke andar) | Photo mein kya hai | `Rapid P329 195/65 R15 tyre` |

3. **Publish** dabayein.

Photo aur alt text ke baghair tyre Publish nahi hoga. Studio laal nishan se bata dega ke kya baqi
hai. Photo baad mein milegi to tyre ko aise hi chhor dein. Woh **draft** rahega aur website par
nahi dikhega.

**Featured** on karne se tyre home page ki khaas row mein aata hai. Sirf 3–4 tyres par lagayein.

---

## 4. Naya brand add karna

1. **Brands → All Brands** kholein, **+** dabayein.
2. Fields:
   - **Name:** brand ka naam, jaise `Bridgestone`.
   - **Slug:** **Generate** dabayein.
   - **Logo:** brand ka logo upload karein (saaf, safed ya transparent background wala).
   - **Relationship:** sahi chunein, kyunke website par isi ka badge lagta hai:
     - **Importer:** yeh brand hum khud import karte hain.
     - **Dealer:** hum iske authorised dealer hain.
     - **Stocked:** sirf maal rakhte hain.
   - **Display order:** chhota number pehle dikhta hai (`1`, `2`…).
3. **Publish** dabayein. Phir is brand ke tyres add kar sakte hain.

---

## Zaroori baatein

- **Publish zaroor dabayein.** Sirf likhne se kuch live nahi hota, woh draft mein rehta hai.
- **Ghalti ho jaye:** document ke upar **History** (ghari ka nishan) se purana version wapas la
  sakte hain.
- **Sirf sach likhein.** Koi jhoota daawa, "free delivery", ya dusri website ki photo na lagayein.
  Delivery hamesha "charges apply" hai. Services sirf teen hain: fitting, computerized alignment,
  computerized balancing.
- **Site Settings** (phone, pata, timings) sirf zaroorat par badlein. Ye poori website par
  lagta hai.
- Publish ke baad bhi website purani dikhe to 1 minute ruk kar page refresh karein. Phir bhi na
  badle to developer ko batayein.
