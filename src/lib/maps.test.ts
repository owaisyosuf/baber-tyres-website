import { describe, expect, it } from "vitest";
import { mapsDirectionsUrl, safeMapEmbedUrl } from "./maps";

describe("safeMapEmbedUrl", () => {
  it("accepts a Google Maps embed URL", () => {
    const url = "https://www.google.com/maps/embed?pb=!1m18!1m12";
    expect(safeMapEmbedUrl(url)).toBe(url);
  });

  it("returns null when nothing is set", () => {
    for (const value of [null, undefined, "", "   "]) {
      expect(safeMapEmbedUrl(value)).toBeNull();
    }
  });

  it("rejects anything that is not an https Google Maps URL", () => {
    for (const value of [
      "http://www.google.com/maps/embed?pb=1",
      "https://evil.example.com/maps/embed?pb=1",
      "https://www.google.com.evil.example/maps/embed",
      "https://www.google.com/search?q=maps",
      "javascript:alert(1)",
      "not a url",
    ]) {
      expect(safeMapEmbedUrl(value), value).toBeNull();
    }
  });
});

describe("mapsDirectionsUrl", () => {
  const place = { addressLine: "M.A. Jinnah Road", city: "Karachi" };

  it("searches for the address when no coordinates are set", () => {
    const url = mapsDirectionsUrl({ ...place, mapLat: null, mapLng: null });
    expect(url).toBe(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("M.A. Jinnah Road, Karachi")}`,
    );
  });

  it("uses the coordinates when both are set", () => {
    const url = mapsDirectionsUrl({ ...place, mapLat: 24.86, mapLng: 67.01 });
    expect(url).toContain(encodeURIComponent("24.86,67.01"));
  });

  it("falls back to the address if only one coordinate is set", () => {
    const url = mapsDirectionsUrl({ ...place, mapLat: 24.86, mapLng: null });
    expect(url).toContain(encodeURIComponent("M.A. Jinnah Road"));
  });
});
