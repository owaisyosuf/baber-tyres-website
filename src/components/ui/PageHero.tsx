import type { ReactNode } from "react";
import { RadialGlow, TreadMotif } from "@/components/icons";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { Container } from "./Container";

interface PageHeroProps {
  /** Short amber label above the heading. */
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Trail after Home; the last item is the current page. */
  breadcrumb: readonly BreadcrumbItem[];
  /** Buttons or other actions under the intro. */
  children?: ReactNode;
}

/**
 * Banner for inner pages — the homepage hero's glow and tread motif at a
 * smaller scale, so every page opens with the same look (NFR-12: no photo
 * needed). The heading is plain text, so it can be the LCP element.
 */
export function PageHero({ eyebrow, title, intro, breadcrumb, children }: PageHeroProps) {
  return (
    <div className="relative border-b border-border">
      {/* Only the backdrop is clipped, so a dropdown in the actions (the catalog search) can hang below the banner. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RadialGlow />
        <div
          className="absolute inset-0 text-border-strong opacity-30"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 90%)",
          }}
        >
          <TreadMotif className="h-full w-full" />
        </div>
      </div>

      <Container className="relative py-10 md:py-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, ...breadcrumb]} />
        <p className="mt-8 text-label uppercase text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-[22ch] text-h1 md:text-display">{title}</h1>
        {intro && <p className="mt-5 max-w-[60ch] text-body-lg text-muted">{intro}</p>}
        {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
      </Container>
    </div>
  );
}
