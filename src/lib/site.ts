/**
 * Single source of NAP (Name, Address, Phone) and shop-identity data — Constitution §I, R6.
 *
 * Every component that needs the shop's contact details, hours, or delivery
 * policy imports from here. No contact detail is ever typed into a component
 * directly (FR-D2, FR-F4).
 *
 * This file holds the confirmed business facts as static defaults. From T009
 * onward, the same shape is populated from the Sanity `siteSettings`
 * singleton instead — the import path for consumers does not change.
 */

export const siteConfig = {
  shopName: "Baber Tyres Corporation",
  tagline: "Importer & Dealer of 20+ Tyre Brands",

  addressLine: "M.A. Jinnah Road",
  city: "Karachi",
  country: "Pakistan",

  /** Display format, as the owner gave it. */
  phoneDisplay: "0317-4724400",
  /** E.164 — used to build tel: and wa.me links. */
  phoneE164: "+923174724400",
  whatsappE164: "+923174724400",

  hours: {
    open: "10:00",
    close: "19:00",
    openDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    closedDay: "Sunday",
  },

  deliveryNote:
    "Delivery available across Karachi — charges apply. WhatsApp us for a quote.",

  /** Set once OQ-1 (Google Business Profile) is confirmed. */
  googleReviewUrl: null as string | null,
  /** Set once a map pin is confirmed for the shop address. */
  mapEmbedUrl: null as string | null,
} as const;

export type SiteConfig = typeof siteConfig;
