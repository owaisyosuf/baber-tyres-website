import { describe, expect, it } from "vitest";
import { activeFilterChips } from "./filter-chips";
import { parseCatalogSearchParams } from "./filters";

const labels = {
  brands: [
    { slug: "yokohama", name: "Yokohama" },
    { slug: "dunlop", name: "Dunlop" },
  ],
  categories: [{ slug: "truck", name: "Truck / Commercial" }],
};

const chipsFor = (query: string) =>
  activeFilterChips(parseCatalogSearchParams(new URLSearchParams(query)).filters, labels);

describe("activeFilterChips", () => {
  it("returns no chips when nothing is filtered", () => {
    expect(chipsFor("")).toEqual([]);
  });

  it("makes one chip per brand, using the brand's display name", () => {
    const chips = chipsFor("brand=yokohama,dunlop");
    expect(chips.map((chip) => chip.label)).toEqual(["Yokohama", "Dunlop"]);
    expect(chips.map((chip) => chip.key)).toEqual(["brand:yokohama", "brand:dunlop"]);
  });

  it("each chip links to the URL with only that filter removed", () => {
    const chips = chipsFor("brand=yokohama,dunlop&category=truck&width=185&rim=15");
    const byKey = Object.fromEntries(chips.map((chip) => [chip.key, chip.href]));
    expect(byKey["brand:yokohama"]).toBe("/tyres?brand=dunlop&category=truck&width=185&rim=15");
    expect(byKey["brand:dunlop"]).toBe("/tyres?brand=yokohama&category=truck&width=185&rim=15");
    expect(byKey.category).toBe("/tyres?brand=yokohama,dunlop&width=185&rim=15");
    expect(byKey.width).toBe("/tyres?brand=yokohama,dunlop&category=truck&rim=15");
    expect(byKey.rim).toBe("/tyres?brand=yokohama,dunlop&category=truck&width=185");
  });

  it("removing the last filter links back to the plain catalog", () => {
    expect(chipsFor("category=truck")[0].href).toBe("/tyres");
    expect(chipsFor("brand=yokohama")[0].href).toBe("/tyres");
  });

  it("removing a filter resets pagination", () => {
    expect(chipsFor("category=truck&width=185&page=3")[0].href).toBe("/tyres?width=185");
  });

  it("shows size filters separately and labels them plainly", () => {
    expect(chipsFor("width=185&profile=65&rim=22.5").map((chip) => chip.label)).toEqual([
      "Width 185",
      "Profile 65",
      "Rim 22.5",
    ]);
  });

  it("collapses a price range into a single chip that removes both ends", () => {
    const price = chipsFor("min=5000&max=40000&width=185").find((chip) => chip.key === "price")!;
    expect(price.label).toBe("PKR 5,000 – 40,000");
    expect(price.href).toBe("/tyres?width=185");
  });

  it("words a one-sided price range as From / Up to", () => {
    expect(chipsFor("min=5000")[0].label).toBe("From PKR 5,000");
    expect(chipsFor("max=40000")[0].label).toBe("Up to PKR 40,000");
  });

  it("falls back to the slug for a brand or category it has no name for", () => {
    const chips = chipsFor("brand=unknown-brand&category=unknown-cat");
    expect(chips.map((chip) => chip.label)).toEqual(["unknown-brand", "unknown-cat"]);
  });
});
