import type { ElementType, ReactNode } from "react";
import { Container } from "./Container";

/**
 * Enforces the vertical rhythm from design.md §7.3 (64 / 96 / 128px) and the
 * shared gutters, so no page invents its own spacing.
 */
interface SectionProps {
  as?: ElementType;
  /** Tints the section with the surface color — for alternating bands. */
  surface?: boolean;
  /** Skip the built-in Container wrap, for full-bleed content (e.g. the hero). */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
}

export function Section({
  as: Tag = "section",
  surface = false,
  bleed = false,
  className,
  children,
}: SectionProps) {
  return (
    <Tag className={["py-16 md:py-24 lg:py-32", surface ? "bg-surface" : "", className].filter(Boolean).join(" ")}>
      {bleed ? children : <Container>{children}</Container>}
    </Tag>
  );
}
