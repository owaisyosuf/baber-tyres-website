import { Container, Section } from "@/components/ui";
import { getFilterOptions } from "@/lib/sanity/queries";
import { STANDARD_TYRE_SIZES } from "@/lib/tyre-sizes";
import { SizeFinderForm } from "./SizeFinderForm";
import { rethrowDuringBuild } from "@/lib/build-phase";

/**
 * Homepage size finder — FR-A2. The size selects offer the standard metric
 * sizes, the same ones as the catalog filter; a size with no listing lands on
 * the catalog's empty state, which offers WhatsApp. Vehicle types come from
 * Sanity; if Sanity cannot be reached that select is simply left out.
 */
export async function SizeFinder() {
  let options;
  try {
    options = await getFilterOptions();
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
            Pick your size and vehicle type and we will show you what matches.
          </p>
          <SizeFinderForm options={options} />
        </section>
      </Container>
    </Section>
  );
}
