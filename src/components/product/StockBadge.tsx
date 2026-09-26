import { Badge } from "@/components/ui";

/** Dot plus text, never colour alone. Out of stock is grey, not red — it is not an error. */
export function StockBadge({
  inStock,
  className,
}: {
  inStock: boolean;
  className?: string;
}) {
  return inStock ? (
    <Badge variant="subtle-success" dot className={className}>
      In stock
    </Badge>
  ) : (
    <Badge variant="subtle-neutral" dot className={className}>
      Out of stock
    </Badge>
  );
}
