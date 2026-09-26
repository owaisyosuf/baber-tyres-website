import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import { CATALOG_PATH } from "@/lib/filters";
import { activeFilterChips, type FilterLabels } from "@/lib/filter-chips";
import type { ProductFilters } from "@/lib/sanity/queries";

/**
 * The active filters as removable amber-outlined chips with "Clear all" —
 * FR-B2. Each chip is a plain link to the catalog URL without that one
 * filter, so it needs no JavaScript and works with back/forward. Renders
 * nothing when no filter is active.
 */
export function FilterChips({
  filters,
  labels,
}: {
  filters: ProductFilters;
  labels: FilterLabels;
}) {
  const chips = activeFilterChips(filters, labels);
  if (chips.length === 0) return null;

  return (
    <ul role="list" aria-label="Active filters" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={chip.href}
            scroll={false}
            aria-label={`Remove filter: ${chip.label}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-accent px-3 text-small font-semibold text-accent transition-colors duration-150 ease-out-soft hover:bg-accent hover:text-background"
          >
            {chip.label}
            <CloseIcon size={16} />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={CATALOG_PATH}
          scroll={false}
          className="inline-flex min-h-11 items-center rounded-md px-2 text-small font-semibold text-muted underline-offset-4 transition-colors duration-150 ease-out-soft hover:text-accent hover:underline"
        >
          Clear all
        </Link>
      </li>
    </ul>
  );
}
