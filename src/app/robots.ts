import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * robots.txt — FR-G3. The whole public site is open to crawlers; the embedded
 * Studio and the API routes are not for search. Filtered catalog URLs are NOT
 * blocked: crawlers need to reach them to read their canonical link to /tyres.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
