import { describe, expect, it } from "vitest";
import { parseCatalogSearchParams } from "./filters";
import { STANDARD_TYRE_SIZES } from "./tyre-sizes";

describe("STANDARD_TYRE_SIZES", () => {
  it("lists real metric widths only (ending in 5), from 135 to 335", () => {
    const { widths } = STANDARD_TYRE_SIZES;
    expect(widths[0]).toBe(135);
    expect(widths.at(-1)).toBe(335);
    expect(widths.every((width) => width % 10 === 5)).toBe(true);
    expect(widths).not.toContain(178);
  });

  it("lists profiles in steps of 5 and rims including commercial half sizes, ascending", () => {
    expect(STANDARD_TYRE_SIZES.profiles).toEqual([25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85]);
    expect(STANDARD_TYRE_SIZES.rims).toEqual([
      12, 13, 14, 15, 16, 17, 17.5, 18, 19, 19.5, 20, 21, 22, 22.5, 23, 24,
    ]);
  });

  it("only offers values the catalog accepts as filters", () => {
    const { widths, profiles, rims } = STANDARD_TYRE_SIZES;
    for (const width of widths) {
      expect(parseCatalogSearchParams({ width: String(width) }).filters.width).toBe(width);
    }
    for (const profile of profiles) {
      expect(parseCatalogSearchParams({ profile: String(profile) }).filters.profile).toBe(profile);
    }
    for (const rim of rims) {
      expect(parseCatalogSearchParams({ rim: String(rim) }).filters.rim).toBe(rim);
    }
  });
});
