import type { MetadataRoute } from "next";
import { rethrowDuringBuild } from "@/lib/build-phase";
import { getSitemapData } from "@/lib/sanity/queries";
import { buildSitemapEntries, type SitemapData } from "@/lib/seo/sitemap";
import { siteUrl } from "@/lib/site-url";

const NO_CONTENT: SitemapData = { products: [], brands: [], categories: [], services: [] };

/**
 * sitemap.xml — FR-G3, generated from Sanity so a published product, brand, or
 * category appears without a redeploy (the webhook revalidates the tags this
 * reads). If Sanity is unreachable at request time the static pages are still
 * listed; during a build the failure stops the build instead.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: SitemapData = NO_CONTENT;
  try {
    data = await getSitemapData();
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Sitemap content unavailable:", error);
  }
  return buildSitemapEntries(data, siteUrl);
}
