import { defineQuery } from "groq";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";

/**
 * The query set from design.md §6 — one exported GROQ constant per need,
 * plus a cached fetch wrapper per constant. Every query is a single
 * self-contained literal string (no interpolated fragments) so Sanity's
 * typegen can statically scan it (see package.json's `typegen` script).
 *
 * Filter values reach these queries only as GROQ parameters ($foo), never
 * string-interpolated — see lib/filters.ts (T018) for how raw searchParams
 * get validated into the shapes these functions accept.
 */

/* Homepage --------------------------------------------------------------- */

export const HOMEPAGE_QUERY = defineQuery(`{
  "brands": *[_type == "brand"] | order(relationship asc, displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    relationship,
    logo
  },
  "featuredProducts": *[_type == "product" && featured == true] | order(_createdAt desc) [0...8] {
    _id,
    name,
    "slug": slug.current,
    price,
    inStock,
    sizeLabelOverride,
    width,
    profile,
    rim,
    images[]{ alt, asset },
    brand->{ name, "slug": slug.current, relationship }
  },
  "categories": *[_type == "category"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    icon
  },
  "services": *[_type == "service"] | order(displayOrder asc) [0...3] {
    _id,
    name,
    "slug": slug.current,
    icon
  },
  "settings": *[_type == "siteSettings"][0] {
    shopName,
    addressLine,
    city,
    phone,
    whatsapp,
    hoursOpen,
    hoursClose,
    openDays,
    closedDay,
    deliveryNote
  }
}`);

export async function getHomepageData() {
  "use cache";
  cacheTag("home", "brand", "product", "category", "service", "settings");
  cacheLife("max");
  return client.fetch(HOMEPAGE_QUERY);
}

/* Products ----------------------------------------------------------------- */

export const PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && (!defined($brandSlugs) || brand->slug.current in $brandSlugs)
  && (!defined($categorySlug) || category->slug.current == $categorySlug)
  && (!defined($width) || width == $width)
  && (!defined($profile) || profile == $profile)
  && (!defined($rim) || rim == $rim)
  && (!defined($minPrice) || price >= $minPrice)
  && (!defined($maxPrice) || price <= $maxPrice)
] | order(featured desc, _createdAt desc) [$start...$end] {
  _id,
  name,
  "slug": slug.current,
  price,
  inStock,
  featured,
  sizeLabelOverride,
  width,
  profile,
  rim,
  images[]{ alt, asset },
  brand->{ name, "slug": slug.current, relationship },
  category->{ name, "slug": slug.current }
}`);

export const PRODUCTS_COUNT_QUERY = defineQuery(`count(*[
  _type == "product"
  && (!defined($brandSlugs) || brand->slug.current in $brandSlugs)
  && (!defined($categorySlug) || category->slug.current == $categorySlug)
  && (!defined($width) || width == $width)
  && (!defined($profile) || profile == $profile)
  && (!defined($rim) || rim == $rim)
  && (!defined($minPrice) || price >= $minPrice)
  && (!defined($maxPrice) || price <= $maxPrice)
])`);

export interface ProductFilters {
  brandSlugs?: string[];
  categorySlug?: string;
  width?: number;
  profile?: number;
  rim?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface Pagination {
  page?: number;
  pageSize?: number;
}

function productFilterParams(filters: ProductFilters) {
  return {
    brandSlugs: filters.brandSlugs ?? null,
    categorySlug: filters.categorySlug ?? null,
    width: filters.width ?? null,
    profile: filters.profile ?? null,
    rim: filters.rim ?? null,
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
  };
}

export async function getProducts(
  filters: ProductFilters = {},
  pagination: Pagination = {},
) {
  "use cache";
  cacheTag("product", "brand", "category");
  cacheLife("max");

  const pageSize = pagination.pageSize ?? 24;
  const page = pagination.page ?? 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const [items, total] = await Promise.all([
    client.fetch(PRODUCTS_QUERY, { ...productFilterParams(filters), start, end }),
    client.fetch(PRODUCTS_COUNT_QUERY, productFilterParams(filters)),
  ]);

  return { items, total, page, pageSize };
}

/* Product detail ------------------------------------------------------------- */

export const PRODUCT_BY_SLUG = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  price,
  inStock,
  featured,
  sizeLabelOverride,
  width,
  profile,
  rim,
  loadIndex,
  speedRating,
  description,
  images[]{ alt, asset },
  brand->{ _id, name, "slug": slug.current, relationship, logo },
  category->{ _id, name, "slug": slug.current },
  seo { title, description }
}`);

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheTag(`product:${slug}`, "product");
  cacheLife("max");
  return client.fetch(PRODUCT_BY_SLUG, { slug });
}

