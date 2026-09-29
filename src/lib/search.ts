import { cleanSearchText } from "./filters";
import type { ProductFilters } from "./sanity/queries";

export interface SearchOption {
  name: string;
  slug: string;
}

// "185/65R15", "185/65 R15", "185/65ZR15", "185 65 15", "185/65/15".
const METRIC_SIZE = /(?<!\d)(\d{3})\s*[/ ]\s*(\d{2})\s*(?:z?r\s*|[/ ]\s*)(\d{2}(?:\.\d)?)(?![\d.])/i;
// Words that say nothing about which tyre: dropped before the text search.
const NOISE = /(?<![\p{L}\p{N}])(?:tyres?|tires?)(?![\p{L}\p{N}])/giu;

const SIZE_RANGES = {
  width: { min: 50, max: 1000 },
  profile: { min: 20, max: 120 },
  rim: { min: 8, max: 30 },
} as const;

const inRange = (value: number, { min, max }: { min: number; max: number }) =>
  value >= min && value <= max;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A whole-word, case-insensitive pattern for any of the given terms. */
function wordPattern(terms: string[]): RegExp {
  const alternatives = terms.filter(Boolean).map(escapeRegExp).join("|");
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, "iu");
}

/** A category's name split on "/" ("Truck / Commercial" → "Truck", "Commercial"), plus its slug. */
const categoryTerms = (category: SearchOption) => [
  category.slug,
  ...category.name.split("/").map((part) => part.trim()),
];

/**
 * Turns the site-search text into catalog filters. A tyre size becomes the
 * width/profile/rim filters, a brand or vehicle-category name becomes that
 * filter, and whatever is left stays as free text for the name search. Only
 * names from the given lists are recognised, so nothing typed can invent a
 * filter value.
 */
export function resolveSearchText(
  filters: ProductFilters,
  brands: readonly SearchOption[],
  categories: readonly SearchOption[],
): ProductFilters {
  if (filters.text === undefined) return filters;

  let rest = filters.text;
  const next: ProductFilters = { ...filters };

  const size = rest.match(METRIC_SIZE);
  if (size) {
    const [width, profile, rim] = [Number(size[1]), Number(size[2]), Number(size[3])];
    if (
      inRange(width, SIZE_RANGES.width) &&
      inRange(profile, SIZE_RANGES.profile) &&
      inRange(rim, SIZE_RANGES.rim)
    ) {
      Object.assign(next, { width, profile, rim });
      rest = rest.replace(size[0], " ");
    }
  }

  const foundBrands: string[] = [];
  for (const brand of brands) {
    const pattern = wordPattern([brand.name, brand.slug]);
    if (pattern.test(rest)) {
      foundBrands.push(brand.slug);
      rest = rest.replace(pattern, " ");
    }
  }
  if (foundBrands.length > 0) {
    next.brandSlugs = [...new Set([...(filters.brandSlugs ?? []), ...foundBrands])];
  }

  if (next.categorySlug === undefined) {
    const category = categories.find((option) => wordPattern(categoryTerms(option)).test(rest));
    if (category) {
      next.categorySlug = category.slug;
      rest = rest.replace(wordPattern(categoryTerms(category)), " ");
    }
  }

  const text = cleanSearchText(rest.replace(NOISE, " "));
  if (text === undefined) delete next.text;
  else next.text = text;
  return next;
}
