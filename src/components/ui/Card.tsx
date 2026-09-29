import type { ElementType, ReactNode } from "react";

/** Elevation levels — design.md §7.3. Built from borders and glow, not drop
 * shadows, which read poorly on the near-black background. */
type CardElevation = "flat" | "raised" | "accent";

interface CardProps {
  elevation?: CardElevation;
  /** Adds the hover treatment (raised surface, brighter border, glow). */
  interactive?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const elevationClasses: Record<CardElevation, string> = {
  flat: "bg-background border border-transparent",
  raised: "bg-surface border border-border",
  accent: "bg-surface border border-accent shadow-glow-strong",
};

// Lifts 4px with a stronger amber glow and a warmer border; the lift is
// dropped under reduced motion, the colour change stays.
export const interactiveCardClasses =
  "transition-[border-color,box-shadow,background-color,translate] duration-300 ease-out-soft " +
  "hover:-translate-y-1 hover:bg-surface-raised hover:border-accent/50 hover:shadow-glow-strong " +
  "focus-within:border-accent/50 focus-within:shadow-glow-strong motion-reduce:hover:translate-y-0";

export function Card({
  elevation = "raised",
  interactive = false,
  as: Tag = "div",
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={[
        "rounded-lg",
        elevationClasses[elevation],
        interactive ? interactiveCardClasses : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
