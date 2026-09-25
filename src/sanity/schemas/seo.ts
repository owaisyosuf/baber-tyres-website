import { defineField, defineType } from "sanity";

/**
 * Shared per-page metadata override — reused by brand, category, product,
 * service, and siteSettings (design.md §5, FR-G1). Optional everywhere:
 * when empty, the route falls back to generated metadata.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),
  ],
});
