import Link from "next/link";
import { ChevronIcon } from "@/components/icons";

export interface BreadcrumbItem {
  label: string;
  /** Omitted (or on the last item) renders as plain text — the current page. */
  href?: string;
}

/** design.md §8: breadcrumb navigation on the product (and later brand/category) pages. */
export function Breadcrumb({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-text" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronIcon direction="right" size={12} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
