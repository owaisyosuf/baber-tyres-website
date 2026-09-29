import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** The bits of a Sanity image the URL builder needs — what the queries project. */
export interface SanityImageRef {
  asset?: { _ref: string } | null;
}

/**
 * An auto-format image URL from the Sanity image pipeline (AVIF/WebP where the
 * browser supports it). Photos are cropped to fill the box; logos pass
 * `fit: "max"` so the whole mark is kept, whatever its shape. Returns null when
 * the image has no asset, so callers can render their no-photo fallback (NFR-12).
 */
export function sanityImageUrl(
  image: SanityImageRef,
  width: number,
  height: number,
  fit: "crop" | "max" = "crop",
): string | null {
  if (!image.asset) return null;
  const url = builder
    .image({ asset: { _ref: image.asset._ref } })
    .width(width)
    .height(height)
    .fit(fit)
    .auto("format");
  // The builder otherwise adds a `rect` crop to the box's aspect ratio, which cuts wide logos.
  return (fit === "max" ? url.ignoreImageParams() : url).url();
}
