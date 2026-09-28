import Link from "next/link";
import { ProductGrid } from "@/components/product";
import { Section } from "@/components/ui";
import { CATALOG_PATH } from "@/lib/filters";
import { getHomepageData } from "@/lib/sanity/queries";

/**
 * Featured products row — FR-A4, driven by the `featured` flag in Studio. With
 * nothing flagged (or Sanity unreachable) the whole section is left out rather
 * than showing an empty heading.
 */
export async function FeaturedProducts() {
  let products;
  try {
    products = (await getHomepageData()).featuredProducts;
  } catch (error) {
    console.error("Featured products unavailable on the homepage:", error);
    return null;
  }
  if (products.length === 0) return null;

  return (
    <Section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 id="home-featured" className="text-h2">
          Featured tyres
        </h2>
        <Link href={CATALOG_PATH} className="text-body text-accent underline underline-offset-4">
          See all tyres
        </Link>
      </div>
      <div aria-labelledby="home-featured" role="region">
        <ProductGrid products={products} headingLevel="h3" />
      </div>
    </Section>
  );
}
