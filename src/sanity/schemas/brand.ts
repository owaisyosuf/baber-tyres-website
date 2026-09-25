import { defineField, defineType } from "sanity";

/**
 * FR-A3, FR-B6, FR-F2, R2. `relationship` is the field that carries the
 * shop's strongest trust signal (importer/dealer of 20+ brands) — it drives
 * the BrandBadge shown on every card, brand page, and the homepage strip.
 *
 * Sanity's Studio warns before deleting a document that other documents
 * reference, so a brand referenced by products is protected by default
 * (FR-F2) without extra code here.
 */
export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 40 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "relationship",
      title: "Relationship",
      description:
        "How Baber Tyres carries this brand — controls the badge shown sitewide.",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Importer", value: "importer" },
          { title: "Dealer", value: "dealer" },
          { title: "Stocked", value: "stocked" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Lower numbers sort first within the same relationship group.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "relationship", media: "logo" },
  },
});
