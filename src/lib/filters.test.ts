import { describe, expect, it } from "vitest";
import {
  buildCatalogQuery,
  countActiveFilters,
  parseCatalogSearchParams,
} from "./filters";

const CONTRACT =
  "brand=yokohama,dunlop&category=truck&width=185&profile=65&rim=15&min=5000&max=40000&page=2";

const parse = (query: string) => parseCatalogSearchParams(new URLSearchParams(query));
const parseObject = (input: Record<string, string | string[] | undefined>) =>
  parseCatalogSearchParams(input);

describe("the catalog URL contract (design.md §4)", () => {
  it("parses every filter from the documented example", () => {
    expect(parse(CONTRACT)).toEqual({
      filters: {
        brandSlugs: ["yokohama", "dunlop"],
        categorySlug: "truck",
        width: 185,
        profile: 65,
        rim: 15,
        minPrice: 5000,
        maxPrice: 40000,
      },
      page: 2,
    });
  });

  it("round-trips the documented example exactly", () => {
    const { filters, page } = parse(CONTRACT);
    expect(buildCatalogQuery(filters, page)).toBe(CONTRACT);
  });

  it("round-trips any canonical query, including decimals and partial filters", () => {
    for (const query of [
      "",
      "brand=michelin",
      "category=offroad",
      "width=295&profile=80&rim=22.5",
      "min=1000",
      "max=90000&page=3",
      "brand=rapid,duhow,armstrong&rim=19.5",
    ]) {
      const { filters, page } = parse(query);
      expect(buildCatalogQuery(filters, page), query).toBe(query);
    }
  });

  it("builds parse(build(x)) back to the same filters", () => {
    const filters = {
      brandSlugs: ["yokohama"],
      categorySlug: "car",
      width: 185,
      rim: 15,
      minPrice: 0,
    };
    expect(parse(buildCatalogQuery(filters, 4))).toEqual({ filters, page: 4 });
  });

  it("leaves page 1 out of the canonical URL", () => {
    expect(buildCatalogQuery({ categorySlug: "car" }, 1)).toBe("category=car");
  });

  it("accepts a Next.js searchParams object as well as URLSearchParams", () => {
    expect(parseObject({ brand: "yokohama,dunlop", width: "185", page: "2" })).toEqual({
      filters: { brandSlugs: ["yokohama", "dunlop"], width: 185 },
      page: 2,
    });
  });
});

describe("parseCatalogSearchParams — defaults and normalisation", () => {
  it("returns no filters and page 1 for an empty query", () => {
    expect(parse("")).toEqual({ filters: {}, page: 1 });
    expect(parseObject({})).toEqual({ filters: {}, page: 1 });
  });

  it("ignores params it does not know", () => {
    expect(parse("utm_source=x&sort=price&foo=bar&width=185")).toEqual({
      filters: { width: 185 },
      page: 1,
    });
  });

  it("merges repeated brand params with comma lists and removes duplicates", () => {
    expect(parse("brand=yokohama,dunlop&brand=dunlop&brand=rapid").filters.brandSlugs).toEqual([
      "yokohama",
      "dunlop",
      "rapid",
    ]);
  });

  it("lower-cases slugs and trims whitespace", () => {
    expect(parse("brand=Yokohama, Dunlop&category=%20Truck%20").filters).toEqual({
      brandSlugs: ["yokohama", "dunlop"],
      categorySlug: "truck",
    });
  });

  it("keeps the first value of a repeated single-value param", () => {
    expect(parseObject({ width: ["185", "195"] }).filters.width).toBe(185);
    expect(parse("category=car&category=truck").filters.categorySlug).toBe("car");
  });

  it("accepts a rim with one decimal and rejects more precision", () => {
    expect(parse("rim=22.5").filters.rim).toBe(22.5);
    expect(parse("rim=22.55").filters.rim).toBeUndefined();
  });
});

describe("parseCatalogSearchParams — malformed values are dropped, alone", () => {
  it("drops a bad value without discarding the good ones beside it", () => {
    expect(parse("brand=yokohama&width=abc&rim=15&category=!!").filters).toEqual({
      brandSlugs: ["yokohama"],
      rim: 15,
    });
  });

  it("drops the bad entries inside a brand list and keeps the rest", () => {
    expect(parse("brand=yokohama,,bad slug,dunlop,%27").filters.brandSlugs).toEqual([
      "yokohama",
      "dunlop",
    ]);
  });

  it("rejects numbers that are not plain non-negative integers", () => {
    for (const bad of ["-185", "18.5", "1e3", "0x10", "185abc", "1 85", "+185", "", " ", "NaN", "Infinity", "-Infinity", "0185"]) {
      expect(parse(`width=${encodeURIComponent(bad)}`).filters.width, JSON.stringify(bad)).toBeUndefined();
    }
  });

  it("rejects values outside the plausible range", () => {
    expect(parse("width=49").filters.width).toBeUndefined();
    expect(parse("width=1001").filters.width).toBeUndefined();
    expect(parse("profile=10").filters.profile).toBeUndefined();
    expect(parse("profile=121").filters.profile).toBeUndefined();
    expect(parse("rim=7").filters.rim).toBeUndefined();
    expect(parse("rim=31").filters.rim).toBeUndefined();
    expect(parse("max=10000001").filters.maxPrice).toBeUndefined();
    expect(parse("width=50").filters.width).toBe(50);
    expect(parse("width=1000").filters.width).toBe(1000);
  });

  it("ignores a price range that contradicts itself", () => {
    expect(parse("min=50000&max=1000").filters).toEqual({});
    expect(parse("min=1000&max=1000").filters).toEqual({ minPrice: 1000, maxPrice: 1000 });
  });

  it("falls back to page 1 for a bad page and caps a huge one", () => {
    for (const bad of ["0", "-1", "abc", "1.5", "1e2", "1001", "99999999999999999999"]) {
      expect(parse(`page=${bad}`).page, bad).toBe(1);
    }
    expect(parse("page=1000").page).toBe(1000);
  });

  it("limits how many brands can be requested", () => {
    const many = Array.from({ length: 50 }, (_, i) => `brand-${i}`).join(",");
    expect(parse(`brand=${many}`).filters.brandSlugs).toHaveLength(20);
  });
});

