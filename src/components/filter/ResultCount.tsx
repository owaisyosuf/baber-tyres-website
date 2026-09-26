/**
 * How many tyres match the current filters. It is a polite live region that
 * stays mounted while the results change underneath it, so a screen reader
 * hears the new count after each filter change (FR-B2).
 */
export function ResultCount({ count }: { count: number }) {
  return (
    <p role="status" aria-live="polite" className="tabular text-small text-muted">
      {count === 0
        ? "No tyres match these filters"
        : `${count} ${count === 1 ? "tyre" : "tyres"}`}
    </p>
  );
}
