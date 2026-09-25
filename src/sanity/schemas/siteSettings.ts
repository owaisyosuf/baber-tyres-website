import { defineField, defineType } from "sanity";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * FR-F4, R6. The Sanity-side twin of lib/site.ts's static defaults — from
 * T009 onward, lib/site.ts is populated from this singleton instead, without
 * changing how consumers import it.
 *
 * This is a single, hand-maintained document (one per dataset), not a type
 * meant to have many instances. The Studio doesn't have a native "singleton"
 * schema flag; T008's desk structure pins the one document and removes this
 * type from the generic "create new" list, which is where enforcement
 * actually lives.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "shopName",
      title: "Shop name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addressLine",
      title: "Address line",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone (E.164)",
      type: "string",
      description: "E.164 format, e.g. +92XXXXXXXXXX",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (E.164)",
      type: "string",
      description: "E.164 format, e.g. +92XXXXXXXXXX",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hoursOpen",
      title: "Opens at",
      type: "string",
      description: "24-hour HH:mm, e.g. 10:00",
    }),
    defineField({
      name: "hoursClose",
      title: "Closes at",
      type: "string",
      description: "24-hour HH:mm, e.g. 19:00",
    }),
    defineField({
      name: "openDays",
      title: "Open days",
      type: "array",
      of: [{ type: "string" }],
      options: { list: weekdays.map((day) => ({ title: day, value: day })) },
    }),
    defineField({
      name: "closedDay",
      title: "Closed day",
      type: "string",
      options: { list: weekdays.map((day) => ({ title: day, value: day })) },
    }),
    defineField({
      name: "deliveryNote",
      title: "Delivery note",
      type: "text",
      description: 'Shown wherever delivery is mentioned, e.g. "Delivery available — charges apply."',
    }),
    defineField({
      name: "mapLat",
      title: "Map latitude",
      type: "number",
    }),
    defineField({
      name: "mapLng",
      title: "Map longitude",
      type: "number",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Map embed URL",
      type: "url",
    }),
    defineField({
      name: "googleReviewUrl",
      title: "Google review URL",
      type: "url",
      description: "Set once the Google Business Profile is confirmed (OQ-1). The review CTA renders only when this is set.",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "shopName", subtitle: "addressLine" },
  },
});
