import Image from "next/image";
import type { ReactNode } from "react";
import { TreadMotif } from "@/components/icons";
import { sanityImageUrl, type SanityImageRef } from "@/lib/sanity/image";

interface MediaOrIconProps {
  image: (SanityImageRef & { alt?: string | null }) | null | undefined;
  width: number;
  height: number;
  sizes: string;
  /** Sets the box's shape, e.g. an aspect-ratio utility. */
  className?: string;
  /** Shown over the tread motif when there is no photo (NFR-12). */
  icon: ReactNode;
  priority?: boolean;
}

/** A Sanity photo filling its box, or the item's icon on the tread motif when no photo is set. */
export function MediaOrIcon({
  image,
  width,
  height,
  sizes,
  className,
  icon,
  priority = false,
}: MediaOrIconProps) {
  const url = image ? sanityImageUrl(image, width, height) : null;

  return (
    <div
      className={["relative w-full overflow-hidden bg-background", className]
        .filter(Boolean)
        .join(" ")}
    >
      {url ? (
        <Image
          src={url}
          alt={image?.alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 ease-out-soft group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div aria-hidden className="flex h-full items-center justify-center text-accent">
          <TreadMotif className="absolute inset-0 h-full w-full text-border opacity-60" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-surface">
            {icon}
          </span>
        </div>
      )}
    </div>
  );
}
