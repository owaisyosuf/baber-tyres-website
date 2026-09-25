import type { ReactNode } from "react";

/**
 * The five treatments the design system defines (design.md §7.5):
 * Importer = solid-accent, Dealer = outline-accent, Stocked = outline-muted,
 * In Stock = subtle-success (+dot), Out of Stock = subtle-neutral (+dot).
 * BrandBadge and StockBadge (T017) are thin wrappers over this primitive.
 */
export type BadgeVariant =
  | "solid-accent"
  | "outline-accent"
  | "outline-muted"
  | "subtle-success"
  | "subtle-neutral";

interface BadgeProps {
  variant: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  "solid-accent": "bg-accent text-background border border-transparent",
  "outline-accent": "bg-transparent text-accent border border-accent",
  "outline-muted": "bg-transparent text-muted border border-border-strong",
  "subtle-success": "bg-transparent text-text border border-border",
  "subtle-neutral": "bg-transparent text-muted border border-border",
};

const dotClasses: Partial<Record<BadgeVariant, string>> = {
  "subtle-success": "bg-in-stock",
  "subtle-neutral": "bg-out-stock",
};

export function Badge({ variant, dot, children, className }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 py-1 text-label uppercase",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot ? (
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${dotClasses[variant] ?? "bg-muted"}`}
        />
      ) : null}
      {children}
    </span>
  );
}
