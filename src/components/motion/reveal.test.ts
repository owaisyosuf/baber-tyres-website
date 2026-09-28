import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Reveal } from "./Reveal";

// createElement passes children as extra arguments (the lint rule requires it), which
// the component's own props type does not describe.
const RevealWithoutChildrenProp = Reveal as ComponentType<{ index?: number; className?: string }>;

const css = readFileSync(path.join(__dirname, "../../app/(site)/globals.css"), "utf-8");

describe("Reveal", () => {
  it("renders its content in the final, visible state on the server", () => {
    const markup = renderToStaticMarkup(
      createElement(RevealWithoutChildrenProp, { index: 2, className: "h-full" }, createElement("p", null, "Hello")),
    );
    expect(markup).toContain("<p>Hello</p>");
    // Nothing is hidden until the browser has mounted it below the fold.
    expect(markup).not.toContain("data-reveal");
    expect(markup).not.toMatch(/opacity/);
    expect(markup).toContain("--reveal-delay:120ms");
    expect(markup).toContain('class="h-full"');
  });
});

describe("reveal styles", () => {
  it("fades and rises 16px over 400ms, once", () => {
    expect(css).toMatch(/\[data-reveal="hidden"\]\s*{[^}]*translateY\(16px\)/);
    expect(css).toMatch(/\[data-reveal="shown"\][^}]*opacity 400ms/);
    expect(css).toMatch(/\[data-reveal="shown"\][^}]*transform 400ms/);
  });

  it("never loops", () => {
    expect(css).not.toMatch(/animation-iteration-count:\s*infinite/);
    expect(css).not.toMatch(/\binfinite\b/);
  });

  it("renders every revealed element in its final state under reduced motion", () => {
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/\[data-reveal\]\s*{[^}]*opacity:\s*1 !important/);
    expect(reduced).toMatch(/\[data-reveal\]\s*{[^}]*transform:\s*none !important/);
  });
});
