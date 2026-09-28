import Link from "next/link";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { Card, Section } from "@/components/ui";
import { getCategories } from "@/lib/sanity/queries";

/**
 * Vehicle category entry points — FR-A4. Every category is the same card at
 * the same size in one even grid, so truck, forklift and off-road read as
 * first-class next to car (P2 must not feel like an afterthought). Hidden if
 * there are no categories or Sanity cannot be reached.
 */
export async function CategoryGrid() {
  let categories;
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Categories unavailable on the homepage:", error);
    return null;
  }
  if (categories.length === 0) return null;

  return (
    <Section surface>
      <h2 id="home-categories" className="text-h2">
        Shop by vehicle
      </h2>
      <p className="mt-3 mb-8 max-w-[52ch] text-body text-muted">
        Car, SUV, truck, forklift and off-road tyres. Pick your vehicle to see what we list.
      </p>
      <ul
        role="list"
        aria-labelledby="home-categories"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {categories.map((category) => (
          <li key={category._id}>
            <Card
              as="div"
              interactive
              className="relative flex h-full flex-col items-center gap-3 p-6 text-center"
            >
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-background text-accent"
              >
                <CategoryIcon icon={category.icon} className="h-8 w-8" />
              </span>
              <Link
                href={`/categories/${category.slug}`}
                className="text-body font-semibold text-text outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
              >
                {category.name}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
