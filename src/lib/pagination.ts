export type PageItem = number | "gap";

/**
 * The page numbers to show in a pager: always the first and last page and the
 * current page with a neighbour on each side, with a "gap" where pages are
 * skipped. A gap that would hide just one page shows that page instead, so the
 * pager never says "…" for a single number.
 */
export function pageItems(current: number, total: number): PageItem[] {
  if (total <= 1) return [1];

  const wanted = new Set(
    [1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total),
  );
  const pages = [...wanted].sort((a, b) => a - b);

  const items: PageItem[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined) {
      if (page - previous === 2) items.push(previous + 1);
      else if (page - previous > 2) items.push("gap");
    }
    items.push(page);
  });
  return items;
}
