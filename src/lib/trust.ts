/**
 * The homepage trust strip — FR-A2, T027. Three facts, each one the shop
 * confirmed or the data carries (Constitution §II.6): the brand count is the
 * owner's own "20+", the importer count is however many brands are tagged
 * `importer` in Sanity, and the place is the address. A stat the data cannot
 * back (no importer brands published) is left out, never shown as 0.
 */
export interface TrustItem {
  value: string;
  label: string;
}

export function trustStripItems(input: {
  brandCountLabel: string;
  importerCount: number;
  city: string;
  addressLine: string;
}): TrustItem[] {
  return [
    { value: input.brandCountLabel, label: "Brands" },
    ...(input.importerCount > 0
      ? [{ value: String(input.importerCount), label: "Imported directly" }]
      : []),
    { value: input.city, label: input.addressLine },
  ];
}
