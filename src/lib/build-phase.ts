/**
 * Resilience with one exception (NFR-11). At request time a Sanity failure is
 * swallowed so the visitor still gets a usable page. During `next build` the
 * same failure must NOT be swallowed: the fallback would be prerendered into
 * the static page (a missing brand list, default hours) and stay there until
 * the next revalidation. Failing the build is loud and retryable; a quietly
 * degraded page is neither. Call this first in any catch that would otherwise
 * fall back.
 */
export function rethrowDuringBuild(
  error: unknown,
  env: Record<string, string | undefined> = process.env,
): void {
  if (env.NEXT_PHASE === "phase-production-build") throw error;
}
