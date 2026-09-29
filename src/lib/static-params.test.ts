import { describe, expect, it } from "vitest";
import { NO_PAGES_SLUG, slugParams } from "./static-params";

describe("slugParams", () => {
  it("maps each item to its slug param", () => {
    expect(slugParams([{ slug: "a" }, { slug: "b" }])).toEqual([{ slug: "a" }, { slug: "b" }]);
  });

  it("returns one placeholder when nothing is published, so the build never gets an empty list", () => {
    expect(slugParams([])).toEqual([{ slug: NO_PAGES_SLUG }]);
  });

  it("uses a placeholder no Sanity slug can match", () => {
    expect(NO_PAGES_SLUG.startsWith("_")).toBe(true);
  });
});
