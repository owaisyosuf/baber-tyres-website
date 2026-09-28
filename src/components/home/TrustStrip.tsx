import { Container } from "@/components/ui";
import { getBrands } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { siteConfig } from "@/lib/site";
import { trustStripItems } from "@/lib/trust";

/**
 * Numeric trust strip — FR-A2. Sits under the hero as three plain facts. If
 * Sanity cannot be reached the importer count is dropped rather than guessed.
 */
export async function TrustStrip() {
  const settings = await getShopSettings();

  let importerCount = 0;
  try {
    const brands = await getBrands();
    importerCount = brands.filter((brand) => brand.relationship === "importer").length;
  } catch (error) {
    console.error("Brands unavailable for the trust strip:", error);
  }

  const items = trustStripItems({
    brandCountLabel: siteConfig.brandCountLabel,
    importerCount,
    city: settings.city,
    addressLine: settings.addressLine,
  });

  return (
    <section aria-label="At a glance" className="border-y border-border bg-surface">
      <Container>
        <dl className="grid grid-cols-1 divide-y divide-border sm:grid-flow-col sm:auto-cols-fr sm:divide-x sm:divide-y-0">
          {items.map((item) => (
            // The term comes first in the source (a <dl> needs that) and is shown
            // under the figure.
            <div
              key={item.label}
              className="flex flex-col-reverse items-center gap-1 px-4 py-6 text-center"
            >
              <dt className="text-small text-muted">{item.label}</dt>
              <dd className="font-display text-h2 text-accent">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
