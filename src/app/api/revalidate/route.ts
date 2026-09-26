import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { tagsForDocument, type WebhookPayload } from "@/lib/sanity/revalidate";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    // Fail closed: without a secret nothing can be verified.
    console.error("Missing environment variable: SANITY_REVALIDATE_SECRET");
    return Response.json(
      { message: "Revalidation is not configured" },
      { status: 500 },
    );
  }

  let parsed;
  try {
    parsed = await parseBody<WebhookPayload>(request, secret);
  } catch {
    // Unparseable body or a malformed signature header — treated as
    // unauthenticated, since a genuine Sanity delivery is never either.
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  if (!parsed.isValidSignature) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }
  if (!parsed.body) {
    return Response.json({ message: "Empty payload" }, { status: 400 });
  }

  const tags = tagsForDocument(parsed.body);
  for (const tag of tags) {
    // Webhook-driven, so updateTag isn't available; expire immediately so the
    // owner's next page load shows the published change rather than stale data.
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ revalidated: tags });
}
