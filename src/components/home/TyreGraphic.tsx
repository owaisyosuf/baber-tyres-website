/**
 * A large abstract tyre — design.md §7.4 tread-pattern geometry, drawn from
 * concentric rings: a dashed thick ring reads as tread blocks, a thin amber
 * ring as the rim, and a hub with five lug nuts. Purely decorative and static;
 * it stands in for the photography that doesn't exist (NFR-12). All colour
 * comes from theme tokens.
 */
const LUGS = [0, 72, 144, 216, 288];

export function TyreGraphic({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      fill="none"
      className={className}
    >
      {/* Tread blocks: a wide dashed stroke, 60 blocks around the ring */}
      <circle
        cx="200"
        cy="200"
        r="176"
        strokeWidth="30"
        strokeDasharray="11 7.13"
        className="stroke-border-strong"
      />
      <circle cx="200" cy="200" r="192" strokeWidth="1" className="stroke-border-strong" />
      <circle cx="200" cy="200" r="158" strokeWidth="1" className="stroke-border-strong" />

      {/* Sidewall */}
      <circle cx="200" cy="200" r="138" strokeWidth="1" className="stroke-border" />
      <circle cx="200" cy="200" r="118" strokeWidth="14" strokeDasharray="2 10" className="stroke-border" />

      {/* Rim */}
      <circle cx="200" cy="200" r="96" strokeWidth="2.5" className="stroke-accent" opacity="0.85" />
      <circle cx="200" cy="200" r="84" strokeWidth="1" className="stroke-border-strong" />

      {/* Spokes */}
      {LUGS.map((angle) => (
        <line
          key={angle}
          x1="200"
          y1="200"
          x2="200"
          y2="116"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-surface-raised"
          transform={`rotate(${angle + 36} 200 200)`}
        />
      ))}

      {/* Hub */}
      <circle cx="200" cy="200" r="30" strokeWidth="1.5" className="fill-surface stroke-border-strong" />
      {LUGS.map((angle) => (
        <circle
          key={angle}
          cx="200"
          cy="184"
          r="3.5"
          className="fill-accent"
          opacity="0.9"
          transform={`rotate(${angle} 200 200)`}
        />
      ))}
    </svg>
  );
}
