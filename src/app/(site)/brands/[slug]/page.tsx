import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { BrandBadge, ProductGrid } from "@/components/product";
import { Breadcrumb, Button, Container } from "@/components/ui";
import {
  brandPageDescription,
  brandPageTitle,
  brandRelationshipStatement,
} from "@/lib/brand";
import { catalogHref } from "@/lib/filters";
import { sanityImageUrl } from "@/lib/sanity/image";
import { getBrandBySlug, getBrands } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { brandInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const LOGO_WIDTH = 320;
const LOGO_HEIGHT = 160;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const settings = await getShopSettings();
  const title = brand.seo?.title || brandPageTitle(brand, settings.city);
  const description =
    brand.seo?.description || brandPageDescription(settings.shopName, brand, settings.city);
  const logoUrl = brand.logo ? sanityImageUrl(brand.logo, 1200, 630) : null;
  const canonical = `/brands/${brand.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: logoUrl ? [logoUrl] : undefined,
    },
  };
}

export default async function BrandPage({ params }: PageProps<"/brands/[slug]">) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const settings = await getShopSettings();
  const logoUrl = brand.logo ? sanityImageUrl(brand.logo, LOGO_WIDTH, LOGO_HEIGHT) : null;
  const whatsappHref = buildWhatsAppLink(brandInquiryMessage(brand.name), settings.whatsappE164);

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />

      <header className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-surface md:w-64 md:shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${brand.name} logo`}
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              className="h-full w-full object-contain p-4"
            />
          ) : (
            <span
              aria-hidden
              className="px-4 text-center font-display text-h2 font-bold tracking-tight text-muted"
            >
              {brand.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <BrandBadge relationship={brand.relationship} className="self-start" />
          <h1 className="text-h1">{brand.name} tyres in {settings.city}</h1>
          <p className="max-w-[60ch] text-body-lg text-text">
            {brandRelationshipStatement(settings.shopName, brand, settings.city)}
          </p>
          {brand.description && (
            <p className="max-w-[60ch] whitespace-pre-line text-body text-muted">
              {brand.description}
            </p>
          )}
        </div>
      </header>

      <section aria-labelledby="brand-products" className="mt-12">
        <h2 id="brand-products" className="text-h2">
          {brand.name} tyres
        </h2>
        {brand.products.length > 0 ? (
          <div className="mt-6">
            <ProductGrid products={brand.products} headingLevel="h3" priorityCount={4} />
          </div>
        ) : (
          <p className="mt-4 max-w-[60ch] text-body text-muted">
            We do not have {brand.name} tyres listed online right now. Message us and we will tell
            you what is available.
          </p>
        )}
      </section>

      <section
        aria-labelledby="brand-cta"
        className="mt-12 rounded-lg border border-border bg-surface p-6 sm:p-10"
      >
        <h2 id="brand-cta" className="font-display text-h3">
          Looking for {brand.name} tyres?
        </h2>
        <p className="mt-3 max-w-[52ch] text-body text-muted">
          Tell us your size and we will confirm price and availability on WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            href={whatsappHref}
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            aria-label={`Ask about ${brand.name} tyres on WhatsApp`}
          >
            WhatsApp
          </Button>
          <Button
            href={catalogHref({ brandSlugs: [brand.slug] })}
            variant="secondary"
          >
            Filter the catalog by {brand.name}
          </Button>
        </div>
      </section>
    </Container>
  );
}
