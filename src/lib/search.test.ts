import { describe, expect, it } from "vitest";
import { cleanSearchText, parseCatalogSearchParams } from "./filters";
import { resolveSearchText } from "./search";

const brands = [
  { name: "Yokohama", slug: "yokohama" },
  { name: "General", slug: "general" },
  { name: "Michelin", slug: "michelin" },
];
const categories = [
  { name: "Car", slug: "car" },
  { name: "SUV / 4x4", slug: "suv" },
  { name: "Truck / Commercial", slug: "truck" },
  { name: "Lifter / Forklift", slug: "lifter" },
];

const resolve = (text: string) =>
  resolveSearchText(parseCatalogSearchParams({ q: text }).filters, brands, categories);

describe("resolveSearchText", () => {
  it.each([
    "185/65R15",
    "185/65 R15",
    "185/65ZR15",
    "185 65 15",
    "185/65/15",
    "185.65R15",
    "185.65.15",
    "  185 / 65 r15 ",
  ])("reads %s as a metric size", (text) => {
    expect(resolve(text)).toEqual({ width: 185, profile: 65, rim: 15 });
  });

  it("keeps a half-inch rim", () => {
    expect(resolve("295/80R22.5")).toEqual({ width: 295, profile: 80, rim: 22.5 });
  });

  it("turns brand and category names into filters, whatever the case", () => {
    expect(resolve("YOKOHAMA truck tyres")).toEqual({
      brandSlugs: ["yokohama"],
      categorySlug: "truck",
    });
    expect(resolve("forklift")).toEqual({ categorySlug: "lifter" });
  });

  it("combines a brand with a size and leaves the rest as text", () => {
    expect(resolve("michelin 205/55 R16 primacy")).toEqual({
      brandSlugs: ["michelin"],
      width: 205,
      profile: 55,
      rim: 16,
      text: "primacy",
    });
  });

  it("only matches whole words, so 'generally' is not General", () => {
    expect(resolve("generally")).toEqual({ text: "generally" });
  });

  it("leaves commercial sizes as text for the size-label search", () => {
    expect(resolve("11R22.5")).toEqual({ text: "11R22.5" });
    expect(resolve("7.00-12")).toEqual({ text: "7.00-12" });
  });

  describe("product size labels", () => {
    const labels = ["31x10.50 R15", "205R16C", "11R22.5", "7.00-12"];
    const resolveLabel = (text: string) =>
      resolveSearchText(
        parseCatalogSearchParams({ q: text }).filters,
        brands,
        categories,
        labels,
      );

    it.each([
      "31x10.50 R15",
      "31.10.50R15",
      "31.10.50.15",
      "31X10.5R15",
      "31x10.50r15",
      "31-10.50-15",
      "31 10.50 15",
      "311050R15",
    ])("rewrites %s to the stored label", (text) => {
      expect(resolveLabel(text)).toEqual({ text: "31x10.50 R15" });
    });

    it.each([
      ["205R16C", "205R16C"],
      ["205 R16 C", "205R16C"],
      ["205r16", "205R16C"],
      ["11R22.5", "11R22.5"],
      ["11/22.5", "11R22.5"],
      ["700-12", "7.00-12"],
      ["7.00 12", "7.00-12"],
    ])("rewrites %s to %s", (text, label) => {
      expect(resolveLabel(text)).toEqual({ text: label });
    });

    it("keeps a brand and other words alongside the label", () => {
      expect(resolveLabel("michelin 31.10.50R15 mud")).toEqual({
        brandSlugs: ["michelin"],
        text: "31x10.50 R15 mud",
      });
    });

    it("does not take a metric size for a label", () => {
      expect(resolveLabel("205/60R16")).toEqual({ width: 205, profile: 60, rim: 16 });
      expect(resolveLabel("265/75R15")).toEqual({ width: 265, profile: 75, rim: 15 });
    });
  });

  it("ignores an out-of-range size rather than filtering on it", () => {
    expect(resolve("999/99 R99")).toEqual({ text: "999/99 R99" });
  });

  it("drops tyre/tire filler words", () => {
    expect(resolve("tyres")).toEqual({});
  });

  it("returns filters unchanged when there is no text", () => {
    const filters = { width: 185 };
    expect(resolveSearchText(filters, brands, categories)).toBe(filters);
  });
});

describe("cleanSearchText", () => {
  it("strips characters that are not letters, digits, spaces or size punctuation", () => {
    expect(cleanSearchText(`"] || true || ["*`)).toBe("true");
    expect(cleanSearchText("<script>alert(1)</script>")).toBe("script alert 1 /script");
  });

  it("collapses whitespace and caps the length", () => {
    expect(cleanSearchText("  a   b  ")).toBe("a b");
    expect(cleanSearchText("x".repeat(200))).toHaveLength(60);
  });

  it("treats blank input as no search", () => {
    expect(cleanSearchText("   ")).toBeUndefined();
    expect(cleanSearchText("***")).toBeUndefined();
    expect(cleanSearchText(undefined)).toBeUndefined();
  });

  it("keeps non-Latin letters", () => {
    expect(cleanSearchText("ٹائر")).toBe("ٹائر");
  });
});
