import { describe, expect, it } from "vitest";
import { buildSuggestions, prefixMatchText } from "./search-suggest";

const brands = [
  { name: "Yokohama", slug: "yokohama" },
  { name: "General", slug: "general" },
];
const categories = [
  { name: "Truck / Commercial", slug: "truck" },
  { name: "Lifter / Forklift", slug: "lifter" },
];
const product = {
  name: "Yokohama BluEarth ES32",
  slug: "yokohama-es32",
  width: 185,
  profile: 65,
  rim: 15,
  sizeLabelOverride: null,
  brand: { name: "Yokohama" },
};

const build = (overrides: Partial<Parameters<typeof buildSuggestions>[0]>) =>
  buildSuggestions({ text: "", resolved: {}, brands, categories, products: [], total: 0, ...overrides });

describe("buildSuggestions", () => {
  it("puts a typed size first, linking to that size in the catalog", () => {
    const [first] = build({ text: "185/65 R15", resolved: { width: 185, profile: 65, rim: 15 } });
    expect(first).toEqual({
      kind: "size",
      label: "185/65 R15",
      detail: "Tyre size",
      href: "/tyres?width=185&profile=65&rim=15",
    });
  });

  it("suggests brands and vehicle types from the first letters of a word", () => {
    expect(build({ text: "yok" }).map((s) => s.label)).toEqual(["Yokohama"]);
    expect(build({ text: "fork" })).toEqual([
      { kind: "category", label: "Lifter / Forklift", detail: "Vehicle", href: "/categories/lifter" },
    ]);
  });

  it("waits for two letters before suggesting names", () => {
    expect(build({ text: "y" })).toEqual([]);
  });

  it("lists products with their size and links each to its page", () => {
    const suggestions = build({ text: "bluearth", products: [product], total: 1 });
    expect(suggestions).toEqual([
      { kind: "product", label: product.name, detail: "185/65 R15", href: "/tyres/yokohama-es32" },
    ]);
  });

  it("adds a see-all row only when there are more results than shown", () => {
    const suggestions = build({ text: "tyre", products: [product], total: 12 });
    expect(suggestions.at(-1)).toEqual({
      kind: "all",
      label: "See all 12 results",
      detail: "",
      href: "/tyres?q=tyre",
    });
  });

  it("returns nothing when nothing matches, leaving the WhatsApp row to the UI", () => {
    expect(build({ text: "zzzz" })).toEqual([]);
  });
});

describe("prefixMatchText", () => {
  it("turns each word into a prefix match", () => {
    expect(prefixMatchText("bluea es3")).toBe("bluea* es3*");
  });
});
