import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import {
  BrandBadge,
  PriceTag,
  ProductGallery,
  ProductGrid,
  SpecsTable,
  StockBadge,
} from "@/components/product";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb, Button, Container } from "@/components/ui";
import { CATALOG_PATH, catalogHref } from "@/lib/filters";
import { formatPhoneDisplay, formatTyreSize } from "@/lib/format";
import { sanityImageUrl } from "@/lib/sanity/image";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildProductJsonLd } from "@/lib/seo/product";
import { siteUrl } from "@/lib/site-url";
import type { RELATED_PRODUCTS_QUERY_RESULT } from "@/sanity/types";
import { buildWhatsAppLink, productInquiryMessage } from "@/lib/whatsapp";

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 900;

export async function generateStaticParams() {
  const products = await getProductSlugs();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tyres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const size = formatTyreSize(product);
  const title = product.seo?.title || `${product.name} — ${size}`;
  const description =
    product.seo?.description ||
    `${product.name} (${size}) from ${product.brand.name}, ${product.category.name.toLowerCase()} tyres at Baber Tyres Corporation, Karachi. Message us on WhatsApp for price and availability.`;
  const ogImage = product.images[0]
    ? sanityImageUrl(product.images[0], OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT)
    : null;
  const canonical = `/tyres/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/tyres/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const inStock = product.inStock !== false;
  const size = formatTyreSize(product);
  const settings = await getShopSettings();

  // Related products are a nice-to-have alongside the product's own details,
  // so a Sanity hiccup here hides the section rather than taking the whole
  // page down (full outage handling for every route is T031).
  let related: RELATED_PRODUCTS_QUERY_RESULT = [];
  try {
    related = await getRelatedProducts({
      slug: product.slug,
      brandId: product.brand._id,
      categoryId: product.category._id,
    });
  } catch (error) {
    console.error("Related products unavailable:", error);
  }

  const imageUrls = product.images
    .map((image) => sanityImageUrl(image, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT))
    .filter((url): url is string => url !== null);

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Tyres", href: CATALOG_PATH },
          {
            label: product.category.name,
            href: catalogHref({ categorySlug: product.category.slug }),
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-label uppercase text-muted">{product.brand.name}</span>
            <BrandBadge relationship={product.brand.relationship} />
          </div>

          <h1 className="text-h1">{product.name}</h1>
          <p className="tabular text-body-lg text-muted">{size}</p>

          <PriceTag price={product.price} muted={!inStock} />

          <StockBadge inStock={inStock} className="self-start" />
          {!inStock && (
            <p className="text-small text-muted">
              Out of stock right now — message us and we will tell you when it is back.
            </p>
          )}

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              href={buildWhatsAppLink(
                productInquiryMessage({ name: product.name, size: product }),
                settings.whatsappE164,
              )}
              variant="whatsapp"
              icon={<WhatsAppIcon />}
              aria-label={`Ask about ${product.name} on WhatsApp`}
            >
              WhatsApp
            </Button>
            <Button
              href={`tel:${settings.phoneE164}`}
              variant="secondary"
              icon={<PhoneIcon />}
              aria-label={`Call us on ${formatPhoneDisplay(settings.phoneE164)}`}
            >
              Call
            </Button>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <SpecsTable
              size={size}
              category={product.category.name}
              loadIndex={product.loadIndex}
              speedRating={product.speedRating}
            />
          </div>

          {product.description && (
            <p className="max-w-[65ch] text-body text-muted">{product.description}</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12 lg:mt-16">
          <h2 className="text-h2">Related tyres</h2>
          <div className="mt-6">
            <ProductGrid products={related} headingLevel="h3" />
          </div>
        </div>
      )}

      <JsonLd
        data={buildProductJsonLd(
          {
            name: product.name,
            slug: product.slug,
            price: product.price,
            inStock: product.inStock,
            description: product.description,
            images: imageUrls,
            brand: { name: product.brand.name },
            category: { name: product.category.name },
          },
          siteUrl,
        )}
      />
    </Container>
  );
}
