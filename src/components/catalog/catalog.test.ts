import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const anchors = (markup: string) => markup.match(/<a\b[\s\S]*?<\/a>/g) ?? [];

describe("Pagination", () => {
  const render = (page: number, totalPages: number, filters = {}) =>
    html(createElement(Pagination, { filters, page, totalPages }));

  it("renders nothing for a single page", () => {
    expect(render(1, 1)).toBe("");
  });

  it("is a labelled navigation landmark", () => {
    expect(render(1, 3)).toContain('aria-label="Pagination"');
  });

  it("links to real, shareable catalog URLs", () => {
    const markup = render(2, 5);
    expect(markup).toContain('href="/tyres"'); // page 1 has no ?page
    expect(markup).toContain('href="/tyres?page=3"');
    expect(markup).toContain('href="/tyres?page=5"');
  });

  it("keeps the active filters on every page link", () => {
    const markup = render(2, 3, { brandSlugs: ["yokohama"], categorySlug: "car", width: 185 });
    expect(markup).toContain('href="/tyres?brand=yokohama&amp;category=car&amp;width=185"');
    expect(markup).toContain('href="/tyres?brand=yokohama&amp;category=car&amp;width=185&amp;page=3"');
  });

  it("marks the current page and does not link it", () => {
    const markup = render(3, 5);
    expect(markup).toContain('aria-current="page"');
    expect(markup.match(/aria-current="page"/g)).toHaveLength(1);
    expect(anchors(markup).some((a) => a.includes('aria-label="Page 3"'))).toBe(false);
  });

  it("offers Previous and Next with rel hints, and disables them at the ends", () => {
    const middle = render(2, 3);
    expect(middle).toContain('rel="prev"');
    expect(middle).toContain('rel="next"');

    const first = render(1, 3);
    expect(first).not.toContain('rel="prev"');
    expect(first).toContain('rel="next"');

    const last = render(3, 3);
    expect(last).toContain('rel="prev"');
    expect(last).not.toContain('rel="next"');
  });

  it("gives phones a compact 'Page X of Y' in place of the number list", () => {
    expect(render(2, 5)).toContain("Page 2 of 5");
  });

  it("shows a gap for a long run of pages", () => {
    expect(render(10, 20)).toContain("…");
  });

  it("gives every link an accessible name", () => {
    for (const anchor of anchors(render(2, 5))) {
      expect(anchor).toMatch(/aria-label="[^"]+"/);
    }
  });
});

describe("EmptyState", () => {
  const render = (filtered: boolean, whatsappHref = "https://wa.me/1?text=hi") =>
    html(createElement(EmptyState, { filtered, whatsappHref }));

  it("offers a WhatsApp fallback in the shop's own words", () => {
    const markup = render(true);
    expect(markup).toContain("Size nahi mili");
    expect(markup).toContain('href="https://wa.me/1?text=hi"');
  });

  it("says filters excluded everything when they are active, and offers a way out", () => {
    const markup = render(true);
    expect(markup).toContain("No tyres match these filters");
    expect(markup).toContain("Clear all filters");
    expect(markup).toContain('href="/tyres"');
  });

  it("does not offer to clear filters when there are none", () => {
    const markup = render(false);
    expect(markup).toContain("No tyres to show right now");
    expect(markup).not.toContain("Clear all filters");
    expect(markup).toContain("https://wa.me/");
  });
});
