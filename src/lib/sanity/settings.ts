import { resolveSettings, type ShopSettings } from "../settings";
import { getSettings } from "./queries";

/**
 * The shop settings for rendering. A Sanity failure falls back to the
 * confirmed defaults in lib/site.ts instead of throwing, so every page keeps
 * its contact details when the CMS is down (NFR-11).
 */
export async function getShopSettings(): Promise<ShopSettings> {
  try {
    return resolveSettings(await getSettings());
  } catch (error) {
    console.error("Falling back to default shop settings:", error);
    return resolveSettings(null);
  }
}
