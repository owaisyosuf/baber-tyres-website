import type { Metadata } from "next";

/**
 * Open Graph and Twitter card metadata — FR-G5, T032. A page that sets its own
 * `openGraph` replaces the layout's whole object rather than merging with it,
 * so every page builds its social tags through here to keep the site name,
 * type, and locale. There is no shop photography (NFR-12), so a page without
 * its own image (a product photo, a brand logo) gets the plain "summary" card
 * instead of a large-image card with nothing in it.
 */
export function socialMetadata(input: {
  title: string;
  description: string;
  /** Path on this site, e.g. "/brands/yokohama"; resolved against `metadataBase`. */
  path: string;
  siteName: string;
  image?: string | null;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const images = input.image ? [input.image] : undefined;
  return {
    openGraph: {
      type: "website",
      siteName: input.siteName,
      locale: "en_PK",
      title: input.title,
      description: input.description,
      url: input.path,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images,
    },
  };
}
