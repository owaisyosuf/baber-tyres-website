import { useId } from "react";

/**
 * Abstract tyre-tread pattern — design.md §7.4. Used at low opacity as a
 * hero backdrop or section divider, standing in for the shop photography
 * that doesn't exist (NFR-12). A single tiled SVG <pattern>, so it stays
 * weightless regardless of the area it covers.
 *
 * Color comes from `currentColor` — wrap in a text-color utility (typically
 * text-border-strong or text-accent at low opacity) to theme it.
 */
export function TreadMotif({ className }: { className?: string }) {
  const rawId = useId();
  const patternId = `tread-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={patternId}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(15)"
        >
          <path
            d="M0 14h10M18 14h10M14 0v10M14 18v10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
