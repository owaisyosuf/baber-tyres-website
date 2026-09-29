import Image from "next/image";
import Link from "next/link";
import { BrandBadge, type BrandRelationship } from "@/components/product";
import { Card } from "@/components/ui";
import { sanityImageUrl, type SanityImageRef } from "@/lib/sanity/image";

export interface BrandCardBrand {
  name: string;
  slug: string;
  relationship: BrandRelationship;
  logo: SanityImageRef | null;
}

const LOGO_WIDTH = 240;
const LOGO_HEIGHT = 120;

/**
 * One brand on /brands — logo (or the name as a typographic mark when no logo
 * is uploaded, NFR-12), the relationship badge, and a link to the brand page.
 */
export function BrandCard({ brand }: { brand: BrandCardBrand }) {
  const logoUrl = brand.logo ? sanityImageUrl(brand.logo, LOGO_WIDTH, LOGO_HEIGHT, "max") : null;

  return (
    <Card as="article" interactive className="group relative flex h-full flex-col gap-4 p-4">
      {/* Most brand logos are drawn for light backgrounds, so they sit on a light plate. */}
      <div
        className={[
          "relative flex h-24 items-center justify-center overflow-hidden rounded-md",
          logoUrl ? "bg-text" : "bg-background",
        ].join(" ")}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${brand.name} logo`}
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className="h-full w-full object-contain p-3 opacity-80 grayscale transition-[filter,opacity] duration-300 ease-out-soft group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:opacity-100 group-focus-within:grayscale-0"
          />
        ) : (
          <span
            aria-hidden
            className="px-3 text-center font-display text-h3 font-bold tracking-tight text-muted"
          >
            {brand.name}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-body font-semibold text-text">
          <Link
            href={`/brands/${brand.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
          >
            {brand.name}
          </Link>
        </h3>
        <BrandBadge relationship={brand.relationship} />
      </div>
    </Card>
  );
}
