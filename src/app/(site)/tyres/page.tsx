import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogSkeleton } from "@/components/skeleton/Skeletons";
import { Button, Container, PageHero } from "@/components/ui";
import {
  buildCatalogQuery,
  CATALOG_PATH,
  catalogHref,
  parseCatalogSearchParams,
} from "@/lib/filters";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { resolveSearchText } from "@/lib/search";
import { getFilterOptions, getProducts } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { socialMetadata } from "@/lib/seo/metadata";
import { siteUrl } from "@/lib/site-url";
import { buildWhatsAppLink, genericInquiryMessage, sizeWhatsAppLink } from "@/lib/whatsapp";
import { rethrowDuringBuild } from "@/lib/build-phase";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  const title = "Tyres in Karachi";
  const description = `Car, SUV, truck, forklift and off-road tyres from the brands we import and deal in, at ${settings.addressLine}, ${settings.city}. Filter by brand, size or price, or message us on WhatsApp.`;
  return {
    title,
    description,
    // Every filtered or paged view is the same catalog; only /tyres is indexed.
    alternates: { canonical: CATALOG_PATH },
    ...socialMetadata({ title, description, path: CATALOG_PATH, siteName: settings.shopName }),
  };
}

/** Shown when Sanity cannot be reached — the visitor can still reach the shop (NFR-11). */
async function CatalogUnavailable() {
  const settings = await getShopSettings();
  return (
    <div role="alert" className="rounded-lg border border-border bg-surface p-6 sm:p-10">
      <h2 className="font-display text-h3">We could not load the tyre list just now</h2>
      <p className="mt-3 max-w-[52ch] text-body text-muted">
        Please message us on WhatsApp and we will help you directly with sizes, brands and prices.
      </p>
      <div className="mt-6">
        <Button
          href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
          variant="whatsapp"
          icon={<WhatsAppIcon />}
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: SearchParams }) {
  const { filters, page } = parseCatalogSearchParams(await searchParams);

  // Site search: a size, brand or vehicle type in the text becomes a real
  // filter, so the visitor lands on the same URL the filter panel would build.
  if (filters.text !== undefined) {
    let resolved;
    try {
      const options = await getFilterOptions();
      resolved = resolveSearchText(
        filters,
        options.brands,
        options.categories,
        options.sizeLabels,
      );
    } catch (error) {
      rethrowDuringBuild(error);
      console.error("Filter options unavailable for search:", error);
      return <CatalogUnavailable />;
    }
    if (buildCatalogQuery(resolved) !== buildCatalogQuery(filters)) {
      redirect(catalogHref(resolved));
    }
  }

  let data;
  try {
    const [result, options, settings] = await Promise.all([
      getProducts(filters, { page }),
      getFilterOptions(),
      getShopSettings(),
    ]);
    data = { result, options, settings };
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Catalog unavailable:", error);
    return <CatalogUnavailable />;
  }

  const { items, total, pageSize } = data.result;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // A link to a page that no longer exists (products were removed) goes to the last real one.
  if (page > totalPages) redirect(catalogHref(filters, totalPages));

  return (
    <CatalogView
      filters={filters}
      options={data.options}
      products={items}
      total={total}
      page={page}
      pageSize={pageSize}
      whatsappHref={sizeWhatsAppLink(filters, data.settings.whatsappE164)}
    />
  );
}

export default function TyresPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { name: "Home", path: "/" },
            { name: "Tyres", path: CATALOG_PATH },
          ],
          siteUrl,
        )}
      />
      <PageHero
        eyebrow="Tyre catalog"
        title="Tyres"
        intro="Car, SUV, truck, forklift and off-road tyres. Search or filter by brand, size or price — or message us and we will find your size."
        breadcrumb={[{ label: "Tyres" }]}
      >
        <SiteSearch className="w-full max-w-lg" />
      </PageHero>
      <Container className="py-8 md:py-12">
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
