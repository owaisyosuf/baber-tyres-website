import { catalogHref } from "./filters";
import { formatTyreSize, type TyreSizeInput } from "./format";
import type { SearchOption } from "./search";
import type { ProductFilters } from "./sanity/queries";

export type SuggestionKind = "size" | "brand" | "category" | "product" | "all";

export interface Suggestion {
  kind: SuggestionKind;
  label: string;
  /** Short grey text on the right: "Brand", the product's size, … */
  detail: string;
  href: string;
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
  /** Pre-filled WhatsApp link about what was typed, for when nothing fits. */
  whatsappHref: string;
}

export interface SuggestProduct extends TyreSizeInput {
  name: string;
  slug: string;
  brand: { name: string } | null;
}

const MAX_NAME_MATCHES = 3;

/** Options whose name or slug starts a word with what is typed ("yok" → Yokohama), best first. */
function namedMatches(text: string, options: readonly SearchOption[]): SearchOption[] {
  const needle = text.toLowerCase();
  const starts = (value: string) =>
    value.toLowerCase().split(/[\s/-]+/).some((word) => word.startsWith(needle));
  return options
    .filter((option) => starts(option.name) || option.slug.startsWith(needle))
    .slice(0, MAX_NAME_MATCHES);
}

/**
 * The suggestion list under the search box, in the order a visitor most
 * likely wants: the size they typed, matching brands and vehicle types,
 * matching products, then "see all results". Pure, so it is tested without
 * Sanity; api/search/route.ts supplies the data.
 */
export function buildSuggestions(input: {
  text: string;
  resolved: ProductFilters;
  brands: readonly SearchOption[];
  categories: readonly SearchOption[];
  products: readonly SuggestProduct[];
  total: number;
}): Suggestion[] {
  const { text, resolved, brands, categories, products, total } = input;
  const suggestions: Suggestion[] = [];

  const { width, profile, rim } = resolved;
  if (width !== undefined && profile !== undefined && rim !== undefined) {
    suggestions.push({
      kind: "size",
      label: formatTyreSize({ width, profile, rim }),
      detail: "Tyre size",
      href: catalogHref({ width, profile, rim }),
    });
  }

  const lastWord = text.split(" ").at(-1) ?? text;
  if (lastWord.length >= 2) {
    for (const brand of namedMatches(lastWord, brands)) {
      suggestions.push({
        kind: "brand",
        label: brand.name,
        detail: "Brand",
        href: `/brands/${brand.slug}`,
      });
    }
    for (const category of namedMatches(lastWord, categories)) {
      suggestions.push({
        kind: "category",
        label: category.name,
        detail: "Vehicle",
        href: `/categories/${category.slug}`,
      });
    }
  }

  for (const product of products) {
    suggestions.push({
      kind: "product",
      label: product.name,
      detail: formatTyreSize(product),
      href: `/tyres/${product.slug}`,
    });
  }

  if (total > products.length) {
    suggestions.push({
      kind: "all",
      label: `See all ${total} results`,
      detail: "",
      href: catalogHref({ text }),
    });
  }

  return suggestions;
}

/**
 * The words of the search text as a prefix match for GROQ (`bluea` finds
 * "BluEarth"), still passed as a parameter. Only the letters, digits and size
 * punctuation that cleanSearchText lets through ever reach here.
 */
export function prefixMatchText(text: string): string {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word}*`)
    .join(" ");
}
