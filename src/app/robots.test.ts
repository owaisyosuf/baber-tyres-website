import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  it("opens the site to crawlers but keeps the studio and api out", () => {
    expect(rules[0].userAgent).toBe("*");
    expect(rules[0].allow).toBe("/");
    expect(rules[0].disallow).toEqual(["/studio", "/api/"]);
  });

  it("does not block filtered catalog URLs, so crawlers can read their canonical", () => {
    const disallow = ([] as string[]).concat(rules[0].disallow ?? []);
    expect(disallow.some((path) => path.startsWith("/tyres"))).toBe(false);
  });

  it("points at the sitemap", () => {
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
