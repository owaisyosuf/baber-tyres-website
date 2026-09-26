import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";
import type { ShopHours } from "./hours";
import { siteConfig } from "./site";

/**
 * The shop's NAP and hours as the site consumes them — FR-F4, R6. Sanity's
 * `siteSettings` is the source the owner edits; `siteConfig` (lib/site.ts)
 * supplies the confirmed defaults for anything the document leaves empty and
 * for when Sanity can't be reached at all (NFR-11), so contact actions never
 * disappear from the page.
 *
 * Kept free of the Sanity client so it can be unit-tested; the fetching
 * wrapper lives in lib/sanity/settings.ts.
 */
export interface ShopSettings {
  shopName: string;
  addressLine: string;
  city: string;
  phoneE164: string;
  whatsappE164: string;
  hours: ShopHours;
  deliveryNote: string;
  googleReviewUrl: string | null;
  mapEmbedUrl: string | null;
  mapLat: number | null;
  mapLng: number | null;
  /** Default page title and description (Sanity `defaultSeo`, else lib/site.ts). */
  seo: { title: string; description: string };
}

const blankToNull = (value: string | null | undefined) =>
  value?.trim() ? value.trim() : null;

export function resolveSettings(cms: SETTINGS_QUERY_RESULT): ShopSettings {
  return {
    shopName: blankToNull(cms?.shopName) ?? siteConfig.shopName,
    addressLine: blankToNull(cms?.addressLine) ?? siteConfig.addressLine,
    city: blankToNull(cms?.city) ?? siteConfig.city,
    phoneE164: blankToNull(cms?.phone) ?? siteConfig.phoneE164,
    whatsappE164: blankToNull(cms?.whatsapp) ?? siteConfig.whatsappE164,
    hours: {
      open: blankToNull(cms?.hoursOpen) ?? siteConfig.hours.open,
      close: blankToNull(cms?.hoursClose) ?? siteConfig.hours.close,
      openDays: cms?.openDays?.length
        ? cms.openDays
        : siteConfig.hours.openDays,
      // With a settings document present, an empty closed day is a real
      // choice (open every day), not a missing value — so it isn't defaulted.
      closedDay: cms ? cms.closedDay : siteConfig.hours.closedDay,
    },
    deliveryNote: blankToNull(cms?.deliveryNote) ?? siteConfig.deliveryNote,
    googleReviewUrl: blankToNull(cms?.googleReviewUrl),
    mapEmbedUrl: blankToNull(cms?.mapEmbedUrl) ?? siteConfig.mapEmbedUrl,
    mapLat: cms?.mapLat ?? null,
    mapLng: cms?.mapLng ?? null,
    seo: {
      title: blankToNull(cms?.defaultSeo?.title) ?? siteConfig.seo.title,
      description:
        blankToNull(cms?.defaultSeo?.description) ?? siteConfig.seo.description,
    },
  };
}
