import type { MetadataRoute } from "next";

/**
 * The sitemap's entries — FR-G3, T032. Every published product, brand, and
 * category has its own URL; services live on the one /services page, so they
 * only feed its last-modified date. Static pages are listed by hand because
 * they are code, not content. Filtered and paged catalog views are left out on
 * purpose: they all canonicalize to /tyres.
 *
 * Kept free of the Sanity client so it can be unit-tested.
 */
interface SitemapDoc {
  slug: string | null;
  _updatedAt: string;
}

export interface SitemapData {
  products: readonly SitemapDoc[];
  brands: readonly SitemapDoc[];
  categories: readonly SitemapDoc[];
  services: readonly SitemapDoc[];
}

const latest = (docs: readonly { _updatedAt: string }[]): Date | undefined => {
  const times = docs.map((doc) => new Date(doc._updatedAt).getTime()).filter(Number.isFinite);
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
};

function documentEntries(
  docs: readonly SitemapDoc[],
  basePath: string,
  siteUrl: string,
): MetadataRoute.Sitemap {
  return docs
    .filter((doc): doc is SitemapDoc & { slug: string } => Boolean(doc.slug))
    .map((doc) => ({
      url: `${siteUrl}${basePath}/${doc.slug}`,
      lastModified: new Date(doc._updatedAt),
    }));
}

export function buildSitemapEntries(data: SitemapData, siteUrl: string): MetadataRoute.Sitemap {
  const everything = [...data.products, ...data.brands, ...data.categories, ...data.services];

  return [
    { url: siteUrl, lastModified: latest(everything) },
    { url: `${siteUrl}/tyres`, lastModified: latest(data.products) },
    { url: `${siteUrl}/brands`, lastModified: latest(data.brands) },
    { url: `${siteUrl}/services`, lastModified: latest(data.services) },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/contact` },
    ...documentEntries(data.brands, "/brands", siteUrl),
    ...documentEntries(data.categories, "/categories", siteUrl),
    ...documentEntries(data.products, "/tyres", siteUrl),
  ];
}
