import { mapsDirectionsUrl, safeMapEmbedUrl } from "@/lib/maps";
import type { ShopSettings } from "@/lib/settings";

/**
 * The shop's map — FR-A6, FR-D3. The iframe is lazy-loaded and only rendered
 * from a validated Google Maps embed URL (lib/maps.ts); until the owner
 * confirms a pin there is just a link that opens the address in Google Maps.
 */
export function ShopMap({ settings }: { settings: ShopSettings }) {
  const embedUrl = safeMapEmbedUrl(settings.mapEmbedUrl);
  const directionsUrl = mapsDirectionsUrl(settings);

  return (
    <div>
      {embedUrl && (
        // Below the fold and lazy, so it never competes with the page's LCP.
        <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface md:aspect-[16/7]">
          <iframe
            src={embedUrl}
            title={`Map showing ${settings.shopName} on ${settings.addressLine}, ${settings.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      )}
      <p className="text-body">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          Open {settings.addressLine}, {settings.city} in Google Maps
        </a>
      </p>
    </div>
  );
}
