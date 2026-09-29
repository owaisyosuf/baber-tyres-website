import { describe, expect, it } from "vitest";
import { isCurrentRoute, navItems } from "./nav";

describe("navItems", () => {
  it("lists Home and the five primary destinations from FR-D1, in order", () => {
    expect(navItems.map((item) => item.label)).toEqual([
      "Home",
      "Tyres",
      "Brands",
      "Services",
      "About",
      "Contact",
    ]);
  });
});

describe("isCurrentRoute", () => {
  it("matches the exact route", () => {
    expect(isCurrentRoute("/tyres", "/tyres")).toBe(true);
  });

  it("matches routes beneath the item", () => {
    expect(isCurrentRoute("/tyres/bluearth-es32", "/tyres")).toBe(true);
    expect(isCurrentRoute("/brands/yokohama", "/brands")).toBe(true);
  });

  it("does not match a sibling that merely shares a prefix", () => {
    expect(isCurrentRoute("/tyres-extra", "/tyres")).toBe(false);
    expect(isCurrentRoute("/brandsmith", "/brands")).toBe(false);
  });

  it("does not match unrelated routes or the homepage", () => {
    expect(isCurrentRoute("/", "/tyres")).toBe(false);
    expect(isCurrentRoute("/about", "/contact")).toBe(false);
  });

  it("matches Home only on the homepage itself", () => {
    expect(isCurrentRoute("/", "/")).toBe(true);
    expect(isCurrentRoute("/tyres", "/")).toBe(false);
    expect(isCurrentRoute("/brands/yokohama", "/")).toBe(false);
  });

  it("marks nothing while the pathname is unknown", () => {
    expect(isCurrentRoute(null, "/tyres")).toBe(false);
  });
});
