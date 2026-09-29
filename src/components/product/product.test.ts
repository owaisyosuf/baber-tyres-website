import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import type {
  PRODUCTS_QUERY_RESULT,
  RELATED_PRODUCTS_QUERY_RESULT,
} from "@/sanity/types";
import type { ProductCardProduct } from "./ProductCard";

// The Sanity client env is asserted at import; give it a value before loading
// anything that reaches it.
let BrandBadge: typeof import("./BrandBadge").BrandBadge;
let PriceTag: typeof import("./PriceTag").PriceTag;
let StockBadge: typeof import("./StockBadge").StockBadge;
let ProductCard: typeof import("./ProductCard").ProductCard;
let ProductGrid: typeof import("./ProductGrid").ProductGrid;
let sanityImageUrl: typeof import("@/lib/sanity/image").sanityImageUrl;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproj";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  ({ BrandBadge } = await import("./BrandBadge"));
  ({ PriceTag } = await import("./PriceTag"));
  ({ StockBadge } = await import("./StockBadge"));
  ({ ProductCard } = await import("./ProductCard"));
  ({ ProductGrid } = await import("./ProductGrid"));
  ({ sanityImageUrl } = await import("@/lib/sanity/image"));
});

const product = (overrides: Partial<ProductCardProduct> = {}): ProductCardProduct => ({
  name: "Yokohama BluEarth",
  slug: "yokohama-bluearth",
  price: 16500,
  inStock: true,
  sizeLabelOverride: null,
  width: 185,
  profile: 65,
  rim: 15,
  images: [],
  brand: { name: "Yokohama", relationship: "importer" },
  ...overrides,
});

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

/** Every <a>…</a> in the markup, as its own string. */
const anchors = (markup: string) => markup.match(/<a\b[\s\S]*?<\/a>/g) ?? [];

describe("query results fit the card", () => {
  it("accepts a catalog item and a related item without conversion", () => {
    const catalogItem = {} as PRODUCTS_QUERY_RESULT[number];
    const relatedItem = {} as RELATED_PRODUCTS_QUERY_RESULT[number];
    const a: ProductCardProduct = catalogItem;
    const b: ProductCardProduct = relatedItem;
    expect([a, b]).toHaveLength(2);
  });
});

describe("BrandBadge", () => {
  it("renders importer, dealer, and stocked as three distinct treatments", () => {
    const [importer, dealer, stocked] = (["importer", "dealer", "stocked"] as const).map(
      (relationship) => html(createElement(BrandBadge, { relationship })),
    );
    expect(importer).toContain("Importer");
    expect(dealer).toContain("Dealer");
    expect(stocked).toContain("Stocked");
    expect(new Set([importer, dealer, stocked]).size).toBe(3);
    // Importer is the solid amber fill; the other two are outlines.
    expect(importer).toContain("bg-accent");
    expect(dealer).not.toContain("bg-accent");
    expect(dealer).toContain("border-accent");
    expect(stocked).toContain("border-border-strong");
  });
});

describe("StockBadge", () => {
  it("states the stock status in words, not colour alone", () => {
    expect(html(createElement(StockBadge, { inStock: true }))).toContain("In stock");
    expect(html(createElement(StockBadge, { inStock: false }))).toContain("Out of stock");
  });
});

describe("PriceTag", () => {
  it("formats in PKR with tabular numerals", () => {
    const markup = html(createElement(PriceTag, { price: 16500 }));
    expect(markup).toContain("PKR 16,500");
    expect(markup).toContain("tabular");
  });

  it("recedes when muted", () => {
    expect(html(createElement(PriceTag, { price: 100, muted: true }))).toContain("text-muted");
    expect(html(createElement(PriceTag, { price: 100 }))).toContain("text-accent");
  });

  it("does not throw on a non-finite price from the CMS", () => {
    expect(() => html(createElement(PriceTag, { price: Number.NaN }))).not.toThrow();
    expect(html(createElement(PriceTag, { price: Number.NaN }))).toContain("Ask us for the price");
  });
});

