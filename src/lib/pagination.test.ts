import { describe, expect, it } from "vitest";
import { pageItems } from "./pagination";

describe("pageItems", () => {
  it("shows a single page as just 1", () => {
    expect(pageItems(1, 1)).toEqual([1]);
    expect(pageItems(1, 0)).toEqual([1]);
  });

  it("lists every page when there are few", () => {
    expect(pageItems(1, 2)).toEqual([1, 2]);
    expect(pageItems(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses a long run behind a gap at the far end", () => {
    expect(pageItems(1, 20)).toEqual([1, 2, "gap", 20]);
    expect(pageItems(2, 20)).toEqual([1, 2, 3, "gap", 20]);
  });

  it("keeps the first and last page and gaps on both sides in the middle", () => {
    expect(pageItems(10, 20)).toEqual([1, "gap", 9, 10, 11, "gap", 20]);
  });

  it("collapses a long run at the near end", () => {
    expect(pageItems(20, 20)).toEqual([1, "gap", 19, 20]);
    expect(pageItems(19, 20)).toEqual([1, "gap", 18, 19, 20]);
  });

  it("shows the page itself instead of a gap that would hide only one", () => {
    expect(pageItems(4, 20)).toEqual([1, 2, 3, 4, 5, "gap", 20]);
    expect(pageItems(17, 20)).toEqual([1, "gap", 16, 17, 18, 19, 20]);
  });

  it("always includes the current page and never repeats or reorders pages", () => {
    for (let total = 1; total <= 30; total++) {
      for (let current = 1; current <= total; current++) {
        const items = pageItems(current, total);
        const numbers = items.filter((item): item is number => item !== "gap");
        expect(numbers).toContain(current);
        expect(numbers).toContain(1);
        expect(numbers).toContain(total);
        expect(new Set(numbers).size).toBe(numbers.length);
        expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
        // A gap always hides at least two pages.
        items.forEach((item, index) => {
          if (item === "gap") {
            const before = items[index - 1] as number;
            const after = items[index + 1] as number;
            expect(after - before).toBeGreaterThan(2);
          }
        });
      }
    }
  });
});
