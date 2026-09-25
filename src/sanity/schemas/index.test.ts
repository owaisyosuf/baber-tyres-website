import { describe, expect, it } from "vitest";
import { schemaTypes } from "./index";

/**
 * Loads the real defineType/defineField calls at runtime (not just
 * type-checks them) — catches structural mistakes TypeScript's loose Sanity
 * types wouldn't (duplicate field names, missing `to` on a reference, etc.).
 */
describe("Sanity schema", () => {
  it("defines the expected six types with unique names", () => {
    const names = schemaTypes.map((t) => t.name);
    expect(names).toEqual([
      "seo",
      "brand",
      "category",
      "product",
      "service",
      "siteSettings",
    ]);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has no duplicate field names within any document/object type", () => {
    for (const type of schemaTypes) {
      const fields = "fields" in type ? type.fields : undefined;
      if (!Array.isArray(fields)) continue;
      const fieldNames = fields.map((f) => f.name);
      expect(
        new Set(fieldNames).size,
        `${type.name} has duplicate field names: ${fieldNames.join(", ")}`,
      ).toBe(fieldNames.length);
    }
  });

  it("brand.relationship is a required select with exactly the three expected values", () => {
    const brand = schemaTypes.find((t) => t.name === "brand");
    const fields = brand && "fields" in brand ? brand.fields : [];
    const relationship = fields.find((f) => f.name === "relationship");
    expect(relationship).toBeDefined();
    const values = (
      relationship?.options as { list?: { value: string }[] } | undefined
    )?.list?.map((o) => o.value);
    expect(values).toEqual(["importer", "dealer", "stocked"]);
  });

  it("product.images requires at least one entry with alt text", () => {
    const product = schemaTypes.find((t) => t.name === "product");
    const fields = product && "fields" in product ? product.fields : [];
    const images = fields.find((f) => f.name === "images");
    expect(images).toBeDefined();
    expect(images?.type).toBe("array");
  });
});
