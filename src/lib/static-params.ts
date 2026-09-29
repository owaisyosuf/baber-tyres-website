/**
 * A slug no document can have (Sanity slugs never start with "_"), used when
 * a list of pages is empty. Its page finds nothing and renders the 404.
 */
export const NO_PAGES_SLUG = "__none__";

/**
 * Params for a `[slug]` route. Cache Components fails the build when
 * generateStaticParams returns no params, which would happen whenever nothing
 * of that kind is published yet (no products, say) — so an empty list becomes
 * one placeholder that 404s instead of blocking every deploy.
 */
export function slugParams(items: readonly { slug: string }[]): { slug: string }[] {
  return items.length > 0 ? items.map(({ slug }) => ({ slug })) : [{ slug: NO_PAGES_SLUG }];
}
