import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const queries = vi.hoisted(() => ({
  getCategories: vi.fn(),
  getHomepageData: vi.fn(),
}));
vi.mock("@/lib/sanity/queries", () => queries);

let CategoryGrid: typeof import("./CategoryGrid").CategoryGrid;
let FeaturedProducts: typeof import("./FeaturedProducts").FeaturedProducts;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproj";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  ({ CategoryGrid } = await import("./CategoryGrid"));
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
