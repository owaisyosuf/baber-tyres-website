import type { BrandRelationship } from "@/components/product/BrandBadge";

/**
 * Brand-page copy — FR-B6, T022. The relationship statement is built from the
 * brand's `relationship` field, never typed per brand, so the badge and the
 * sentence can't disagree (Constitution §II.6: no status the data doesn't carry).
 */
export interface BrandCopyInput {
  name: string;
  relationship: BrandRelationship;
}

/** /brands section headings, in display order. */
export const RELATIONSHIP_GROUPS: readonly {
  relationship: BrandRelationship;
  heading: string;
  intro: string;
}[] = [
  {
    relationship: "importer",
    heading: "Brands we import",
    intro: "We bring these in ourselves, so you buy from the importer.",
  },
  {
    relationship: "dealer",
    heading: "Brands we deal in",
    intro: "Dealer stock, available to order and collect from our shop.",
  },
  {
    relationship: "stocked",
    heading: "Also in stock",
    intro: "More brands we carry. Message us to check your size.",
  },
];

/** "Baber Tyres Corporation is a direct importer of Yokohama tyres in Karachi." */
export function brandRelationshipStatement(
  shopName: string,
  brand: BrandCopyInput,
  city: string,
): string {
  switch (brand.relationship) {
    case "importer":
      return `${shopName} is a direct importer of ${brand.name} tyres in ${city}.`;
    case "dealer":
      return `${shopName} is a dealer of ${brand.name} tyres in ${city}.`;
    case "stocked":
      return `${shopName} stocks ${brand.name} tyres in ${city}.`;
  }
}

/** Targets "<brand> tyres Karachi" plus "<brand> importer/dealer Karachi" (FR-B6). */
export function brandPageTitle(brand: BrandCopyInput, city: string): string {
  switch (brand.relationship) {
    case "importer":
      return `${brand.name} Tyres ${city} — Direct Importer`;
    case "dealer":
      return `${brand.name} Tyres ${city} — Dealer`;
    case "stocked":
      return `${brand.name} Tyres in ${city}`;
  }
}

export function brandPageDescription(
  shopName: string,
  brand: BrandCopyInput,
  city: string,
): string {
  return `${brandRelationshipStatement(shopName, brand, city)} See ${brand.name} sizes, or message us on WhatsApp for price and availability.`;
}
