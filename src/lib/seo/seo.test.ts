import { describe, expect, it } from "vitest";
import { buildBreadcrumbJsonLd } from "./breadcrumb";
import { socialMetadata } from "./metadata";
import { buildSitemapEntries, type SitemapData } from "./sitemap";

const site = "https://example.pk";
const doc = (slug: string | null, updated = "2026-09-01T00:00:00Z") => ({
  slug,
  _updatedAt: updated,
});

const data: SitemapData = {
  products: [doc("dunlop-195", "2026-09-10T00:00:00Z"), doc("rapid-11r22-5")],
  brands: [doc("yokohama"), doc("dunlop", "2026-09-05T00:00:00Z")],
  categories: [doc("car"), doc("truck")],
  services: [doc("tyre-fitting", "2026-09-02T00:00:00Z")],
};

describe("buildSitemapEntries", () => {
  const urls = buildSitemapEntries(data, site).map((entry) => entry.url);

  it("lists the static pages", () => {
    for (const path of ["", "/tyres", "/brands", "/services", "/about", "/contact"]) {
      expect(urls).toContain(`${site}${path}`);
    }
  });

  it("lists every published product, brand and category", () => {
    expect(urls).toContain(`${site}/tyres/dunlop-195`);
    expect(urls).toContain(`${site}/tyres/rapid-11r22-5`);
    expect(urls).toContain(`${site}/brands/yokohama`);
    expect(urls).toContain(`${site}/brands/dunlop`);
    expect(urls).toContain(`${site}/categories/car`);
    expect(urls).toContain(`${site}/categories/truck`);
  });

  it("has no duplicates, only absolute URLs, and leaves out the studio, api, and filtered views", () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url.startsWith(`${site}`)).toBe(true);
      expect(url).not.toMatch(/\/studio|\/api\/|\?/);
    }
  });

  it("skips a document that has no slug", () => {
    const entries = buildSitemapEntries({ ...data, products: [doc(null), doc("ok")] }, site);
    expect(entries.map((entry) => entry.url)).toContain(`${site}/tyres/ok`);
    expect(entries.some((entry) => entry.url.endsWith("/null"))).toBe(false);
  });

  it("dates a listing page by its newest document", () => {
    const entries = buildSitemapEntries(data, site);
    const tyres = entries.find((entry) => entry.url === `${site}/tyres`);
    expect(tyres?.lastModified).toEqual(new Date("2026-09-10T00:00:00Z"));
  });

  it("still lists the static pages when there is no content", () => {
    const empty = buildSitemapEntries(
      { products: [], brands: [], categories: [], services: [] },
      site,
    );
    expect(empty.map((entry) => entry.url)).toEqual([
      site,
      `${site}/tyres`,
      `${site}/brands`,
      `${site}/services`,
      `${site}/about`,
      `${site}/contact`,
    ]);
  });
});

describe("socialMetadata", () => {
  const base = {
    title: "Yokohama Tyres Karachi",
    description: "Importer.",
    path: "/brands/yokohama",
    siteName: "Baber Tyres Corporation",
  };

  it("carries the site name, locale, url, title and description into Open Graph", () => {
    const { openGraph } = socialMetadata(base);
    expect(openGraph).toMatchObject({
      type: "website",
      siteName: "Baber Tyres Corporation",
      locale: "en_PK",
      url: "/brands/yokohama",
      title: "Yokohama Tyres Karachi",
      description: "Importer.",
    });
  });

  it("uses the plain summary card when the page has no image", () => {
    const { twitter } = socialMetadata(base);
    expect(twitter).toMatchObject({ card: "summary" });
  });

  it("uses the large-image card when there is an image", () => {
    const { openGraph, twitter } = socialMetadata({ ...base, image: "https://cdn/x.jpg" });
    expect(twitter).toMatchObject({ card: "summary_large_image", images: ["https://cdn/x.jpg"] });
    expect(openGraph).toMatchObject({ images: ["https://cdn/x.jpg"] });
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers the trail from 1 with absolute URLs", () => {
    const ld = buildBreadcrumbJsonLd(
      [
        { name: "Brands", path: "/brands" },
        { name: "Yokohama", path: "/brands/yokohama" },
      ],
      site,
    );
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Brands", item: `${site}/brands` },
      { "@type": "ListItem", position: 2, name: "Yokohama", item: `${site}/brands/yokohama` },
    ]);
  });
});
