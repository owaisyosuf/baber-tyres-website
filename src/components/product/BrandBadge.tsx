import { Badge, type BadgeVariant } from "@/components/ui";

export type BrandRelationship = "importer" | "dealer" | "stocked";

/**
 * How Baber Tyres carries a brand — the visual carrier of the shop's
 * positioning (design.md §7.5): Importer is a solid amber fill, Dealer an
 * amber outline, Stocked a muted outline, so the three read as different
 * at a glance.
 */
const badgeByRelationship: Record<
  BrandRelationship,
  { label: string; variant: BadgeVariant }
> = {
  importer: { label: "Importer", variant: "solid-accent" },
  dealer: { label: "Dealer", variant: "outline-accent" },
  stocked: { label: "Stocked", variant: "outline-muted" },
};

export function BrandBadge({
  relationship,
  className,
}: {
  relationship: BrandRelationship;
  className?: string;
}) {
  const { label, variant } = badgeByRelationship[relationship];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
