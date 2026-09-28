import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * FR-B3, FR-B4, FR-F1, R1, R8. Size is stored as three numeric fields, never
 * free text, so filtering works (§B2) — `sizeLabelOverride` is the escape
 * hatch for commercial sizing ("11R22.5", "7.00-12") that the metric triple
 * can't express; lib/format.ts's formatTyreSize prefers it when present.
 *
 * `images` enforces "no product publishes without an image, alt text, and
 * price" at the schema level (FR-F1), not just by convention.
 */
export const product = defineType({
  name: "product",
  title: "Product",
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
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "width",
      title: "Width (mm)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "profile",
      title: "Profile (aspect ratio)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "rim",
      title: "Rim (inches)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "sizeLabelOverride",
      title: "Size label override",
      type: "string",
      description:
        'For commercial sizing the width/profile/rim fields can\'t express, e.g. "11R22.5" or "7.00-12". Leave blank for standard car/SUV sizes — width/profile/rim are still required above even when this is set, for filtering.',
    }),
    defineField({
      name: "treadPattern",
      title: "Tread pattern",
      type: "string",
      description:
        'The tread pattern name, e.g. "V553" or "ES32" for Yokohama. Optional: leave blank and no pattern is shown on the card or product page.',
    }),
    defineField({
      name: "loadIndex",
      title: "Load index",
      type: "string",
    }),
    defineField({
      name: "speedRating",
      title: "Speed rating",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price (PKR)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "inStock",
      title: "In stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describes the image for screen readers and search engines.",
              validation: (Rule) =>
                Rule.required().error("Alt text is required for every image."),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).error("At least one product image is required."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on the homepage featured row.",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "name",
      brand: "brand.name",
      width: "width",
      profile: "profile",
      rim: "rim",
      override: "sizeLabelOverride",
      pattern: "treadPattern",
      media: "images.0",
    },
    prepare({ title, brand, width, profile, rim, override, pattern, media }) {
      const size = override || (width && profile && rim ? `${width}/${profile} R${rim}` : "");
      return {
        title,
        subtitle: [brand, pattern, size].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
