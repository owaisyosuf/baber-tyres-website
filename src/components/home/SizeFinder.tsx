import { Container, Section } from "@/components/ui";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { getFilterOptions } from "@/lib/sanity/queries";
import { STANDARD_TYRE_SIZES } from "@/lib/tyre-sizes";
import { SizeFinderForm } from "./SizeFinderForm";
import { rethrowDuringBuild } from "@/lib/build-phase";

/**
 * Homepage size finder — FR-A2. The size selects offer the standard metric
 * sizes, the same ones as the catalog filter; a size with no listing lands on
 * the catalog's empty state, which offers WhatsApp. Vehicle types come from
 * Sanity; if Sanity cannot be reached that select is simply left out.
 *
 * Only car and SUV / 4x4 sizes fit the width/profile/rim selects. Truck, LT,
 * forklift and off-road sizes ("11R22.5", "7.00-12", "31x10.50 R15") go
 * through the header search instead, which the copy below points to.
 */
const FINDER_CATEGORY_SLUGS = ["car", "suv"];

export async function SizeFinder() {
  let options;
  try {
    const all = await getFilterOptions();
    options = {
      ...all,
      categories: all.categories.filter((category) =>
        FINDER_CATEGORY_SLUGS.includes(category.slug ?? ""),
      ),
    };
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Filter options unavailable for the size finder:", error);
    options = { categories: [], ...STANDARD_TYRE_SIZES };
  }

  return (
    <Section as="div">
      <Container>
        <section
          aria-labelledby="size-finder-heading"
          className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-6 sm:p-10"
        >
          <h2 id="size-finder-heading" className="text-h2">
            Find your tyre size
          </h2>
          <p className="mt-3 mb-6 max-w-[52ch] text-body text-muted">
            For car, SUV and 4x4 tyres: pick your size and we will show you what matches.
          </p>
          <SizeFinderForm options={options} />
          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-3 text-body text-muted">
              Truck, LT, forklift or off-road tyre (like 11R22.5, 7.00-12 or 31x10.50 R15)? Type
              the size here:
            </p>
            <SiteSearch className="w-full" />
          </div>
        </section>
      </Container>
    </Section>
  );
}
