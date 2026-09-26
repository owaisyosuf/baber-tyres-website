"use client";

import Image from "next/image";
import { useState } from "react";
import { TreadMotif } from "@/components/icons";
import { sanityImageUrl, type SanityImageRef } from "@/lib/sanity/image";

export interface ProductGalleryImage extends SanityImageRef {
  alt: string;
}

interface ProductGalleryProps {
  images: readonly ProductGalleryImage[];
  /** Fallback typographic mark and default alt text when an image has none. */
  productName: string;
}

const MAIN_WIDTH = 960;
const MAIN_HEIGHT = 720;
const THUMB_SIZE = 128;

/**
 * Product detail gallery — design.md §7.5, §12 (one of the few client
 * components; the rest of the page is static). A single main image with a
 * thumbnail strip when there is more than one; the same no-photo fallback as
 * ProductCard (NFR-12) when there is none at all.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];
  const activeUrl = active ? sanityImageUrl(active, MAIN_WIDTH, MAIN_HEIGHT) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-background">
        {activeUrl && active ? (
          <Image
            key={activeIndex}
            src={activeUrl}
            alt={active.alt || productName}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center">
            <TreadMotif className="absolute inset-0 h-full w-full text-border opacity-60" />
            <span className="relative px-4 text-center font-display text-h3 font-bold tracking-tight text-muted">
              {productName}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div role="group" aria-label="Product images" className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => {
            const thumbUrl = sanityImageUrl(image, THUMB_SIZE, THUMB_SIZE);
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                aria-pressed={isActive}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                onClick={() => setActiveIndex(index)}
                className={[
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-colors duration-150 ease-out-soft",
                  isActive
                    ? "border-accent"
                    : "border-border hover:border-border-strong",
                ].join(" ")}
              >
                {thumbUrl && (
                  <Image src={thumbUrl} alt="" fill sizes="64px" className="object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
