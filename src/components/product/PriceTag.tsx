import { formatPKR } from "@/lib/format";

/**
 * A price in PKR through the shared formatter, in tabular numerals so prices
 * line up down a column. Guards against a non-finite value from the CMS,
 * which formatPKR would otherwise throw on and take the whole page with it.
 */
export function PriceTag({
  price,
  muted = false,
  className,
}: {
  price: number;
  /** Used for out-of-stock products, which stay listed but recede. */
  muted?: boolean;
  className?: string;
}) {
  if (!Number.isFinite(price)) {
    return <span className="text-small text-muted">Ask us for the price</span>;
  }
  return (
    <span
      className={[
        "tabular font-display text-h3 font-bold",
        muted ? "text-muted" : "text-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {formatPKR(price)}
    </span>
  );
}
