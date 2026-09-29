import { catalogHref } from "./filters";
import { formatPKR } from "./format";
import type { ProductFilters } from "./sanity/queries";

export interface FilterChip {
  /** Stable identity, e.g. "brand:yokohama" or "price". */
  key: string;
  /** What the chip says, e.g. "Yokohama" or "Width 185". */
  label: string;
  /** The catalog URL with just this filter removed. */
  href: string;
}

export interface FilterLabels {
  brands: readonly { slug: string; name: string }[];
  categories: readonly { slug: string; name: string }[];
}

function priceLabel(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) {
    return `${formatPKR(min)} – ${formatPKR(max).replace("PKR ", "")}`;
  }
  return min !== undefined ? `From ${formatPKR(min)}` : `Up to ${formatPKR(max ?? 0)}`;
}

/**
 * The removable chips for the active filters — FR-B2. Each chip carries the
 * URL that drops only that filter (and resets to page 1), so chips work as
 * plain links: no JavaScript needed, and back/forward behave normally. A
 * min/max pair is one "price" chip. Unknown slugs fall back to the slug
 * itself rather than hiding an active filter.
 */
export function activeFilterChips(
  filters: ProductFilters,
  labels: FilterLabels,
): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.text !== undefined) {
    chips.push({
      key: "text",
      label: `“${filters.text}”`,
      href: catalogHref({ ...filters, text: undefined }),
    });
  }

  for (const slug of filters.brandSlugs ?? []) {
    const remaining = (filters.brandSlugs ?? []).filter((other) => other !== slug);
    chips.push({
      key: `brand:${slug}`,
      label: labels.brands.find((brand) => brand.slug === slug)?.name ?? slug,
      href: catalogHref({
        ...filters,
        brandSlugs: remaining.length > 0 ? remaining : undefined,
      }),
    });
  }

  if (filters.categorySlug !== undefined) {
    chips.push({
      key: "category",
      label:
        labels.categories.find((category) => category.slug === filters.categorySlug)?.name ??
        filters.categorySlug,
      href: catalogHref({ ...filters, categorySlug: undefined }),
    });
  }

  if (filters.width !== undefined) {
    chips.push({
      key: "width",
      label: `Width ${filters.width}`,
      href: catalogHref({ ...filters, width: undefined }),
    });
  }
  if (filters.profile !== undefined) {
    chips.push({
      key: "profile",
      label: `Profile ${filters.profile}`,
      href: catalogHref({ ...filters, profile: undefined }),
    });
  }
  if (filters.rim !== undefined) {
    chips.push({
      key: "rim",
      label: `Rim ${filters.rim}`,
      href: catalogHref({ ...filters, rim: undefined }),
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    chips.push({
      key: "price",
      label: priceLabel(filters.minPrice, filters.maxPrice),
      href: catalogHref({ ...filters, minPrice: undefined, maxPrice: undefined }),
    });
  }

  return chips;
}
