const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!configured && process.env.NODE_ENV === "production") {
  // Canonical URLs, Open Graph, and structured data are all built from this;
  // a production build without it would publish localhost addresses.
  throw new Error("Missing environment variable: NEXT_PUBLIC_SITE_URL");
}

/** The site's public origin with no trailing slash, e.g. "https://example.com". */
export const siteUrl = (configured || "http://localhost:3000").replace(/\/+$/, "");
