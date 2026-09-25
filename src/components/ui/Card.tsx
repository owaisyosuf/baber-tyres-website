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

const interactiveClasses =
  "transition-[border-color,box-shadow,background-color] duration-300 ease-out-soft " +
  "hover:bg-surface-raised hover:border-border-strong hover:shadow-glow";

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
        interactive ? interactiveClasses : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
