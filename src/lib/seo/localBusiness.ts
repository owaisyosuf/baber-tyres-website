import { isTime24h, sortWeekdays } from "../hours";
import type { ShopSettings } from "../settings";
import { siteConfig } from "../site";

/**
 * Sitewide LocalBusiness structured data — FR-G2, R6. Built entirely from the
 * shop settings, so it can never drift from the NAP the visitor sees.
 *
 * Only facts the shop has confirmed are emitted: there is no `image`,
 * `priceRange`, or `sameAs` because none exist, and `geo` appears only once
 * the owner has entered map coordinates. The closed day is expressed by
 * leaving it out of `openingHoursSpecification`, which is how schema.org and
 * Google read "closed".
 */
export function buildLocalBusinessJsonLd(settings: ShopSettings, siteUrl: string) {
  const days = sortWeekdays(settings.hours.openDays);
  const hoursValid =
    days.length > 0 &&
    isTime24h(settings.hours.open) &&
    isTime24h(settings.hours.close);

  return {
    "@context": "https://schema.org",
    "@type": "TireShop",
    "@id": `${siteUrl}/#business`,
    name: settings.shopName,
    description: settings.seo.description,
    url: siteUrl,
    telephone: settings.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine,
      addressLocality: settings.city,
      addressCountry: siteConfig.countryCode,
    },
    areaServed: { "@type": "City", name: settings.city },
    ...(settings.mapLat !== null && settings.mapLng !== null && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: settings.mapLat,
        longitude: settings.mapLng,
      },
    }),
    ...(hoursValid && {
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: days,
          opens: settings.hours.open.trim(),
          closes: settings.hours.close.trim(),
        },
      ],
    }),
  };
}
