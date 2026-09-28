import type { ReactNode } from "react";
import { Card, Container, Skeleton } from "@/components/ui";

/**
 * Loading skeletons shaped like the final layouts, so content arriving does
 * not shift the page (design.md §13). Each sits in a `role="status"` region
 * with screen-reader text; the blocks themselves are decorative and still.
 */

function LoadingRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Matches ProductCard: 4:3 image, brand line, name, size, price, stock, button. */
function ProductCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="mt-2 h-11 w-full" />
      </div>
    </Card>
  );
}

/** The product grid's columns, so the skeleton and the grid line up. */
export function ProductGridSkeleton({ count = 8, label = "Loading tyres" }: { count?: number; label?: string }) {
  return (
    <LoadingRegion label={label}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </LoadingRegion>
  );
}

/** Catalog: result count line, then the grid. */
export function CatalogSkeleton() {
  return (
    <LoadingRegion label="Loading tyres">
      <Skeleton className="mb-6 h-5 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </LoadingRegion>
  );
}

/** /brands: cards of logo box and name row. */
export function BrandGridSkeleton() {
  return (
    <LoadingRegion label="Loading brands">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
        {Array.from({ length: 8 }, (_, index) => (
          <Card key={index} className="flex flex-col gap-4 p-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </Card>
        ))}
      </div>
    </LoadingRegion>
  );
}

/** /services: one wide card per service. */
export function ServiceListSkeleton() {
  return (
    <LoadingRegion label="Loading services">
      <div className="flex flex-col gap-6" aria-hidden>
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} className="flex gap-6 p-6 sm:p-10">
            <Skeleton className="h-14 w-14 shrink-0" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full max-w-[60ch]" />
              <Skeleton className="h-11 w-32" />
            </div>
          </Card>
        ))}
      </div>
    </LoadingRegion>
  );
}

/** Brand and category pages: header block, then a product grid. */
export function LandingPageSkeleton({ label }: { label: string }) {
  return (
    <Container className="py-8 md:py-12">
      <LoadingRegion label={label}>
        <div aria-hidden>
          <Skeleton className="h-4 w-48" />
          <div className="mt-6 flex flex-col gap-4">
            <Skeleton className="h-14 w-14" />
            <Skeleton className="h-10 w-2/3 max-w-md" />
            <Skeleton className="h-5 w-full max-w-[60ch]" />
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </LoadingRegion>
    </Container>
  );
}

/** Product page: breadcrumb, then gallery beside the details. */
export function ProductPageSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      <LoadingRegion label="Loading tyre details">
        <div aria-hidden>
          <Skeleton className="h-4 w-56" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-11 w-56" />
              <Skeleton className="mt-4 h-32 w-full" />
            </div>
          </div>
        </div>
      </LoadingRegion>
    </Container>
  );
}
