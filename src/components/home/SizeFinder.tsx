import { Container, Section } from "@/components/ui";
import { getFilterOptions } from "@/lib/sanity/queries";
import { SizeFinderForm } from "./SizeFinderForm";

/**
 * Homepage size finder — FR-A2. The options are the sizes that exist among
 * published products, so the selects never offer a size nobody stocks. If
 * Sanity cannot be reached the section is left out; the hero's Browse Tyres
 * button still leads to the catalog.
 */
export async function SizeFinder() {
  let options;
  try {
    options = await getFilterOptions();
  } catch (error) {
    console.error("Filter options unavailable for the size finder:", error);
    return null;
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
