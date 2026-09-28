import { describe, expect, it } from "vitest";
import { trustStripItems } from "./trust";

const base = {
  brandCountLabel: "20+",
  importerCount: 4,
  city: "Karachi",
  addressLine: "M.A. Jinnah Road",
};

describe("trustStripItems", () => {
  it("gives brands, imported directly, and the place", () => {
    expect(trustStripItems(base)).toEqual([
      { value: "20+", label: "Brands" },
      { value: "4", label: "Imported directly" },
      { value: "Karachi", label: "M.A. Jinnah Road" },
    ]);
  });

  it("leaves out the importer stat when no importer brand is published", () => {
    const items = trustStripItems({ ...base, importerCount: 0 });
    expect(items.map((item) => item.label)).toEqual(["Brands", "M.A. Jinnah Road"]);
  });
});
