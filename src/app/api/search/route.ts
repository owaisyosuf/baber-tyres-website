import type { NextRequest } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { cleanSearchText } from "@/lib/filters";
import { resolveSearchText } from "@/lib/search";
import {
  buildSuggestions,
  prefixMatchText,
  type SuggestionsResponse,
} from "@/lib/search-suggest";
import { getFilterOptions, getProducts } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, sizeInquiryMessage } from "@/lib/whatsapp";

const MIN_LENGTH = 2;
const PRODUCT_SUGGESTIONS = 5;

async function suggestionsFor(text: string): Promise<SuggestionsResponse> {
  "use cache";
  cacheTag("product", "brand", "category", "settings");
  cacheLife("hours");

  const [options, settings] = await Promise.all([getFilterOptions(), getShopSettings()]);
  const resolved = resolveSearchText(
    { text },
    options.brands,
    options.categories,
    options.sizeLabels,
  );
  const { items, total } = await getProducts(
    { ...resolved, text: resolved.text === undefined ? undefined : prefixMatchText(resolved.text) },
    { pageSize: PRODUCT_SUGGESTIONS },
  );

  return {
    suggestions: buildSuggestions({
      text,
      resolved,
      brands: options.brands,
      categories: options.categories,
      products: items,
      total,
    }),
    whatsappHref: buildWhatsAppLink(sizeInquiryMessage({ ...resolved, text }), settings.whatsappE164),
  };
}

/** Search-as-you-type suggestions for the site search box (SiteSearch). */
export async function GET(request: NextRequest) {
  const text = cleanSearchText(request.nextUrl.searchParams.get("q") ?? undefined);
  if (text === undefined || text.length < MIN_LENGTH) {
    return Response.json({ suggestions: [], whatsappHref: "" } satisfies SuggestionsResponse);
  }

  try {
    return Response.json(await suggestionsFor(text));
  } catch (error) {
    console.error("Search suggestions unavailable:", error);
    return Response.json({ message: "Suggestions unavailable" }, { status: 503 });
  }
}
