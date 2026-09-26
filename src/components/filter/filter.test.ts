import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FilterChips } from "./FilterChips";
import { FilterFields, type FilterOptions } from "./FilterFields";
import { EMPTY_RAW } from "./raw";
import { ResultCount } from "./ResultCount";

const options: FilterOptions = {
  brands: [
    { name: "Yokohama", slug: "yokohama", relationship: "importer" },
    { name: "Dunlop", slug: "dunlop", relationship: "dealer" },
  ],
  categories: [
    { name: "Car", slug: "car" },
    { name: "Truck / Commercial", slug: "truck" },
  ],
  widths: [185, 195],
  profiles: [65],
  rims: [15, 22.5],
};

const noop = () => {};
const fields = (raw = EMPTY_RAW, extra: Partial<Parameters<typeof FilterFields>[0]> = {}) =>
  renderToStaticMarkup(
    createElement(FilterFields, {
      idPrefix: "t",
      options,
      raw,
      onToggleBrand: noop,
      onCategory: noop,
      onSize: noop,
      onPrice: noop,
      onPriceCommit: noop,
      ...extra,
    }),
  );

describe("FilterFields", () => {
  it("groups the controls in labelled fieldsets", () => {
    const markup = fields();
    for (const legend of ["Brand", "Vehicle type", "Size", "Price (PKR)"]) {
      expect(markup).toContain(`>${legend}</legend>`);
    }
    expect(markup.match(/<fieldset/g)).toHaveLength(4);
  });

  it("offers every brand as a checkbox and every category as a radio, plus 'All vehicles'", () => {
    const markup = fields();
    expect(markup.match(/type="checkbox"/g)).toHaveLength(2);
    expect(markup.match(/type="radio"/g)).toHaveLength(3);
    expect(markup).toContain("All vehicles");
    expect(markup).toContain("Yokohama");
    expect(markup).toContain("Truck / Commercial");
  });

  it("reflects the current selection", () => {
    const markup = fields({
      ...EMPTY_RAW,
      brands: ["dunlop"],
      category: "truck",
      width: "185",
      min: "5000",
    });
    expect(markup.match(/checked=""/g)).toHaveLength(2);
    expect(markup).toContain('value="5000"');
  });

  it("ties every select and price input to a visible label", () => {
    const markup = fields();
    for (const name of ["width", "profile", "rim", "min", "max"]) {
      expect(markup).toContain(`for="t-${name}"`);
      expect(markup).toContain(`id="t-${name}"`);
    }
  });

  it("uses only the size choices that exist, with an 'Any' option", () => {
    const markup = fields();
    expect(markup.match(/<option value=""[^>]*>Any<\/option>/g)).toHaveLength(3);
    expect(markup).toContain('<option value="22.5">22.5</option>');
    expect(markup).not.toContain('<option value="190">');
  });

  it("keeps a size that arrived by URL visible even if it is not in the list", () => {
    // It is added to the list and is the selected option.
    expect(fields({ ...EMPTY_RAW, width: "190" })).toContain(
      '<option value="190" selected="">190</option>',
    );
  });

  it("makes ids unique per instance, so the sidebar and the sheet can both render it", () => {
    const sheet = fields(EMPTY_RAW, { idPrefix: "sheet" });
    expect(sheet).toContain('id="sheet-width"');
    expect(sheet).not.toContain('id="t-width"');
  });

  it("uses a numeric keypad and tabular digits for prices", () => {
    const markup = fields();
    expect(markup).toContain('inputMode="numeric"');
    expect(markup).toContain("tabular");
  });

  it("omits a group entirely when there is nothing to choose", () => {
    const markup = fields(EMPTY_RAW, { options: { ...options, brands: [], categories: [] } });
    expect(markup).not.toContain(">Brand</legend>");
    expect(markup).not.toContain(">Vehicle type</legend>");
  });
});

describe("FilterChips", () => {
  const labels = { brands: options.brands, categories: options.categories };
  const render = (filters: Parameters<typeof FilterChips>[0]["filters"]) =>
    renderToStaticMarkup(createElement(FilterChips, { filters, labels }));

  it("renders nothing when no filter is active", () => {
    expect(render({})).toBe("");
  });

  it("renders each chip as a link that names what it removes", () => {
    const markup = render({ brandSlugs: ["yokohama"], width: 185 });
    expect(markup).toContain('aria-label="Remove filter: Yokohama"');
    expect(markup).toContain('aria-label="Remove filter: Width 185"');
    expect(markup).toContain('href="/tyres?width=185"');
    expect(markup).toContain('href="/tyres?brand=yokohama"');
  });

  it("offers Clear all, pointing at the plain catalog", () => {
    const markup = render({ categorySlug: "car" });
    expect(markup).toContain("Clear all");
    expect(markup).toContain('href="/tyres"');
  });
});

describe("ResultCount", () => {
  const render = (count: number) => renderToStaticMarkup(createElement(ResultCount, { count }));

  it("is a polite live region", () => {
    const markup = render(5);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
  });

  it("words the count for zero, one, and many", () => {
    expect(render(0)).toContain("No tyres match these filters");
    expect(render(1)).toContain("1 tyre<");
    expect(render(24)).toContain("24 tyres");
  });
});
