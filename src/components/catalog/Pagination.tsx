import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
import { catalogHref } from "@/lib/filters";
import { pageItems } from "@/lib/pagination";
import type { ProductFilters } from "@/lib/sanity/queries";

interface PaginationProps {
  filters: ProductFilters;
  page: number;
  totalPages: number;
}

const itemClassName =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md px-3 text-body font-semibold transition-colors duration-150 ease-out-soft";
const linkClassName = `${itemClassName} border border-border text-text hover:border-accent hover:text-accent`;
const currentClassName = `${itemClassName} bg-accent text-background`;
const disabledClassName = `${itemClassName} border border-border text-muted opacity-40`;

/**
 * Page links for a catalog longer than one page — FR-B1. Every link keeps the
 * active filters and points at a real URL, so paging is shareable and needs
 * no JavaScript. On phones the numbers collapse to "Page X of Y" between
 * Previous and Next, which fits a 360px screen; from `sm` the numbers show.
 */
export function Pagination({ filters, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-2 sm:justify-center">
      {hasPrevious ? (
        <Link
          href={catalogHref(filters, page - 1)}
          rel="prev"
          aria-label="Previous page"
          className={linkClassName}
        >
          <ChevronIcon direction="left" size={20} />
          <span className="sm:sr-only">Previous</span>
        </Link>
      ) : (
        <span aria-hidden className={disabledClassName}>
          <ChevronIcon direction="left" size={20} />
          <span className="sm:sr-only">Previous</span>
        </span>
      )}

      <p className="tabular text-small text-muted sm:hidden">
        Page {page} of {totalPages}
      </p>

      <ul role="list" className="hidden items-center gap-2 sm:flex">
        {pageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span aria-current="page" aria-label={`Page ${item}, current page`} className={`tabular ${currentClassName}`}>
                  {item}
                </span>
              ) : (
                <Link
                  href={catalogHref(filters, item)}
                  aria-label={`Page ${item}`}
                  className={`tabular ${linkClassName}`}
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ul>

      {hasNext ? (
        <Link
          href={catalogHref(filters, page + 1)}
          rel="next"
          aria-label="Next page"
          className={linkClassName}
        >
          <span className="sm:sr-only">Next</span>
          <ChevronIcon direction="right" size={20} />
        </Link>
      ) : (
        <span aria-hidden className={disabledClassName}>
          <span className="sm:sr-only">Next</span>
          <ChevronIcon direction="right" size={20} />
        </span>
      )}
    </nav>
  );
}
