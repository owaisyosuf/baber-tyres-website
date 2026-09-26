import { FilterChips, FilterPanel, ResultCount, type FilterOptions } from "@/components/filter";
import { ProductGrid, type ProductCardProduct } from "@/components/product";
import { countActiveFilters } from "@/lib/filters";
import type { ProductFilters } from "@/lib/sanity/queries";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

interface CatalogViewProps {
  filters: ProductFilters;
  options: FilterOptions;
  products: readonly (ProductCardProduct & { _id: string })[];
  /** Every product matching the filters, across all pages. */
  total: number;
  page: number;
  pageSize: number;
  whatsappHref: string;
}

/** How many leading cards load their image eagerly — the first row on a wide screen. */
const PRIORITY_CARDS = 4;

/**
 * The catalog: filter panel, active-filter chips, result count, the product
 * grid (or the empty state), and pagination. Purely presentational, so the
 * page decides what to fetch and this decides how it reads.
 */
export function CatalogView({
  filters,
  options,
  products,
  total,
  page,
  pageSize,
  whatsappHref,
}: CatalogViewProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <FilterPanel options={options} filters={filters} resultCount={total} />
      <div className="mt-6 flex min-w-0 flex-col gap-4 lg:mt-0">
        <FilterChips filters={filters} labels={options} />
        <ResultCount count={total} />
        {products.length > 0 ? (
          <ProductGrid products={products} headingLevel="h2" priorityCount={PRIORITY_CARDS} />
        ) : (
          <EmptyState filtered={countActiveFilters(filters) > 0} whatsappHref={whatsappHref} />
        )}
        <Pagination filters={filters} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
