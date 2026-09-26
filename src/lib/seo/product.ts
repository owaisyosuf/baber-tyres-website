/**
 * `Product` structured data — FR-B4, design.md §11. Kept free of the Sanity
 * client (images arrive as already-resolved URLs) so it can be unit-tested
 * the same way buildLocalBusinessJsonLd is: no fact is emitted that the
 * product itself doesn't carry (Constitution §II.6).
 */
export interface ProductJsonLdInput {
  name: string;
  slug: string;
  price: number;
  inStock: boolean | null;
  description?: string | null;
  /** Already-resolved Sanity CDN image URLs, largest first. */
  images: readonly string[];
  brand: { name: string } | null;
  category: { name: string } | null;
}

export function buildProductJsonLd(product: ProductJsonLdInput, siteUrl: string) {
  const url = `${siteUrl}/tyres/${product.slug}`;
  // Stock defaults to true in Studio, so a document that never set it is in stock.
  const inStock = product.inStock !== false;
  const description = product.description?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    url,
    sku: product.slug,
    ...(product.images.length > 0 && { image: [...product.images] }),
    ...(description && { description }),
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand.name } }),
    ...(product.category && { category: product.category.name }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price: product.price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}
