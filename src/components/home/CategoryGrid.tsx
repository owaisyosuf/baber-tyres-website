import Link from "next/link";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { Reveal } from "@/components/motion/Reveal";
import { Card, Section } from "@/components/ui";
import { MediaOrIcon } from "@/components/ui/MediaOrIcon";
import { getCategories } from "@/lib/sanity/queries";
import { rethrowDuringBuild } from "@/lib/build-phase";

const IMAGE_WIDTH = 480;
const IMAGE_HEIGHT = 360;

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
    rethrowDuringBuild(error);
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
        {categories.map((category, index) => (
          <li key={category._id}>
            <Reveal index={index} className="h-full">
              <Card
                as="div"
                interactive
                className="group relative flex h-full flex-col overflow-hidden"
              >
                <MediaOrIcon
                  image={category.image}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="aspect-[4/3]"
                  icon={<CategoryIcon icon={category.icon} className="h-10 w-10" />}
                />
                <div className="flex items-center gap-2 p-4">
                  <CategoryIcon icon={category.icon} className="h-5 w-5 shrink-0 text-accent" />
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-body font-semibold text-text outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
                  >
                    {category.name}
                  </Link>
                </div>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
