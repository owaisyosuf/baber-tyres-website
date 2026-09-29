import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/product";
import { Unavailable } from "@/components/states/Unavailable";
import { Breadcrumb, Button, Container } from "@/components/ui";
import { MediaOrIcon } from "@/components/ui/MediaOrIcon";
import {
  categoryHeading,
  categoryKeyword,
  categoryPageDescription,
  categoryPageTitle,
} from "@/lib/category";
import { rethrowDuringBuild } from "@/lib/build-phase";
import { slugParams } from "@/lib/static-params";
import { CATALOG_PATH, catalogHref } from "@/lib/filters";
import { getCategories, getCategoryBySlug } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { socialMetadata } from "@/lib/seo/metadata";
import { siteUrl } from "@/lib/site-url";
import { buildWhatsAppLink, categoryInquiryMessage } from "@/lib/whatsapp";

export async function generateStaticParams() {
  try {
    return slugParams(await getCategories());
  } catch (error) {
    // Fails the build. At request time (only `next dev` calls this then) Cache Components
    // rejects an empty list, so hand back one placeholder: the page then hits the same
    // Sanity failure and shows the error boundary's contact actions instead of a blank 500.
    rethrowDuringBuild(error);
    console.error("Category slugs unavailable:", error);
    return [{ slug: "unavailable" }];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Category unavailable for metadata:", error);
    return { title: "Category" };
  }
  if (!category) notFound();

  const settings = await getShopSettings();
  const title = category.seo?.title || categoryPageTitle(category, settings.city);
  const description =
    category.seo?.description ||
    categoryPageDescription(category, settings.shopName, settings.city);
  const canonical = `/categories/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    ...socialMetadata({ title, description, path: canonical, siteName: settings.shopName }),
  };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Category unavailable:", error);
    return <Unavailable what="this category" />;
  }
  if (!category) notFound();

  const settings = await getShopSettings();
  const keyword = categoryKeyword(category);
  const whatsappHref = buildWhatsAppLink(categoryInquiryMessage(keyword), settings.whatsappE164);

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb
        items={[{ label: "Tyres", href: CATALOG_PATH }, { label: category.name }]}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { name: "Tyres", path: CATALOG_PATH },
            { name: category.name, path: `/categories/${category.slug}` },
          ],
          siteUrl,
        )}
      />

      <header className="mt-6 grid items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span
            aria-hidden
            className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface text-accent"
          >
            <CategoryIcon icon={category.icon} className="h-8 w-8" />
          </span>
          <h1 className="text-h1">{categoryHeading(category, settings.city)}</h1>
          {category.description && (
            <p className="max-w-[60ch] whitespace-pre-line text-body-lg text-muted">
              {category.description}
            </p>
          )}
        </div>
        {category.image?.asset && (
          <MediaOrIcon
            image={category.image}
            width={800}
            height={600}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="aspect-[4/3] rounded-lg border border-border"
            icon={<CategoryIcon icon={category.icon} className="h-8 w-8" />}
          />
        )}
      </header>

      <section aria-labelledby="category-products" className="mt-12">
        <h2 id="category-products" className="text-h2">
          {category.name} tyres
        </h2>
        {category.products.length > 0 ? (
          <div className="mt-6">
            <ProductGrid products={category.products} headingLevel="h3" priorityCount={4} />
          </div>
        ) : (
          <p className="mt-4 max-w-[60ch] text-body text-muted">
            We do not have {keyword} tyres listed online right now. Message us with your size and
            we will tell you what is available.
          </p>
        )}
      </section>

      <section
        aria-labelledby="category-cta"
        className="mt-12 rounded-lg border border-border bg-surface p-6 sm:p-10"
      >
        <h2 id="category-cta" className="font-display text-h3">
          Looking for {keyword} tyres?
        </h2>
        <p className="mt-3 max-w-[52ch] text-body text-muted">
          Tell us your size and we will confirm price and availability on WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            href={whatsappHref}
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            aria-label={`Ask about ${keyword} tyres on WhatsApp`}
          >
            WhatsApp
          </Button>
          <Button href={catalogHref({ categorySlug: category.slug })} variant="secondary">
            Filter the catalog by size
          </Button>
        </div>
      </section>
    </Container>
  );
}
