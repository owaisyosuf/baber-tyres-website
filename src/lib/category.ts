/**
 * Category-page copy — FR-B5, T023. Category names in Sanity are display
 * labels ("Truck / Commercial", "Lifter / Forklift"), which are not the
 * phrases people search for. The keyword is the search phrase ("truck",
 * "forklift"); an unknown slug (a category the owner adds later) falls back
 * to its own name, so a new category still gets a sensible title.
 */
const KEYWORD_BY_SLUG: Record<string, string> = {
  car: "car",
  suv: "SUV",
  truck: "truck",
  lifter: "forklift",
  offroad: "off-road",
};

export interface CategoryCopyInput {
  name: string;
  slug: string;
}

export function categoryKeyword(category: CategoryCopyInput): string {
  return KEYWORD_BY_SLUG[category.slug] ?? category.name.toLowerCase();
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Truck Tyres Karachi" — the phrase the page is meant to rank for. */
export function categoryPageTitle(category: CategoryCopyInput, city: string): string {
  return `${capitalise(categoryKeyword(category))} Tyres ${city}`;
}

export function categoryPageDescription(
  category: CategoryCopyInput,
  shopName: string,
  city: string,
): string {
  return `${capitalise(categoryKeyword(category))} tyres in ${city} from ${shopName}. Browse the sizes we list, or message us on WhatsApp for price and availability.`;
}

/** The page heading: "Truck tyres in Karachi". */
export function categoryHeading(category: CategoryCopyInput, city: string): string {
  return `${capitalise(categoryKeyword(category))} tyres in ${city}`;
}
