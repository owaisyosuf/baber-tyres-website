import { getShopSettings } from "@/lib/sanity/settings";
import { buildLocalBusinessJsonLd } from "@/lib/seo/localBusiness";
import { siteUrl } from "@/lib/site-url";
import { JsonLd } from "./JsonLd";

export async function LocalBusinessJsonLd() {
  const settings = await getShopSettings();
  return <JsonLd data={buildLocalBusinessJsonLd(settings, siteUrl)} />;
}
