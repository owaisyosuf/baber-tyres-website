import { serializeJsonLd } from "@/lib/seo/jsonLd";

/** Renders a JSON-LD structured-data block. Reused by the product and breadcrumb schemas later. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
