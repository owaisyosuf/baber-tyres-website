import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./jsonLd";
import { buildLocalBusinessJsonLd } from "./localBusiness";
import { resolveSettings, type ShopSettings } from "../settings";
import { siteConfig } from "../site";

const URL = "https://example.test";
const defaults = () => resolveSettings(null);
const build = (overrides: Partial<ShopSettings> = {}) =>
  buildLocalBusinessJsonLd({ ...defaults(), ...overrides }, URL);

describe("buildLocalBusinessJsonLd", () => {
  it("describes the shop from the shared settings", () => {
    const data = build();
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("TireShop");
    expect(data["@id"]).toBe(`${URL}/#business`);
    expect(data.name).toBe(siteConfig.shopName);
    expect(data.url).toBe(URL);
    expect(data.telephone).toBe(siteConfig.phoneE164);
    expect(data.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressLine,
      addressLocality: siteConfig.city,
      addressCountry: "PK",
    });
  });

  it("lists Monday to Saturday 10:00–19:00 and leaves Sunday out (closed)", () => {
    const spec = build().openingHoursSpecification;
    expect(spec).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ]);
    expect(spec![0].dayOfWeek).not.toContain("Sunday");
  });

  it("follows the owner's hours when they change", () => {
    const spec = build({
      hours: { open: "09:30", close: "17:00", openDays: ["Friday", "Monday"], closedDay: null },
    }).openingHoursSpecification;
    expect(spec![0]).toMatchObject({ dayOfWeek: ["Monday", "Friday"], opens: "09:30", closes: "17:00" });
  });

  it("omits hours it cannot state validly rather than emitting bad data", () => {
    const badTime = build({
      hours: { open: "10am", close: "19:00", openDays: ["Monday"], closedDay: null },
    });
    const noDays = build({
      hours: { open: "10:00", close: "19:00", openDays: ["Funday"], closedDay: null },
    });
    expect(badTime).not.toHaveProperty("openingHoursSpecification");
    expect(noDays).not.toHaveProperty("openingHoursSpecification");
  });

  it("includes geo only when the owner has entered coordinates", () => {
    expect(build()).not.toHaveProperty("geo");
    expect(build({ mapLat: 24.86, mapLng: 67.0 }).geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 24.86,
      longitude: 67.0,
    });
    expect(build({ mapLat: 24.86, mapLng: null })).not.toHaveProperty("geo");
  });

  it("claims nothing the shop has not confirmed", () => {
    const data = build();
    for (const key of ["image", "priceRange", "sameAs", "aggregateRating", "review"]) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it("serialises without any undefined values", () => {
    expect(JSON.stringify(build())).not.toContain("undefined");
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so a value cannot close the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    const backslash = String.fromCharCode(92);
    expect(out).toContain(`${backslash}u003c/script>`);
  });

  it("round-trips back to the original data", () => {
    const data = { name: "Tyres <b>&</b> More", n: 1 };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