describe("ProductCard", () => {
  it("shows brand, badge, name, size, price, and stock", () => {
    const markup = html(createElement(ProductCard, { product: product() }));
    expect(markup).toContain("Yokohama BluEarth");
    expect(markup).toContain("Importer");
    expect(markup).toContain("185/65 R15");
    expect(markup).toContain("PKR 16,500");
    expect(markup).toContain("In stock");
  });

  it("shows the tread pattern when one is entered", () => {
    const markup = html(
      createElement(ProductCard, { product: product({ treadPattern: "V553" }) }),
    );
    expect(markup).toContain("Pattern");
    expect(markup).toContain("V553");
  });

  it("shows no pattern line when the pattern is missing or blank", () => {
    for (const treadPattern of [undefined, null, "", "   "]) {
      const markup = html(createElement(ProductCard, { product: product({ treadPattern }) }));
      expect(markup).not.toContain("Pattern");
    }
  });

  it("shows a commercial size through sizeLabelOverride", () => {
    const markup = html(
      createElement(ProductCard, {
        product: product({ width: 295, profile: 80, rim: 22.5, sizeLabelOverride: "11R22.5" }),
      }),
    );
    expect(markup).toContain("11R22.5");
    expect(markup).not.toContain("295/80");
  });

  it("links to the product page from the title", () => {
    const [link] = anchors(html(createElement(ProductCard, { product: product() })));
    expect(link).toContain('href="/tyres/yokohama-bluearth"');
    expect(link).toContain("Yokohama BluEarth");
  });

  it("keeps the WhatsApp control out of the card link (no nested anchors)", () => {
    const found = anchors(html(createElement(ProductCard, { product: product() })));
    expect(found).toHaveLength(2);
    for (const anchor of found) {
      expect(anchor.slice(2).includes("<a ")).toBe(false);
    }
    expect(found[1]).toContain("https://wa.me/");
  });

  it("pre-fills the WhatsApp message with the product name and size", () => {
    const [, wa] = anchors(html(createElement(ProductCard, { product: product() })));
    const text = decodeURIComponent(/text=([^"]*)"/.exec(wa)![1]);
    expect(text).toContain("Yokohama BluEarth");
    expect(text).toContain("185/65 R15");
  });

  it("names the WhatsApp control after the product, so a list of cards is distinguishable", () => {
    const [, wa] = anchors(html(createElement(ProductCard, { product: product() })));
    expect(wa).toContain('aria-label="Ask about Yokohama BluEarth on WhatsApp"');
  });

  it("keeps an out-of-stock product listed with its inquiry action", () => {
    const markup = html(createElement(ProductCard, { product: product({ inStock: false }) }));
    expect(markup).toContain("Out of stock");
    expect(markup).toContain("message us");
    expect(anchors(markup)).toHaveLength(2);
    expect(markup).toContain("https://wa.me/");
  });

  it("treats a product that never set stock as in stock, matching the Studio default", () => {
    expect(html(createElement(ProductCard, { product: product({ inStock: null }) }))).toContain(
      "In stock",
    );
  });

  it("falls back to the brand name as a typographic mark when there is no photo", () => {
    const markup = html(createElement(ProductCard, { product: product({ images: [] }) }));
    expect(markup).not.toContain("<img");
    expect(markup).toContain("aria-hidden");
  });

  it("uses the heading level it is given", () => {
    expect(html(createElement(ProductCard, { product: product(), headingLevel: "h2" }))).toContain(
      "<h2",
    );
    expect(html(createElement(ProductCard, { product: product() }))).toContain("<h3");
  });
});

describe("ProductGrid", () => {
  it("renders one list item per product with an explicit list role", () => {
    const markup = html(
      createElement(ProductGrid, {
        products: [
          { ...product(), _id: "a" },
          { ...product({ name: "Second", slug: "second" }), _id: "b" },
        ],
      }),
    );
    expect(markup).toContain('role="list"');
    expect(markup.match(/<li\b/g)).toHaveLength(2);
  });
});

describe("sanityImageUrl", () => {
  it("builds a cropped, auto-format URL on the Sanity CDN", () => {
    const url = sanityImageUrl(
      { asset: { _ref: "image-abc123def456-1200x900-jpg" } },
      640,
      480,
    );
    expect(url).toContain("https://cdn.sanity.io/images/testproj/production/");
    expect(url).toContain("abc123def456-1200x900.jpg");
    expect(url).toContain("w=640");
    expect(url).toContain("h=480");
    expect(url).toContain("fit=crop");
    expect(url).toContain("auto=format");
  });

  it("keeps the whole image for logos with fit=max", () => {
    const url = sanityImageUrl({ asset: { _ref: "image-abc123def456-1600x431-png" } }, 240, 120, "max");
    expect(url).toContain("fit=max");
    expect(url).not.toContain("fit=crop");
    expect(url).not.toContain("rect=");
  });

  it("returns null when the image has no asset", () => {
    expect(sanityImageUrl({ asset: null }, 640, 480)).toBeNull();
  });
});
