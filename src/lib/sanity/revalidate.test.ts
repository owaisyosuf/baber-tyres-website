import { describe, expect, it } from "vitest";
import { tagsForDocument } from "./revalidate";

describe("tagsForDocument", () => {
  it("returns the list tag and the per-slug tag for slugged types", () => {
    expect(tagsForDocument({ _type: "product", slug: "bluearth-es32" })).toEqual(
      ["product", "product:bluearth-es32"],
    );
    expect(tagsForDocument({ _type: "brand", slug: "yokohama" })).toEqual([
      "brand",
      "brand:yokohama",
    ]);
    expect(tagsForDocument({ _type: "category", slug: "truck" })).toEqual([
      "category",
      "category:truck",
    ]);
  });

  it("returns only the list tag when a slugged type arrives without a slug", () => {
    expect(tagsForDocument({ _type: "product" })).toEqual(["product"]);
    expect(tagsForDocument({ _type: "brand", slug: null })).toEqual(["brand"]);
  });

  it("maps service and siteSettings to their tags, ignoring any slug", () => {
    expect(tagsForDocument({ _type: "service", slug: "fitting" })).toEqual([
      "service",
    ]);
    expect(tagsForDocument({ _type: "siteSettings" })).toEqual(["settings"]);
  });

  it("returns no tags for unknown or non-string types", () => {
    expect(tagsForDocument({ _type: "sanity.imageAsset" })).toEqual([]);
    expect(tagsForDocument({ _type: 42 })).toEqual([]);
    expect(tagsForDocument({})).toEqual([]);
  });

  it("does not match inherited object keys as document types", () => {
    expect(tagsForDocument({ _type: "constructor" })).toEqual([]);
    expect(tagsForDocument({ _type: "__proto__" })).toEqual([]);
    expect(tagsForDocument({ _type: "toString" })).toEqual([]);
  });

  it("drops slugs that are not plain slugs instead of building tags from them", () => {
    const hostile = [
      "",
      "a b",
      "../etc/passwd",
      "x:y",
      "a".repeat(201),
      { $ne: "x" },
      ["a"],
      123,
    ];
    for (const slug of hostile) {
      expect(tagsForDocument({ _type: "product", slug })).toEqual(["product"]);
    }
  });
});
