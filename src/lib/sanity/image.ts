import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** The bits of a Sanity image the URL builder needs — what the queries project. */
export interface SanityImageRef {
  asset: { _ref: string } | null;
}

/**
 * A cropped, auto-format image URL from the Sanity image pipeline (AVIF/WebP
 * where the browser supports it). Returns null when the image has no asset, so
 * callers can render their no-photo fallback (NFR-12).
 */
export function sanityImageUrl(
  image: SanityImageRef,
  width: number,
  height: number,
): string | null {
  if (!image.asset) return null;
  return builder
    .image({ asset: { _ref: image.asset._ref } })
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .url();
}
