/**
 * The homepage trust strip — FR-A2, T027. Three facts, each one the shop
 * confirmed or the data carries (Constitution §II.6): the brand count is the
 * owner's own "20+", the importer stat names a couple of the brands tagged
 * `importer` in Sanity (the shop imports far more than the site lists, so no
 * count is shown), and the place is the address. A stat the data cannot back
 * (no importer brands published) is left out.
 */
export interface TrustItem {
  value: string;
  label: string;
}

const IMPORTER_NAMES_SHOWN = 2;

export function trustStripItems(input: {
  brandCountLabel: string;
  importerNames: readonly string[];
  city: string;
  addressLine: string;
}): TrustItem[] {
  const named = input.importerNames.slice(0, IMPORTER_NAMES_SHOWN).join(", ");
  return [
    { value: input.brandCountLabel, label: "Brands" },
    ...(named ? [{ value: "Direct Importer", label: `${named} & more` }] : []),
    { value: input.city, label: input.addressLine },
  ];
}
