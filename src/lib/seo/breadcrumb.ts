/**
 * `BreadcrumbList` structured data — FR-G2. Mirrors the visible breadcrumb on
 * the product, brand, and category pages, and gives the catalog its
 * Home > Tyres trail. Positions start at 1, and every item carries an absolute
 * URL.
 */
export interface BreadcrumbTrailItem {
  name: string;
  /** Path on this site, e.g. "/tyres". */
  path: string;
}

export function buildBreadcrumbJsonLd(items: readonly BreadcrumbTrailItem[], siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
