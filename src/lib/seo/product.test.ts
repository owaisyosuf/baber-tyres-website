import { describe, expect, it } from "vitest";
import { buildProductJsonLd, type ProductJsonLdInput } from "./product";
import { serializeJsonLd } from "./jsonLd";

const URL = "https://example.test";

const product = (overrides: Partial<ProductJsonLdInput> = {}): ProductJsonLdInput => ({
  name: "Yokohama BluEarth 185/65 R15",
  slug: "yokohama-bluearth",
  price: 16500,
  inStock: true,
  description: null,
  images: [],
  brand: { name: "Yokohama" },
  category: { name: "Car" },
  ...overrides,
});

const build = (overrides: Partial<ProductJsonLdInput> = {}) =>
  buildProductJsonLd(product(overrides), URL);

describe("buildProductJsonLd", () => {
  it("describes the product from its own data", () => {
    const data = build();
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Product");
    expect(data.name).toBe("Yokohama BluEarth 185/65 R15");
    expect(data.url).toBe(`${URL}/tyres/yokohama-bluearth`);
    expect(data.sku).toBe("yokohama-bluearth");
    expect(data.brand).toEqual({ "@type": "Brand", name: "Yokohama" });
    expect(data.category).toBe("Car");
  });

  it("prices the offer in PKR and links its canonical URL", () => {
    const offers = build().offers;
    expect(offers).toEqual({
      "@type": "Offer",
      url: `${URL}/tyres/yokohama-bluearth`,
      priceCurrency: "PKR",
      price: 16500,
      availability: "https://schema.org/InStock",
    });
  });

  it("states OutOfStock availability when the product is out of stock", () => {
    expect(build({ inStock: false }).offers.availability).toBe(
      "https://schema.org/OutOfStock",
    );
  });

  it("treats a product that never set stock as in stock, matching the Studio default", () => {
    expect(build({ inStock: null }).offers.availability).toBe("https://schema.org/InStock");
  });

  it("omits image when the product has none, and includes it in order when it does", () => {
    expect(build()).not.toHaveProperty("image");
    const withImages = build({ images: ["https://cdn.sanity.io/a.jpg", "https://cdn.sanity.io/b.jpg"] });
    expect(withImages.image).toEqual([
      "https://cdn.sanity.io/a.jpg",
      "https://cdn.sanity.io/b.jpg",
    ]);
  });

  it("omits description when blank, includes it trimmed when present", () => {
    expect(build()).not.toHaveProperty("description");
    expect(build({ description: "  A good all-rounder.  " }).description).toBe(
      "A good all-rounder.",
    );
  });

  it("omits brand and category when the reference is missing", () => {
    const data = build({ brand: null, category: null });
    expect(data).not.toHaveProperty("brand");
    expect(data).not.toHaveProperty("category");
  });

  it("claims nothing the product has not confirmed", () => {
    const data = build();
    for (const key of ["aggregateRating", "review", "sameAs"]) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it("serialises without any undefined values", () => {
    expect(JSON.stringify(build())).not.toContain("undefined");
  });
});

describe("serializeJsonLd with a product", () => {
  it("escapes a value that could close the script tag", () => {
    const out = serializeJsonLd(build({ name: "</script><script>alert(1)</script>" }));
    expect(out).not.toContain("<script>alert");
  });
});
