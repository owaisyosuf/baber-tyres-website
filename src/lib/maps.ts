/**
 * Map helpers for the contact page — FR-D3. The embed URL is editable in
 * Studio, so it is only trusted as an iframe source when it is an https Google
 * Maps embed; anything else is dropped rather than rendered.
 */
const EMBED_HOSTS = new Set(["www.google.com", "google.com", "maps.google.com"]);

export function safeMapEmbedUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    const isGoogleMapsEmbed =
      parsed.protocol === "https:" &&
      EMBED_HOSTS.has(parsed.hostname) &&
      parsed.pathname.startsWith("/maps");
    return isGoogleMapsEmbed ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/**
 * A "get directions" link for when no embed pin has been set. It points at the
 * pin's coordinates when they are known, otherwise at a search for the address
 * — a link the visitor opens, never a pin we claim is exact.
 */
export function mapsDirectionsUrl(place: {
  addressLine: string;
  city: string;
  mapLat: number | null;
  mapLng: number | null;
}): string {
  const query =
    place.mapLat !== null && place.mapLng !== null
      ? `${place.mapLat},${place.mapLng}`
      : `${place.addressLine}, ${place.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
