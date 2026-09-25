import type { StructureResolver } from "sanity/structure";

/**
 * Custom desk structure — T008. Pins siteSettings as a singleton (Sanity has
 * no native "singleton" schema flag; this is where that's actually
 * enforced), and groups brands by relationship and products by category so
 * the owner isn't just staring at a flat document list.
 *
 * Verified against @sanity/cli's own shipped structure templates
 * (node_modules/@sanity/cli/templates/shopify/structure) rather than
 * guessed — `S.editor()` for the singleton, `S.documentTypeList()` +
 * `.child()` for the dynamic per-category grouping, and `S.documentList()`
 * + `.filter()`/`.params()` for the fixed relationship groups.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.editor()
            .title("Site Settings")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),

      S.divider(),

      S.listItem()
        .title("Products by Category")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .child((categoryId) =>
              S.documentList()
                .title("Products")
                .schemaType("product")
                .filter('_type == "product" && category._ref == $categoryId')
                .params({ categoryId }),
            ),
        ),
      S.listItem()
        .title("All Products")
        .schemaType("product")
        .child(S.documentTypeList("product").title("All Products")),

      S.divider(),

      S.listItem()
        .title("Brands")
        .child(
          S.list()
            .title("Brands by Relationship")
            .items([
              S.listItem()
                .title("Importers")
                .child(
                  S.documentList()
                    .title("Importers")
                    .schemaType("brand")
                    .filter('_type == "brand" && relationship == "importer"'),
                ),
              S.listItem()
                .title("Dealers")
                .child(
                  S.documentList()
                    .title("Dealers")
                    .schemaType("brand")
                    .filter('_type == "brand" && relationship == "dealer"'),
                ),
              S.listItem()
                .title("Stocked")
                .child(
                  S.documentList()
                    .title("Stocked")
                    .schemaType("brand")
                    .filter('_type == "brand" && relationship == "stocked"'),
                ),
              S.divider(),
              S.listItem()
                .title("All Brands")
                .child(S.documentTypeList("brand").title("All Brands")),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories")),
      S.listItem()
        .title("Services")
        .schemaType("service")
        .child(S.documentTypeList("service").title("Services")),
    ]);
