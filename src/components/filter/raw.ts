import { parseCatalogSearchParams } from "@/lib/filters";
import type { ProductFilters } from "@/lib/sanity/queries";

/**
 * The filter form's values exactly as the visitor typed or picked them — all
 * strings, so a half-typed price can sit in an input without being a valid
 * filter yet. Anything that reaches the URL first goes back through
 * parseCatalogSearchParams, the same validation the server applies.
 */
export interface RawFilters {
  /** The site-search text; not edited in the panel, only carried along. */
  text: string;
  brands: string[];
  category: string;
  width: string;
  profile: string;
  rim: string;
  min: string;
  max: string;
}

export const EMPTY_RAW: RawFilters = {
  text: "",
  brands: [],
  category: "",
  width: "",
  profile: "",
  rim: "",
  min: "",
  max: "",
};

export function filtersToRaw(filters: ProductFilters): RawFilters {
  return {
    text: filters.text ?? "",
    brands: [...(filters.brandSlugs ?? [])],
    category: filters.categorySlug ?? "",
    width: filters.width?.toString() ?? "",
    profile: filters.profile?.toString() ?? "",
    rim: filters.rim?.toString() ?? "",
    min: filters.minPrice?.toString() ?? "",
    max: filters.maxPrice?.toString() ?? "",
  };
}

/** Validates raw form values; whatever is malformed or empty simply isn't a filter. */
export function rawToFilters(raw: RawFilters): ProductFilters {
  const params = new URLSearchParams();
  if (raw.brands.length > 0) params.set("brand", raw.brands.join(","));
  for (const [name, value] of [
    ["q", raw.text],
    ["category", raw.category],
    ["width", raw.width],
    ["profile", raw.profile],
    ["rim", raw.rim],
    ["min", raw.min],
    ["max", raw.max],
  ] as const) {
    if (value) params.set(name, value);
  }
  return parseCatalogSearchParams(params).filters;
}
