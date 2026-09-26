import type { ProductFilters } from "./sanity/queries";

/**
 * Catalog filter parsing — FR-B2, design.md §4 and §6. The catalog URL is
 * untrusted input: anyone can type anything into it. Everything is checked
 * against a strict, bounded shape here, and only values that pass reach the
 * GROQ query — as `$params`, never spliced into the query text. A value that
 * fails is dropped on its own, so one bad param never discards the rest.
 *
 * URL contract:
 *   /tyres?brand=yokohama,dunlop&category=truck&width=185&profile=65&rim=15&min=5000&max=40000&page=2
 */

export type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export interface CatalogQuery {
  filters: ProductFilters;
  /** 1-based. */
  page: number;
}

/** Longest raw value looked at; anything longer is dropped before parsing. */
const MAX_VALUE_LENGTH = 500;
const MAX_BRANDS = 20;
const MAX_PAGE = 1000;

// Sanity slugs: lower-case letters, digits, hyphen, underscore; starts and ends alphanumeric.
const SLUG = /^[a-z0-9](?:[a-z0-9_-]{0,58}[a-z0-9])?$/;
const INTEGER = /^(?:0|[1-9]\d*)$/;
// Rim diameters can carry one decimal place (22.5, 19.5).
const RIM = /^[1-9]\d?(?:\.\d)?$/;

// Plausibility ranges — wide enough for car through forklift and truck sizes
// (including the bias-ply and commercial entries), tight enough to reject junk.
const RANGES = {
  width: { min: 50, max: 1000 },
  profile: { min: 20, max: 120 },
  rim: { min: 8, max: 30 },
  price: { min: 0, max: 10_000_000 },
} as const;

/** The first value of a param, or undefined. Repeated params keep their first value. */
function first(input: SearchParamsInput, key: string): string | undefined {
  const raw =
    input instanceof URLSearchParams
      ? (input.get(key) ?? undefined)
      : Array.isArray(input[key])
        ? input[key][0]
        : input[key];
  return typeof raw === "string" && raw.length <= MAX_VALUE_LENGTH ? raw : undefined;
}

/** Every value of a param, flattened, so `brand=a,b` and `brand=a&brand=b` both work. */
function all(input: SearchParamsInput, key: string): string[] {
  const raw =
    input instanceof URLSearchParams ? input.getAll(key) : [input[key]].flat();
  return raw.filter(
    (value): value is string =>
      typeof value === "string" && value.length <= MAX_VALUE_LENGTH,
  );
}

function slug(value: string | undefined): string | undefined {
  const candidate = value?.trim().toLowerCase();
  return candidate && SLUG.test(candidate) ? candidate : undefined;
}

function bounded(
  value: string | undefined,
  pattern: RegExp,
  { min, max }: { min: number; max: number },
): number | undefined {
  const text = value?.trim();
  if (!text || !pattern.test(text)) return undefined;
  const number = Number(text);
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined;
}

export function parseCatalogSearchParams(input: SearchParamsInput): CatalogQuery {
  const brandSlugs = [
    ...new Set(
      all(input, "brand")
        .flatMap((value) => value.split(","))
        .map(slug)
        .filter((value): value is string => value !== undefined),
    ),
  ].slice(0, MAX_BRANDS);

  const categorySlug = slug(first(input, "category"));
  const width = bounded(first(input, "width"), INTEGER, RANGES.width);
  const profile = bounded(first(input, "profile"), INTEGER, RANGES.profile);
  const rim = bounded(first(input, "rim"), RIM, RANGES.rim);
  let minPrice = bounded(first(input, "min"), INTEGER, RANGES.price);
  let maxPrice = bounded(first(input, "max"), INTEGER, RANGES.price);

  // A range that contradicts itself is ignored rather than guessed at.
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  const page =
    bounded(first(input, "page"), INTEGER, { min: 1, max: MAX_PAGE }) ?? 1;

  const filters: ProductFilters = {
    ...(brandSlugs.length > 0 && { brandSlugs }),
    ...(categorySlug !== undefined && { categorySlug }),
    ...(width !== undefined && { width }),
    ...(profile !== undefined && { profile }),
    ...(rim !== undefined && { rim }),
    ...(minPrice !== undefined && { minPrice }),
    ...(maxPrice !== undefined && { maxPrice }),
  };

  return { filters, page };
}

/**
 * The canonical query string for a set of filters — the inverse of
 * parseCatalogSearchParams. Parameters come in a fixed order, brands keep the
 * order given, and page 1 is left out, so a canonical URL round-trips exactly.
 * Every value is already a validated slug or number, so nothing needs escaping.
 */
export function buildCatalogQuery(filters: ProductFilters, page = 1): string {
  const parts: string[] = [];
  if (filters.brandSlugs?.length) parts.push(`brand=${filters.brandSlugs.join(",")}`);
  if (filters.categorySlug !== undefined) parts.push(`category=${filters.categorySlug}`);
  if (filters.width !== undefined) parts.push(`width=${filters.width}`);
  if (filters.profile !== undefined) parts.push(`profile=${filters.profile}`);
  if (filters.rim !== undefined) parts.push(`rim=${filters.rim}`);
  if (filters.minPrice !== undefined) parts.push(`min=${filters.minPrice}`);
  if (filters.maxPrice !== undefined) parts.push(`max=${filters.maxPrice}`);
  if (page > 1) parts.push(`page=${page}`);
  return parts.join("&");
}

/**
 * How many filters are active, for the "Filters (n)" trigger. Each selected
 * brand counts, and a min/max price pair counts as one.
 */
export function countActiveFilters(filters: ProductFilters): number {
  return (
    (filters.brandSlugs?.length ?? 0) +
    (filters.categorySlug !== undefined ? 1 : 0) +
    (filters.width !== undefined ? 1 : 0) +
    (filters.profile !== undefined ? 1 : 0) +
    (filters.rim !== undefined ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0)
  );
}
