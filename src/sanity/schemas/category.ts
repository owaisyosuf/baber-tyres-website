import { defineField, defineType } from "sanity";

/** FR-B5, FR-A4. `icon` keys into the icon set from T005 — kept as a select
 * list rather than free text so a typo can't silently drop a category's icon. */
export const category = defineType({
  name: "category",
  title: "Category",
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
      name: "description",
      title: "Description",
      type: "text",
      description: "Used as the category landing page copy.",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Car", value: "car" },
          { title: "SUV", value: "suv" },
          { title: "Truck", value: "truck" },
          { title: "Forklift", value: "forklift" },
          { title: "Off-road", value: "offroad" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description: "Optional. Shown on the category card and page; the icon is used when blank.",
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
    select: { title: "name", subtitle: "slug.current", media: "image" },
  },
});
