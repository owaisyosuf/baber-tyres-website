import { describe, expect, it } from "vitest";
import { trustStripItems } from "./trust";

const base = {
  brandCountLabel: "20+",
  importerNames: ["Yokohama", "Michelin", "Rapid", "Duhow"],
  city: "Karachi",
  addressLine: "M.A. Jinnah Road",
};

describe("trustStripItems", () => {
  it("gives brands, direct importer, and the place — with no importer count", () => {
    expect(trustStripItems(base)).toEqual([
      { value: "20+", label: "Brands" },
      { value: "Direct Importer", label: "Yokohama, Michelin & more" },
      { value: "Karachi", label: "M.A. Jinnah Road" },
    ]);
  });

  it("names the only importer when just one is published", () => {
    const items = trustStripItems({ ...base, importerNames: ["Yokohama"] });
    expect(items[1]).toEqual({ value: "Direct Importer", label: "Yokohama & more" });
  });

  it("leaves out the importer stat when no importer brand is published", () => {
    const items = trustStripItems({ ...base, importerNames: [] });
    expect(items.map((item) => item.label)).toEqual(["Brands", "M.A. Jinnah Road"]);
  });
});
