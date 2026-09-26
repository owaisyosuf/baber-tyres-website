"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon, FilterIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { buildCatalogQuery, catalogHref, countActiveFilters } from "@/lib/filters";
import type { ProductFilters } from "@/lib/sanity/queries";
import { FilterFields, type FilterOptions } from "./FilterFields";
import { EMPTY_RAW, filtersToRaw, rawToFilters, type RawFilters } from "./raw";

interface FilterPanelProps {
  options: FilterOptions;
  /** The filters currently in the URL, parsed on the server. */
  filters: ProductFilters;
  /** How many products the current filters match, for the sheet's button. */
  resultCount: number;
}

/** How long to wait after the last keystroke in a price box before applying it. */
const PRICE_DEBOUNCE_MS = 500;

/**
 * The catalog filter — FR-B2. The URL is the single source of truth: every
 * change pushes a new catalog URL and the server re-renders the results, so a
 * filtered page is shareable and back/forward just work. Desktop shows a
 * sticky sidebar; below `lg` the same controls live in a full-height bottom
 * sheet on a native modal <dialog>, which supplies the focus trap, Esc to
 * close, and focus restoration.
 */
export function FilterPanel({ options, filters, resultCount }: FilterPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const priceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleId = useId();

  const urlKey = buildCatalogQuery(filters);
  const [raw, setRaw] = useState<RawFilters>(() => filtersToRaw(filters));
  const [syncedKey, setSyncedKey] = useState(urlKey);
  const [pushedKey, setPushedKey] = useState<string | null>(null);

  // When the URL changes under us, the form follows it — back and forward
  // included. The one exception is the echo of a change this panel just
  // pushed itself: resetting then would overwrite whatever has been typed
  // since.
  if (urlKey !== syncedKey) {
    setSyncedKey(urlKey);
    if (urlKey === pushedKey) {
      setPushedKey(null);
    } else {
      setRaw(filtersToRaw(filters));
    }
  }

  useEffect(() => () => clearTimeout(priceTimer.current), []);

  const commit = (next: RawFilters) => {
    clearTimeout(priceTimer.current);
    setRaw(next);
    const nextFilters = rawToFilters(next);
    const nextKey = buildCatalogQuery(nextFilters);
    if (nextKey === urlKey) return;
    setPushedKey(nextKey);
    startTransition(() => router.push(catalogHref(nextFilters), { scroll: false }));
  };

  const onToggleBrand = (slug: string, checked: boolean) =>
    commit({
      ...raw,
      brands: checked ? [...raw.brands, slug] : raw.brands.filter((other) => other !== slug),
    });
  const onCategory = (category: string) => commit({ ...raw, category });
  const onSize = (field: "width" | "profile" | "rim", value: string) =>
    commit({ ...raw, [field]: value });

  const onPrice = (field: "min" | "max", value: string) => {
    const next = { ...raw, [field]: value };
    setRaw(next);
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => commit(next), PRICE_DEBOUNCE_MS);
  };
  // Applying what was typed (blur or Enter) also tidies the boxes to what was
  // actually accepted, so a value that could not be a filter does not linger.
  const commitTyped = () => commit(filtersToRaw(rawToFilters(raw)));

  const clearAll = () => commit(EMPTY_RAW);

  const activeCount = countActiveFilters(filters);
  const openSheet = () => dialogRef.current?.showModal();
  const closeSheet = () => dialogRef.current?.close();

  const fields = (idPrefix: string) => (
    <FilterFields
      idPrefix={idPrefix}
      options={options}
      raw={raw}
      onToggleBrand={onToggleBrand}
      onCategory={onCategory}
      onSize={onSize}
      onPrice={onPrice}
      onPriceCommit={commitTyped}
    />
  );

  return (
    <>
      {/* Below lg: a trigger pinned under the header, and the sheet. */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <Button
          variant="secondary"
          icon={<FilterIcon />}
          aria-haspopup="dialog"
          onClick={openSheet}
        >
          {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 text-text backdrop:bg-background/80 open:flex open:animate-sheet-up open:flex-col"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 id={titleId} className="font-display text-h3">
            Filters
          </h2>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close filters"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text transition-colors duration-150 ease-out-soft hover:text-accent"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          aria-busy={isPending}
          onSubmit={(event) => {
            event.preventDefault();
            commitTyped();
          }}
          className="flex-1 overflow-y-auto p-4"
        >
          {fields("sheet")}
        </form>

        <div className="flex shrink-0 gap-3 border-t border-border bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <Button
            variant="secondary"
            onClick={clearAll}
            aria-label="Clear all filters"
            className="flex-1"
          >
            Clear
          </Button>
          <Button variant="primary" onClick={closeSheet} className="flex-[2]">
            {`Show ${resultCount} ${resultCount === 1 ? "result" : "results"}`}
          </Button>
        </div>
      </dialog>

      {/* From lg: the sticky sidebar. */}
      <aside
        aria-label="Filters"
        aria-busy={isPending}
        className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-h3">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="min-h-11 rounded-md px-2 text-small font-semibold text-muted transition-colors duration-150 ease-out-soft hover:text-accent"
            >
              Clear all
            </button>
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            commitTyped();
          }}
        >
          {fields("sidebar")}
        </form>
      </aside>
    </>
  );
}
