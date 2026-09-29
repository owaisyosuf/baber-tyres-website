import { defineField, defineType } from "sanity";

/**
 * FR-C1, FR-F3. Only three services exist today (fitting, alignment,
 * balancing) — that's a content decision enforced by seed data (T011), not
 * a schema restriction, so the owner can add a genuinely new service later
 * without a developer touching this file.
 */
export const service = defineType({
  name: "service",
  title: "Service",
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
      options: { source: "name", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Fitting", value: "fitting" },
          { title: "Alignment", value: "alignment" },
          { title: "Balancing", value: "balancing" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description: "Optional. Shown with the service on the homepage and /services; the icon is used when blank.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) =>
            Rule.custom((alt, context) =>
              (context.parent as { asset?: unknown } | undefined)?.asset && !alt
                ? "Alt text is required when a photo is set."
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description", media: "image" },
  },
});
