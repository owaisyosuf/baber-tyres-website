import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseCatalogSearchParams } from "@/lib/filters";
import { SizeFinderForm } from "./SizeFinderForm";

const options = {
  categories: [
    { name: "Car", slug: "car" },
    { name: "Truck / Commercial", slug: "truck" },
  ],
  widths: [185, 195],
  profiles: [60, 65],
  rims: [15, 22.5],
};

const html = () => renderToStaticMarkup(createElement(SizeFinderForm, { options }));

describe("SizeFinderForm", () => {
  it("is a plain GET form to the catalog, so it works without JavaScript", () => {
    const markup = html();
    expect(markup).toMatch(/<form[^>]*method="get"/);
    expect(markup).toMatch(/<form[^>]*action="\/tyres"/);
    expect(markup).toContain('type="submit"');
    expect(markup).not.toContain("<script");
  });

  it("names its fields exactly as the catalog URL contract does", () => {
    const markup = html();
    for (const name of ["category", "width", "profile", "rim"]) {
      expect(markup).toContain(`name="${name}"`);
    }
  });

  it("offers each option, plus an empty choice on every select", () => {
    const markup = html();
    expect(markup).toContain('value="185"');
    expect(markup).toContain('value="22.5"');
    expect(markup).toContain('value="truck"');
    expect(markup.match(/<option value="">/g)).toHaveLength(4);
  });

  it("explains where to read the size on the sidewall", () => {
    expect(html()).toMatch(/sidewall/i);
  });

  it("leaves out the vehicle-type select when there are no categories", () => {
    const markup = renderToStaticMarkup(
      createElement(SizeFinderForm, { options: { ...options, categories: [] } }),
    );
    expect(markup).not.toContain('name="category"');
  });
});

describe("what the form submits is understood by the catalog", () => {
  it("applies the chosen fields and drops the ones left on Any", () => {
    const submitted = new URLSearchParams("category=&width=185&profile=65&rim=15");
    expect(parseCatalogSearchParams(submitted).filters).toEqual({
      width: 185,
      profile: 65,
      rim: 15,
    });
  });

  it("applies a vehicle type on its own", () => {
    const submitted = new URLSearchParams("category=truck&width=&profile=&rim=");
    expect(parseCatalogSearchParams(submitted).filters).toEqual({ categorySlug: "truck" });
  });
});
