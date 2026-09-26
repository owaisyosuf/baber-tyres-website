import { describe, expect, it } from "vitest";
import { resolveSettings } from "./settings";
import { siteConfig } from "./site";
import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";

const cms = (overrides: Partial<NonNullable<SETTINGS_QUERY_RESULT>> = {}): SETTINGS_QUERY_RESULT => ({
  shopName: "Sanity Shop Name",
  addressLine: "Sanity Address",
  city: "Sanity City",
  phone: "+920000000001",
  whatsapp: "+920000000002",
  hoursOpen: "08:00",
  hoursClose: "20:00",
  openDays: ["Monday", "Tuesday", "Wednesday"],
  closedDay: "Thursday",
  deliveryNote: "Sanity delivery note",
  mapLat: null,
  mapLng: null,
  mapEmbedUrl: "https://maps.example/embed",
  googleReviewUrl: "https://reviews.example/us",
  defaultSeo: null,
  ...overrides,
});

describe("resolveSettings", () => {
  it("prefers what the owner set in Sanity", () => {
    const settings = resolveSettings(cms());
    expect(settings.shopName).toBe("Sanity Shop Name");
    expect(settings.addressLine).toBe("Sanity Address");
    expect(settings.phoneE164).toBe("+920000000001");
    expect(settings.whatsappE164).toBe("+920000000002");
    expect(settings.hours).toEqual({
      open: "08:00",
      close: "20:00",
      openDays: ["Monday", "Tuesday", "Wednesday"],
      closedDay: "Thursday",
    });
    expect(settings.deliveryNote).toBe("Sanity delivery note");
    expect(settings.googleReviewUrl).toBe("https://reviews.example/us");
    expect(settings.mapEmbedUrl).toBe("https://maps.example/embed");
  });

  it("falls back to the confirmed defaults when Sanity returns nothing", () => {
    const settings = resolveSettings(null);
    expect(settings.shopName).toBe(siteConfig.shopName);
    expect(settings.phoneE164).toBe(siteConfig.phoneE164);
    expect(settings.whatsappE164).toBe(siteConfig.whatsappE164);
    expect(settings.hours.closedDay).toBe("Sunday");
    expect(settings.hours.openDays).toEqual([...siteConfig.hours.openDays]);
    expect(settings.deliveryNote).toBe(siteConfig.deliveryNote);
    expect(settings.googleReviewUrl).toBeNull();
  });

  it("fills individual empty or blank fields from the defaults", () => {
    const settings = resolveSettings(
      cms({ shopName: "   ", hoursOpen: null, hoursClose: "", openDays: [], deliveryNote: null }),
    );
    expect(settings.shopName).toBe(siteConfig.shopName);
    expect(settings.hours.open).toBe(siteConfig.hours.open);
    expect(settings.hours.close).toBe(siteConfig.hours.close);
    expect(settings.hours.openDays).toEqual([...siteConfig.hours.openDays]);
    expect(settings.deliveryNote).toBe(siteConfig.deliveryNote);
  });

  it("treats an emptied closed day as 'open every day', not a missing value", () => {
    expect(resolveSettings(cms({ closedDay: null })).hours.closedDay).toBeNull();
  });

  it("does not show a review link until one is set", () => {
    expect(resolveSettings(cms({ googleReviewUrl: null })).googleReviewUrl).toBeNull();
    expect(resolveSettings(cms({ googleReviewUrl: "  " })).googleReviewUrl).toBeNull();
  });
});
