import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";

let ProductGallery: typeof import("./ProductGallery").ProductGallery;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproj";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  ({ ProductGallery } = await import("./ProductGallery"));
});

describe("ProductGallery", () => {
  it("falls back to the product name over the tread pattern when there are no images", () => {
    // A product with no photo yet (NFR-12) reaches the page with no images; the page
    // passes `[]`, and the gallery must render rather than throw.
    const markup = renderToStaticMarkup(
      createElement(ProductGallery, { images: [], productName: "Dunlop 195/65 R15" }),
    );
    expect(markup).toContain("Dunlop 195/65 R15");
    expect(markup).not.toContain("<img");
    expect(markup).not.toContain('aria-label="Product images"');
  });
});
