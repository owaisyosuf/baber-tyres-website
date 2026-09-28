import { Reveal } from "@/components/motion/Reveal";
import { ProductCard, type ProductCardProduct } from "./ProductCard";

interface ProductGridProps {
  products: readonly (ProductCardProduct & { _id: string })[];
  headingLevel?: "h2" | "h3";
  /** How many leading cards load their image eagerly — the first row. */
  priorityCount?: number;
  /** Fade the cards in as they scroll into view (below-the-fold grids only). */
  reveal?: boolean;
}

/**
 * Responsive product grid — design.md §9: one column on mobile, two from `sm`,
 * three from `lg`, four from `xl`. An explicit list role keeps the list
 * semantics that Safari drops when list styling is removed.
 */
export function ProductGrid({
  products,
  headingLevel,
  priorityCount = 0,
  reveal = false,
}: ProductGridProps) {
  return (
    <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product._id}>
          {reveal ? (
            <Reveal index={index} className="h-full">
              <ProductCard product={product} headingLevel={headingLevel} />
            </Reveal>
          ) : (
            <ProductCard
              product={product}
              headingLevel={headingLevel}
              priority={index < priorityCount}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
