import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * T009 acceptance criteria, enforced as checks instead of convention. These
 * read queries.ts as text — importing it would pull in next/cache and the
 * env-validated Sanity client, neither of which exist in a plain test run.
 */
const source = readFileSync(path.join(__dirname, "queries.ts"), "utf-8");

const groqLiterals = [...source.matchAll(/defineQuery\(`([\s\S]*?)`\)/g)].map(
  (m) => m[1],
);

const fetchFunctions = source
  .split("export async function ")
  .slice(1)
  .map((block) => ({
    name: block.slice(0, block.indexOf("(")),
    body: block,
  }));

describe("GROQ queries", () => {
  it("finds every query and fetch wrapper", () => {
    expect(groqLiterals).toHaveLength(12);
    expect(fetchFunctions.map((f) => f.name)).toEqual([
      "getHomepageData",
      "getProducts",
      "getProductBySlug",
      "getRelatedProducts",
      "getBrands",
      "getBrandBySlug",
      "getCategories",
      "getCategoryBySlug",
      "getServices",
      "getSettings",
      "getSitemapData",
    ]);
  });

  it("never string-interpolates into a query (values arrive as $params only)", () => {
    for (const literal of groqLiterals) {
      expect(literal, literal.slice(0, 60)).not.toContain("${");
    }
  });

  it("parameterises every user-supplied filter value", () => {
    const products = groqLiterals.find((q) => q.includes("$brandSlugs"))!;
    for (const param of [
      "$brandSlugs",
      "$categorySlug",
      "$width",
      "$profile",
      "$rim",
      "$minPrice",
      "$maxPrice",
    ]) {
      expect(products).toContain(param);
    }
  });
});

describe("cache tags (design.md §4 route map)", () => {
  it("every fetch wrapper is a cached function with a tag and a lifetime", () => {
    for (const fn of fetchFunctions) {
      expect(fn.body, fn.name).toContain('"use cache"');
      expect(fn.body, fn.name).toMatch(/cacheTag\(/);
      expect(fn.body, fn.name).toContain('cacheLife("max")');
    }
  });

  const required: Record<string, string[]> = {
    getHomepageData: ["home", "brand", "service", "settings"],
    getProducts: ["product", "brand", "category"],
    getProductBySlug: ["`product:${slug}`"],
    getBrands: ["brand"],
    getBrandBySlug: ["`brand:${slug}`", '"product"'],
    getCategoryBySlug: ["`category:${slug}`", '"product"'],
    getServices: ["service"],
    getSettings: ["settings"],
  };

  for (const [name, tags] of Object.entries(required)) {
    it(`${name} carries its route-map tags`, () => {
      const fn = fetchFunctions.find((f) => f.name === name)!;
      const tagCall = fn.body.match(/cacheTag\(([^)]*)\)/)![1];
      for (const tag of tags) {
        expect(tagCall).toContain(tag.replace(/"/g, ""));
      }
    });
  }
});
