/**
 * Local-only switch that lets `next dev` show the `[SAMPLE]` draft products so
 * cards, filters, and pagination can be seen without publishing invented
 * prices (Constitution §II.6). It needs all three: a dev server, the opt-in
 * flag, and a read token (drafts are not served to anonymous clients) — so a
 * production build can never turn it on, whatever the environment says.
 */
export function shouldShowSampleDrafts(env: {
  NODE_ENV?: string;
  SHOW_SAMPLE_DRAFTS?: string;
  SANITY_API_READ_TOKEN?: string;
}): boolean {
  return (
    env.NODE_ENV === "development" &&
    env.SHOW_SAMPLE_DRAFTS === "true" &&
    Boolean(env.SANITY_API_READ_TOKEN)
  );
}
