/**
 * A placeholder block for content that is still loading — design.md §13. It is
 * deliberately still: no pulse or shimmer, because Constitution §IV allows no
 * looping animation. Decorative, so hidden from assistive tech; the loading
 * region that holds it carries the "Loading…" text instead.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={["rounded-md bg-surface-raised", className].filter(Boolean).join(" ")} />;
}
