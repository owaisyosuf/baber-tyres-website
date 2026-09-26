import Image from "next/image";
import Link from "next/link";
import { TreadMotif, WhatsAppIcon } from "@/components/icons";
import { Button, Card } from "@/components/ui";
import { formatTyreSize } from "@/lib/format";
import { sanityImageUrl, type SanityImageRef } from "@/lib/sanity/image";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { BrandBadge, type BrandRelationship } from "./BrandBadge";
import { PriceTag } from "./PriceTag";
import { StockBadge } from "./StockBadge";

/** What the card reads. The catalog, featured, and related queries all satisfy it. */
export interface ProductCardProduct {
  name: string;
  slug: string;
  price: number;
  inStock: boolean | null;
  sizeLabelOverride?: string | null;
  width: number;
  profile: number;
  rim: number;
  images: readonly (SanityImageRef & { alt: string })[] | null;
  brand: { name: string; relationship: BrandRelationship } | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  /** The heading level to use — one below the section heading the card sits under. */
  headingLevel?: "h2" | "h3";
  /** Load the image eagerly; for cards in the first row, which can be the LCP element. */
  priority?: boolean;
}

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;

/**
 * Catalog card — FR-B1, design.md §7.5. The whole card is one link, built
 * with a stretched title link so the WhatsApp button can sit above it as a
 * separate control: interactive elements are never nested inside one another.
 * Out-of-stock products stay listed and inquirable but recede visually.
 */
export function ProductCard({
  product,
  headingLevel: Heading = "h3",
  priority = false,
}: ProductCardProps) {
  // Stock defaults to true in Studio, so a document that never set it is in stock.
  const inStock = product.inStock !== false;
  const size = formatTyreSize(product);
  const image = product.images?.[0];
  const imageUrl = image ? sanityImageUrl(image, IMAGE_WIDTH, IMAGE_HEIGHT) : null;

  return (
    <Card
      as="article"
      interactive
      className="group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        {imageUrl && image ? (
          <Image
            src={imageUrl}
            alt={image.alt || product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className={[
              "object-cover transition-transform duration-300 ease-out-soft group-hover:scale-[1.03] motion-reduce:group-hover:scale-100",
              inStock ? "" : "opacity-60",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ) : (
          // No photograph yet (NFR-12): the brand name as a typographic mark
          // over the tread pattern.
          <div aria-hidden className="flex h-full items-center justify-center">
            <TreadMotif className="absolute inset-0 h-full w-full text-border opacity-60" />
            <span className="relative px-4 text-center font-display text-h3 font-bold tracking-tight text-muted">
              {product.brand?.name ?? product.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {product.brand && (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-label uppercase text-muted">
              {product.brand.name}
            </span>
            <BrandBadge relationship={product.brand.relationship} />
          </div>
        )}

        <Heading className="line-clamp-2 text-body font-semibold leading-snug text-text">
          <Link
            href={`/tyres/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
          >
            {product.name}
          </Link>
        </Heading>

        <p className="tabular text-small text-muted">{size}</p>

        <PriceTag price={product.price} muted={!inStock} />

        <StockBadge inStock={inStock} className="self-start" />
        {!inStock && (
          <p className="text-small text-muted">
            Out of stock right now — message us and we will tell you when it is
            back.
          </p>
        )}

        {/* Above the stretched link so it stays its own control. */}
        <div className="relative z-10 mt-auto pt-2">
          <Button
            href={productWhatsAppLink({
              name: product.name,
              size: {
                width: product.width,
                profile: product.profile,
                rim: product.rim,
                sizeLabelOverride: product.sizeLabelOverride,
              },
            })}
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            fullWidth
            aria-label={`Ask about ${product.name} on WhatsApp`}
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </Card>
  );
}
