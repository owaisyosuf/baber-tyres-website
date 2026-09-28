import { describe, expect, it } from "vitest";
import {
  brandPageDescription,
  brandPageTitle,
  brandRelationshipStatement,
  RELATIONSHIP_GROUPS,
} from "./brand";

const shop = "Baber Tyres Corporation";
const city = "Karachi";
const yokohama = { name: "Yokohama", relationship: "importer" } as const;

describe("brandRelationshipStatement", () => {
  it("states a direct import for importer brands", () => {
    expect(brandRelationshipStatement(shop, yokohama, city)).toBe(
      "Baber Tyres Corporation is a direct importer of Yokohama tyres in Karachi.",
    );
  });

  it("states dealer and stocked brands differently, from the data", () => {
    expect(brandRelationshipStatement(shop, { name: "Dunlop", relationship: "dealer" }, city)).toBe(
      "Baber Tyres Corporation is a dealer of Dunlop tyres in Karachi.",
    );
    expect(
      brandRelationshipStatement(shop, { name: "Rapid", relationship: "stocked" }, city),
    ).toBe("Baber Tyres Corporation stocks Rapid tyres in Karachi.");
  });

  it("never claims importer status for a dealer or stocked brand", () => {
    for (const relationship of ["dealer", "stocked"] as const) {
      expect(brandRelationshipStatement(shop, { name: "X", relationship }, city)).not.toMatch(
        /import/i,
      );
    }
  });
});

describe("brand page metadata", () => {
  it("targets '<brand> tyres Karachi' and importer/dealer in the title", () => {
    expect(brandPageTitle(yokohama, city)).toBe("Yokohama Tyres Karachi — Direct Importer");
    expect(brandPageTitle({ name: "Dunlop", relationship: "dealer" }, city)).toBe(
      "Dunlop Tyres Karachi — Dealer",
    );
    expect(brandPageTitle({ name: "Rapid", relationship: "stocked" }, city)).toContain(
      "Rapid Tyres in Karachi",
    );
  });

  it("leads the description with the relationship statement", () => {
    expect(brandPageDescription(shop, yokohama, city)).toMatch(
      /^Baber Tyres Corporation is a direct importer of Yokohama tyres in Karachi\./,
    );
  });
});

describe("RELATIONSHIP_GROUPS", () => {
  it("covers every relationship once, importers first", () => {
    expect(RELATIONSHIP_GROUPS.map((g) => g.relationship)).toEqual([
      "importer",
      "dealer",
      "stocked",
    ]);
  });
});
