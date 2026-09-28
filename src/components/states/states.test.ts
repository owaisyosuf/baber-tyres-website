import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

const shopSettings = vi.hoisted(() => ({ getShopSettings: vi.fn() }));
vi.mock("@/lib/sanity/settings", () => shopSettings);

let Unavailable: typeof import("./Unavailable").Unavailable;
let skeletons: typeof import("@/components/skeleton/Skeletons");

beforeAll(async () => {
  const { resolveSettings } = await import("@/lib/settings");
  shopSettings.getShopSettings.mockResolvedValue(resolveSettings(null));
  ({ Unavailable } = await import("./Unavailable"));
  skeletons = await import("@/components/skeleton/Skeletons");
});

describe("Unavailable", () => {
  it("says what could not load and keeps WhatsApp and call working", async () => {
    const markup = renderToStaticMarkup(await Unavailable({ what: "this tyre" }));
    expect(markup).toContain('role="alert"');
    expect(markup).toMatch(/could not load\s*(<!-- -->)?this tyre/);
    expect(markup).toContain("https://wa.me/");
    expect(markup).toContain('href="tel:+');
    expect(markup).toContain('href="/tyres"');
  });
});

describe("loading skeletons", () => {
  const all = [
    ["catalog", () => createElement(skeletons.CatalogSkeleton)],
    ["product grid", () => createElement(skeletons.ProductGridSkeleton)],
    ["brands", () => createElement(skeletons.BrandGridSkeleton)],
    ["services", () => createElement(skeletons.ServiceListSkeleton)],
    ["product page", () => createElement(skeletons.ProductPageSkeleton)],
    ["landing page", () => createElement(skeletons.LandingPageSkeleton, { label: "Loading brand" })],
  ] as const;

  it.each(all)("%s skeleton is announced once and never animates", (_name, make) => {
    const markup = renderToStaticMarkup(make());
    expect(markup).toContain('role="status"');
    expect(markup).toMatch(/class="sr-only">Loading/);
    // Constitution §IV: nothing loops, so no pulse or shimmer.
    expect(markup).not.toMatch(/animate-|shimmer|pulse/);
  });

  it("uses the product grid's own columns so the swap does not shift the page", () => {
    const markup = renderToStaticMarkup(createElement(skeletons.ProductGridSkeleton));
    expect(markup).toContain("sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4");
  });
});
