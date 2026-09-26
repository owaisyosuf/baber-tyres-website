import { describe, expect, it } from "vitest";
import { siteConfig } from "../../lib/site";
import {
  allSeedDocs,
  brandDocs,
  categoryDocs,
  publishedDocs,
  sampleProductDocs,
  serviceDocs,
  siteSettingsDoc,
} from "./data";

describe("seed data", () => {
  it("has unique document ids", () => {
    const ids = allSeedDocs.map((doc) => doc._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("seeds exactly the three services — nothing else (FR-C1)", () => {
    expect(serviceDocs.map((s) => s.name)).toEqual([
      "Tyre Fitting",
      "Computerized Wheel Alignment",
      "Computerized Wheel Balancing",
    ]);
  });

  it("seeds the five categories with the slugs the design names", () => {
    expect(categoryDocs.map((c) => (c.slug as { current: string }).current)).toEqual([
      "car",
      "suv",
      "truck",
      "lifter",
      "offroad",
    ]);
  });

  it("gives every brand a relationship, matching the confirmed facts", () => {
    const byRelationship = (relationship: string) =>
      brandDocs.filter((b) => b.relationship === relationship).map((b) => b.name);

    expect(byRelationship("importer")).toEqual(["Yokohama", "Rapid", "Michelin", "Duhow"]);
    expect(byRelationship("dealer")).toEqual(["Dunlop", "General", "Armstrong"]);
    for (const brand of brandDocs) {
      expect(["importer", "dealer", "stocked"]).toContain(brand.relationship);
    }
  });

  it("takes contact details and hours from siteConfig, not retyped values", () => {
    expect(siteSettingsDoc.phone).toBe(siteConfig.phoneE164);
    expect(siteSettingsDoc.whatsapp).toBe(siteConfig.whatsappE164);
    expect(siteSettingsDoc.openDays).toEqual([...siteConfig.hours.openDays]);
    expect(siteSettingsDoc.closedDay).toBe("Sunday");
    expect(siteSettingsDoc.deliveryNote).toBe(siteConfig.deliveryNote);
  });

  it("uses the singleton document id the desk structure pins", () => {
    expect(siteSettingsDoc._id).toBe("siteSettings");
  });

  it("covers every category with at least one sample product", () => {
    const covered = new Set(
      sampleProductDocs.map((p) => (p.category as { _ref: string })._ref),
    );
    for (const category of categoryDocs) {
      expect(covered).toContain(category._id);
    }
  });

  it("includes a sample product using sizeLabelOverride for a commercial size", () => {
    const overridden = sampleProductDocs.filter((p) => p.sizeLabelOverride);
    expect(overridden.map((p) => p.sizeLabelOverride)).toContain("11R22.5");
  });

  it("references only brands and categories that are seeded", () => {
    const published = new Set(publishedDocs.map((doc) => doc._id));
    for (const product of sampleProductDocs) {
      expect(published).toContain((product.brand as { _ref: string })._ref);
      expect(published).toContain((product.category as { _ref: string })._ref);
    }
  });

  it("keeps every sample product a draft, clearly marked, so none can go live unreviewed", () => {
    for (const product of sampleProductDocs) {
      expect(product._id.startsWith("drafts.")).toBe(true);
      expect(String(product.name).startsWith("[SAMPLE]")).toBe(true);
    }
    expect(publishedDocs.some((doc) => doc._type === "product")).toBe(false);
  });

  it("gives every sample product a valid, positive numeric size and price", () => {
    for (const product of sampleProductDocs) {
      for (const field of ["width", "profile", "rim", "price"] as const) {
        expect(product[field]).toBeGreaterThan(0);
      }
    }
  });

  it("does not mention services the shop does not offer", () => {
    const text = JSON.stringify(allSeedDocs).toLowerCase();
    expect(text).not.toContain("puncture");
    expect(text).not.toContain("nitrogen");
  });
});
