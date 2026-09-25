/**
 * Soft amber radial glow — design.md §7.4. Gives the hero depth on
 * near-black without relying on photography. Positioned absolutely; the
 * parent needs `position: relative`.
 */
export function RadialGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={["pointer-events-none absolute inset-0", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgb(255 149 0 / 0.22), transparent 60%)",
      }}
    />
  );
}
