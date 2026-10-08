import { cleanSearchText } from "./filters";
import type { ProductFilters } from "./sanity/queries";

export interface SearchOption {
  name: string;
  slug: string;
}

// "185/65R15", "185/65 R15", "185/65ZR15", "185 65 15", "185/65/15", and the
// price-list style "185.65R15" / "185.65.15".
const METRIC_SIZE = /(?<!\d)(\d{3})\s*[/ .]\s*(\d{2})\s*(?:z?r\s*|[/ .]\s*)(\d{2}(?:\.\d)?)(?![\d.])/i;
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

// What may stand between the numbers of a size label when typed: "31x10.50R15",
// "31.10.50 r15", "31-10.50-15", "11/22.5", "1122.5".
const LABEL_SEPARATOR = String.raw`[\s/xX*.\-rRzZ]{0,4}`;

/**
 * One number of a size label as a pattern that also accepts it typed with a
 * dropped point or trailing zero: "10.50" → 10.50, 10.5, 1050, 105.
 */
function labelNumberPattern(number: string): string {
  const [whole, decimals = ""] = number.split(".");
  const significant = decimals.replace(/0+$/, "");
  return significant ? `${whole}\\.?${significant}0*` : `${whole}(?:\\.?0+)?`;
}

/**
 * A pattern for a non-metric size label (the products' `sizeLabelOverride`,
 * e.g. "31x10.50 R15", "205R16C", "11R22.5") that matches the same numbers
 * however they are punctuated, with an optional trailing "C".
 */
function sizeLabelPattern(label: string): RegExp | undefined {
  const numbers = label.match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length < 2) return undefined;
  const body = numbers.map(labelNumberPattern).join(LABEL_SEPARATOR);
  return new RegExp(`(?<![\\d.])${body}(?:\\s*c)?(?![\\p{L}\\p{N}])`, "iu");
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
 * filter value. A non-metric size that a product lists as its size label
 * ("31.10.50R15" for "31x10.50 R15") is rewritten to that label, which the
 * name search then finds.
 */
export function resolveSearchText(
  filters: ProductFilters,
  brands: readonly SearchOption[],
  categories: readonly SearchOption[],
  sizeLabels: readonly string[] = [],
): ProductFilters {
  if (filters.text === undefined) return filters;

  let rest = filters.text;
  const next: ProductFilters = { ...filters };

  let sizeLabel: string | undefined;
  for (const label of sizeLabels) {
    const pattern = sizeLabelPattern(label);
    const found = pattern && rest.match(pattern);
    if (found) {
      sizeLabel = label;
      rest = rest.replace(found[0], " ");
      break;
    }
  }

  const size = sizeLabel === undefined ? rest.match(METRIC_SIZE) : null;
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

  const text = cleanSearchText([sizeLabel, rest.replace(NOISE, " ")].join(" "));
  if (text === undefined) delete next.text;
  else next.text = text;
  return next;
}
