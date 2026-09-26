import { describe, expect, it } from "vitest";
import { EMPTY_RAW, filtersToRaw, rawToFilters } from "./raw";

describe("filtersToRaw / rawToFilters", () => {
  it("round-trips a full set of filters", () => {
    const filters = {
      brandSlugs: ["yokohama", "dunlop"],
      categorySlug: "truck",
      width: 185,
      profile: 65,
      rim: 22.5,
      minPrice: 5000,
      maxPrice: 40000,
    };
    expect(rawToFilters(filtersToRaw(filters))).toEqual(filters);
  });

  it("turns nothing into empty strings and back into no filters", () => {
    expect(filtersToRaw({})).toEqual(EMPTY_RAW);
    expect(rawToFilters(EMPTY_RAW)).toEqual({});
  });

  it("does not turn a half-typed or invalid value into a filter", () => {
    expect(rawToFilters({ ...EMPTY_RAW, min: "5" })).toEqual({ minPrice: 5 });
    for (const bad of ["abc", "5,000", "-5", "1e3", "5 0", "PKR 5000", "12.5"]) {
      expect(rawToFilters({ ...EMPTY_RAW, min: bad }), bad).toEqual({});
    }
  });

  it("re-validates through the same rules the server uses", () => {
    expect(rawToFilters({ ...EMPTY_RAW, width: "49" })).toEqual({});
    expect(rawToFilters({ ...EMPTY_RAW, category: "Bad Slug!" })).toEqual({});
    expect(rawToFilters({ ...EMPTY_RAW, brands: ["ok", '"] || true', "fine"] })).toEqual({
      brandSlugs: ["ok", "fine"],
    });
  });

  it("tidies typed text to what was accepted when passed back through the filters", () => {
    // What the panel does on blur or Enter, so junk does not linger in a box.
    const tidy = (raw: typeof EMPTY_RAW) => filtersToRaw(rawToFilters(raw));
    expect(tidy({ ...EMPTY_RAW, min: "abc" })).toEqual(EMPTY_RAW);
    expect(tidy({ ...EMPTY_RAW, min: "20000", max: "x" })).toEqual({ ...EMPTY_RAW, min: "20000" });
    expect(tidy({ ...EMPTY_RAW, brands: ["yokohama"], min: "20000" })).toEqual({
      ...EMPTY_RAW,
      brands: ["yokohama"],
      min: "20000",
    });
  });

  it("drops a contradictory price range", () => {
    expect(rawToFilters({ ...EMPTY_RAW, min: "9000", max: "100" })).toEqual({});
  });
});