export const RELATED_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && slug.current != $slug
  && (brand._ref == $brandId || category._ref == $categoryId)
] | order(brand._ref == $brandId desc, _createdAt desc) [0...4] {
  _id,
  name,
  "slug": slug.current,
  price,
  inStock,
  sizeLabelOverride,
  width,
  profile,
  rim,
  images[]{ alt, asset },
  brand->{ name, "slug": slug.current, relationship }
}`);

export async function getRelatedProducts(params: {
  slug: string;
  brandId: string;
  categoryId: string;
}) {
  "use cache";
  cacheTag("product");
  cacheLife("max");
  return client.fetch(RELATED_PRODUCTS_QUERY, params);
}

/* Brands ------------------------------------------------------------------------ */

export const BRANDS_QUERY = defineQuery(`*[_type == "brand"] | order(relationship asc, displayOrder asc) {
  _id,
  name,
  "slug": slug.current,
  relationship,
  logo,
  description
}`);

export async function getBrands() {
  "use cache";
  cacheTag("brand");
  cacheLife("max");
  return client.fetch(BRANDS_QUERY);
}

export const BRAND_BY_SLUG = defineQuery(`*[_type == "brand" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  relationship,
  logo,
  description,
  seo { title, description },
  "products": *[_type == "product" && references(^._id)] | order(featured desc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    inStock,
    sizeLabelOverride,
    width,
    profile,
    rim,
    images[]{ alt, asset }
  }
}`);

export async function getBrandBySlug(slug: string) {
  "use cache";
  cacheTag(`brand:${slug}`, "brand", "product");
  cacheLife("max");
  return client.fetch(BRAND_BY_SLUG, { slug });
}

/* Categories --------------------------------------------------------------------- */

export const CATEGORY_BY_SLUG = defineQuery(`*[_type == "category" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  description,
  icon,
  seo { title, description },
  "products": *[_type == "product" && references(^._id)] | order(featured desc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    inStock,
    sizeLabelOverride,
    width,
    profile,
    rim,
    images[]{ alt, asset },
    brand->{ name, "slug": slug.current, relationship }
  }
}`);

export async function getCategoryBySlug(slug: string) {
  "use cache";
  cacheTag(`category:${slug}`, "category", "product");
  cacheLife("max");
  return client.fetch(CATEGORY_BY_SLUG, { slug });
}

/* Services --------------------------------------------------------------------------- */

export const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(displayOrder asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  icon,
  seo { title, description }
}`);

export async function getServices() {
  "use cache";
  cacheTag("service");
  cacheLife("max");
  return client.fetch(SERVICES_QUERY);
}

/* Site settings -------------------------------------------------------------------------- */

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  shopName,
  addressLine,
  city,
  phone,
  whatsapp,
  hoursOpen,
  hoursClose,
  openDays,
  closedDay,
  deliveryNote,
  mapLat,
  mapLng,
  mapEmbedUrl,
  googleReviewUrl,
  defaultSeo { title, description }
}`);

export async function getSettings() {
  "use cache";
  cacheTag("settings");
  cacheLife("max");
  return client.fetch(SETTINGS_QUERY);
}

/* Sitemap ------------------------------------------------------------------------------------ */

export const SITEMAP_QUERY = defineQuery(`{
  "products": *[_type == "product"]{ "slug": slug.current, _updatedAt },
  "brands": *[_type == "brand"]{ "slug": slug.current, _updatedAt },
  "categories": *[_type == "category"]{ "slug": slug.current, _updatedAt },
  "services": *[_type == "service"]{ "slug": slug.current, _updatedAt }
}`);

export async function getSitemapData() {
  "use cache";
  cacheTag("product", "brand", "category", "service");
  cacheLife("max");
  return client.fetch(SITEMAP_QUERY);
}
