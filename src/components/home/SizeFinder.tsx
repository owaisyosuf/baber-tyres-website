import { Container, Section } from "@/components/ui";
import { getCategories } from "@/lib/sanity/queries";
import { STANDARD_TYRE_SIZES } from "@/lib/tyre-sizes";
import { SizeFinderForm } from "./SizeFinderForm";
import { rethrowDuringBuild } from "@/lib/build-phase";

/**
 * Homepage size finder — FR-A2. The size selects offer the standard metric
 * sizes rather than only the ones listed online, because the shop stocks far
 * more than it lists; a size with no listing lands on the catalog's empty
 * state, which offers WhatsApp. Vehicle types come from Sanity; if Sanity
 * cannot be reached that select is simply left out.
 */
export async function SizeFinder() {
  let categories: { name: string; slug: string }[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Categories unavailable for the size finder:", error);
  }
  const options = { categories, ...STANDARD_TYRE_SIZES };

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
