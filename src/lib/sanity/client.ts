import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Read-only client, served from Sanity's CDN. design.md §6: the public
 * client never carries a token — reads go through the CDN by design.
 * `SANITY_API_READ_TOKEN` (server-only) is reserved for a future private
 * dataset or Draft Mode; nothing in this project reads it yet.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