describe("parseCatalogSearchParams — hostile input never survives", () => {
  const attacks = [
    `"] || true || *[_type == "siteSettings`,
    `yokohama" || _type == "brand`,
    `*[_type == "product"]`,
    `$brandSlugs`,
    `a'; DROP TABLE products; --`,
    `<script>alert(1)</script>`,
    `%00null`,
    "\u0000",
    "../../etc/passwd",
    "javascript:alert(1)",
    "${process.env.SANITY_API_WRITE_TOKEN}",
    "{{7*7}}",
    "yokohama\ndunlop",
    "brand-‮evil",
    "ｙｏｋｏｈａｍａ",
    "a".repeat(5000),
    "-".repeat(70),
    "_a",
    "a_",
  ];

  it("drops every attack string used as a brand or category", () => {
    for (const attack of attacks) {
      const brand = parseObject({ brand: attack });
      const category = parseObject({ category: attack });
      expect(brand.filters.brandSlugs, JSON.stringify(attack.slice(0, 40))).toBeUndefined();
      expect(category.filters.categorySlug, JSON.stringify(attack.slice(0, 40))).toBeUndefined();
    }
  });

  it("drops every attack string used as a number", () => {
    for (const attack of attacks) {
      const parsed = parseObject({
        width: attack,
        profile: attack,
        rim: attack,
        min: attack,
        max: attack,
        page: attack,
      });
      expect(parsed, JSON.stringify(attack.slice(0, 40))).toEqual({ filters: {}, page: 1 });
    }
  });

  it("does not let prototype keys or unusual param names leak through", () => {
    const parsed = parse("__proto__=x&constructor=y&toString=z&hasOwnProperty=1&width=185");
    expect(parsed).toEqual({ filters: { width: 185 }, page: 1 });
    expect(({} as Record<string, unknown>).width).toBeUndefined();

    const fromObject = parseObject(
      JSON.parse('{"__proto__":{"width":"185"},"constructor":"x","width":"195"}'),
    );
    expect(fromObject.filters).toEqual({ width: 195 });
  });

  it("handles non-string values in a searchParams object", () => {
    const weird = {
      brand: [undefined, 5, null, { a: 1 }, "yokohama"],
      width: 185,
      rim: { nested: "15" },
    } as unknown as Record<string, string | string[] | undefined>;
    expect(parseObject(weird)).toEqual({ filters: { brandSlugs: ["yokohama"] }, page: 1 });
  });

  it("only ever emits validated slugs and bounded numbers, whatever it is given (fuzz)", () => {
    // Deterministic pseudo-random input so a failure is reproducible.
    let seed = 20260926;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const alphabet = `abcXYZ019 -_.,;:'"\`\\/<>{}[]()*$|&=%+~!?@#\n\t\u0000é‮`;
    const junk = () =>
      Array.from({ length: Math.floor(random() * 24) }, () =>
        alphabet[Math.floor(random() * alphabet.length)],
      ).join("");

    for (let i = 0; i < 2000; i++) {
      const { filters, page } = parseObject({
        brand: junk(),
        category: junk(),
        width: junk(),
        profile: junk(),
        rim: junk(),
        min: junk(),
        max: junk(),
        page: junk(),
      });

      for (const value of [...(filters.brandSlugs ?? []), filters.categorySlug]) {
        if (value !== undefined) expect(value).toMatch(/^[a-z0-9](?:[a-z0-9_-]{0,58}[a-z0-9])?$/);
      }
      for (const value of [filters.width, filters.profile, filters.rim, filters.minPrice, filters.maxPrice]) {
        if (value !== undefined) {
          expect(Number.isFinite(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(10_000_000);
        }
      }
      expect(Number.isInteger(page) && page >= 1 && page <= 1000).toBe(true);

      // What it built must be safe to put back in a URL untouched.
      expect(buildCatalogQuery(filters, page)).toMatch(/^[a-z0-9_,.=&-]*$/);
    }
  });
});

describe("countActiveFilters", () => {
  it("counts each brand, each other filter, and a price range once", () => {
    expect(countActiveFilters({})).toBe(0);
    expect(
      countActiveFilters({
        brandSlugs: ["a", "b"],
        categorySlug: "truck",
        width: 185,
        profile: 65,
        rim: 15,
        minPrice: 1,
        maxPrice: 2,
      }),
    ).toBe(7);
    expect(countActiveFilters({ maxPrice: 100 })).toBe(1);
  });
});
