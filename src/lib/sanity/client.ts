import { createClient } from "next-sanity";
import { shouldShowSampleDrafts } from "./draft-preview";
import { apiVersion, dataset, projectId } from "./env";

const showSampleDrafts = shouldShowSampleDrafts(process.env);

/**
 * Read-only client, served from Sanity's CDN. design.md §6: the public
 * client never carries a token — reads go through the CDN by design.
 *
 * The one exception is the local sample-draft preview (see draft-preview.ts):
 * on a dev server with SHOW_SAMPLE_DRAFTS=true it reads the "drafts"
 * perspective with the server-only read token, skipping the CDN because
 * drafts are not cached there. Nothing else ever reaches this branch.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  ...(showSampleDrafts
    ? {
        useCdn: false,
        perspective: "drafts" as const,
        token: process.env.SANITY_API_READ_TOKEN,
      }
    : { useCdn: true, perspective: "published" as const }),
});
