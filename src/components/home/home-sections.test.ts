import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const queries = vi.hoisted(() => ({
  getBrands: vi.fn(),
  getCategories: vi.fn(),
  getHomepageData: vi.fn(),
  getServices: vi.fn(),
}));
vi.mock("@/lib/sanity/queries", () => queries);

const shopSettings = vi.hoisted(() => ({ getShopSettings: vi.fn() }));
vi.mock("@/lib/sanity/settings", () => shopSettings);

let BrandStrip: typeof import("./BrandStrip").BrandStrip;
let CategoryGrid: typeof import("./CategoryGrid").CategoryGrid;
let LocationBlock: typeof import("./LocationBlock").LocationBlock;
let ServicesSummary: typeof import("./ServicesSummary").ServicesSummary;
let FeaturedProducts: typeof import("./FeaturedProducts").FeaturedProducts;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproj";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  ({ BrandStrip } = await import("./BrandStrip"));
  ({ CategoryGrid } = await import("./CategoryGrid"));
  ({ LocationBlock } = await import("./LocationBlock"));
  ({ ServicesSummary } = await import("./ServicesSummary"));
  ({ FeaturedProducts } = await import("./FeaturedProducts"));
});

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

const category = (slug: string, name: string, icon: string) => ({
  _id: `category-${slug}`,
  name,
  slug,
  icon,
});

const featured = {
  _id: "p1",
  name: "Dunlop SP",
  slug: "dunlop-sp",
  price: 18000,
  inStock: true,
  sizeLabelOverride: null,
  treadPattern: null,
  width: 195,
  profile: 65,
  rim: 15,
  images: [],
  brand: { name: "Dunlop", slug: "dunlop", relationship: "dealer" },
};

const render = async (component: () => Promise<React.ReactElement | null>) => {
  const element = await component();
  return element ? renderToStaticMarkup(element) : "";
};

describe("CategoryGrid", () => {
  const five = [
    category("car", "Car", "car"),
    category("suv", "SUV / 4x4", "suv"),
    category("truck", "Truck / Commercial", "truck"),
    category("lifter", "Lifter / Forklift", "forklift"),
    category("offroad", "Off-road", "offroad"),
  ];

  it("gives every category the same card and a link to its page", async () => {
    queries.getCategories.mockResolvedValue(five);
    const markup = await render(CategoryGrid);
    for (const { slug } of five) {
      expect(markup).toContain(`href="/categories/${slug}"`);
    }
    // One shared card class for all five: no category is styled as the main one.
    const cards = markup.match(/<div class="[^"]*flex-col items-center[^"]*"/g) ?? [];
    expect(cards).toHaveLength(5);
    expect(new Set(cards).size).toBe(1);
  });

  it("is left out when there are no categories or Sanity fails", async () => {
    queries.getCategories.mockResolvedValue([]);
    expect(await render(CategoryGrid)).toBe("");
    queries.getCategories.mockRejectedValue(new Error("down"));
    expect(await render(CategoryGrid)).toBe("");
  });
});

describe("FeaturedProducts", () => {
  it("shows the featured row with a link to the catalog", async () => {
    queries.getHomepageData.mockResolvedValue({ featuredProducts: [featured] });
    const markup = await render(FeaturedProducts);
    expect(markup).toContain("Featured tyres");
    expect(markup).toContain("Dunlop SP");
    expect(markup).toContain('href="/tyres"');
  });

  it("hides the whole section when nothing is flagged as featured", async () => {
    queries.getHomepageData.mockResolvedValue({ featuredProducts: [] });
    expect(await render(FeaturedProducts)).toBe("");
  });

  it("hides the section when Sanity fails", async () => {
    queries.getHomepageData.mockRejectedValue(new Error("down"));
    expect(await render(FeaturedProducts)).toBe("");
  });
});

const brand = (slug: string, name: string, relationship: string) => ({
  _id: `brand-${slug}`,
  name,
  slug,
  relationship,
  logo: null,
  description: null,
});

describe("BrandStrip", () => {
  it("shows importers before dealers, each linking to its brand page", async () => {
    // Sanity returns them ordered by relationship; the strip still groups them.
    queries.getBrands.mockResolvedValue([
      brand("dunlop", "Dunlop", "dealer"),
      brand("yokohama", "Yokohama", "importer"),
      brand("rapid", "Rapid", "stocked"),
    ]);
    const markup = await render(BrandStrip);
    expect(markup).toContain("20+ tyre brands");
    expect(markup).toContain('href="/brands/yokohama"');
    expect(markup).toContain('href="/brands/dunlop"');
    expect(markup.indexOf("Brands we import")).toBeLessThan(markup.indexOf("Brands we deal in"));
    expect(markup.indexOf("Brands we deal in")).toBeLessThan(markup.indexOf("Also in stock"));
    expect(markup).toContain("Importer");
    expect(markup).toContain("Dealer");
  });

  it("is left out entirely when no brand is published or Sanity fails", async () => {
    queries.getBrands.mockResolvedValue([]);
    expect(await render(BrandStrip)).toBe("");
    queries.getBrands.mockRejectedValue(new Error("down"));
    expect(await render(BrandStrip)).toBe("");
  });
});

describe("ServicesSummary", () => {
  it("lists each service and links to its section on /services", async () => {
    queries.getServices.mockResolvedValue([
      {
        _id: "s1",
        name: "Tyre Fitting",
        slug: "tyre-fitting",
        description: "Fitting at our shop.",
        icon: "fitting",
      },
    ]);
    const markup = await render(ServicesSummary);
    expect(markup).toContain("Tyre Fitting");
    expect(markup).toContain('href="/services#tyre-fitting"');
    expect(markup).toContain('href="/services"');
  });

  it("is left out when there are no services or Sanity fails", async () => {
    queries.getServices.mockResolvedValue([]);
    expect(await render(ServicesSummary)).toBe("");
    queries.getServices.mockRejectedValue(new Error("down"));
    expect(await render(ServicesSummary)).toBe("");
  });
});

describe("LocationBlock", () => {
  it("states delivery as chargeable and the Sunday closure, from the settings", async () => {
    const { resolveSettings } = await import("@/lib/settings");
    shopSettings.getShopSettings.mockResolvedValue(resolveSettings(null));
    const markup = await render(LocationBlock);
    expect(markup).toContain("charges apply");
    expect(markup).not.toMatch(/free delivery/i);
    expect(markup).toContain("Sunday");
    expect(markup).toContain("Closed");
    expect(markup).toContain("WhatsApp for delivery charges");
  });
});
