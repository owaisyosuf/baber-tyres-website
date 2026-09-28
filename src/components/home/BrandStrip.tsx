import Link from "next/link";
import { BrandCard } from "@/components/brand";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui";
import { RELATIONSHIP_GROUPS } from "@/lib/brand";
import { getBrands } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

/**
 * Brand showcase — FR-A3. Grouped by how the shop carries each brand, importers
 * first, then dealers, then the rest, each card carrying its Importer / Dealer /
 * Stocked badge and a link to its own page. The "20+" is the owner's confirmed
 * count; the named brands are whatever is published. Hidden entirely when no
 * brand is published or Sanity cannot be reached.
 */
export async function BrandStrip() {
  let brands;
  try {
    brands = await getBrands();
  } catch (error) {
    console.error("Brands unavailable on the homepage:", error);
    return null;
  }
  if (brands.length === 0) return null;

  return (
    <Section surface>
      <h2 id="home-brands" className="text-h2">
        {siteConfig.brandCountLabel} tyre brands
      </h2>
      <p className="mt-3 mb-8 max-w-[60ch] text-body text-muted">
        Some we import ourselves, some we deal in. Each brand page says which.
      </p>
      <div className="flex flex-col gap-10">
        {RELATIONSHIP_GROUPS.map((group) => {
          const inGroup = brands.filter((brand) => brand.relationship === group.relationship);
          if (inGroup.length === 0) return null;
          return (
            <div key={group.relationship}>
              <h3 className="mb-4 text-label uppercase text-accent">{group.heading}</h3>
              <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {inGroup.map((brand, index) => (
                  <li key={brand._id}>
                    <Reveal index={index} className="h-full">
                      <BrandCard brand={brand} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-body">
        <Link href="/brands" className="text-accent underline underline-offset-4">
          See all brands
        </Link>
      </p>
    </Section>
  );
}
