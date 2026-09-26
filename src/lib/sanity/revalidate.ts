/**
 * Maps a Sanity webhook payload to the cache tags it invalidates — the
 * inverse of the cacheTag() calls in queries.ts. Kept free of next/cache
 * so it is unit-testable; the route handler does the actual revalidation.
 *
 * The webhook is configured in Sanity with the projection
 * `{ _type, "slug": slug.current }` so the payload carries only what this
 * needs.
 */

export interface WebhookPayload {
  _type?: unknown;
  slug?: unknown;
}

/** Document type → the list-level tag its queries carry. */
const TAG_BY_TYPE: Record<string, string> = {
  product: "product",
  brand: "brand",
  category: "category",
  service: "service",
  siteSettings: "settings",
};

/** Types whose detail queries also carry a `<tag>:<slug>` tag. */
const SLUG_TAGGED_TYPES = new Set(["product", "brand", "category"]);

// Slugs become part of a cache tag (256-char limit), so anything that is not
// a plain Sanity slug is ignored rather than trusted.
const SLUG_PATTERN = /^[\w-]{1,200}$/;

export function tagsForDocument(payload: WebhookPayload): string[] {
  const { _type: type, slug } = payload;
  if (typeof type !== "string" || !Object.hasOwn(TAG_BY_TYPE, type)) return [];

  const tag = TAG_BY_TYPE[type];
  const tags = [tag];
  if (
    SLUG_TAGGED_TYPES.has(type) &&
    typeof slug === "string" &&
    SLUG_PATTERN.test(slug)
  ) {
    tags.push(`${tag}:${slug}`);
  }
  return tags;
}
