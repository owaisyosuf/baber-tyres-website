// TEMPORARY — design-token proof for T002. Replaced by the real homepage in T016.

const colors = [
  ["background", "#0A0A0B"],
  ["surface", "#16161A"],
  ["surface-raised", "#1E1E24"],
  ["border", "#26262D"],
  ["border-strong", "#34343D"],
  ["accent", "#FF9500"],
  ["accent-glow", "#FFB340"],
  ["text", "#FAFAFA"],
  ["muted", "#8A8A94"],
  ["in-stock", "#22C55E"],
  ["out-stock", "#71717A"],
];

export default function TokenProof() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-label uppercase text-accent">Design tokens</p>
      <h1 className="mt-3 text-display">Baber Tyres Corporation</h1>
      <p className="mt-4 max-w-[70ch] text-body-lg text-muted">
        Importer &amp; dealer of 20+ tyre brands — M.A. Jinnah Road, Karachi.
      </p>

      <section className="mt-16">
        <h2 className="text-h2">Type scale</h2>
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          <p className="text-display">Display 800</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-body-lg">Body large — lead paragraph text.</p>
          <p className="text-body">Body — default paragraph text at 16px.</p>
          <p className="text-small text-muted">Small — metadata and captions.</p>
          <p className="text-label uppercase text-muted">Label — eyebrow</p>
          <p className="tabular text-h3 text-accent">PKR 14,500 · 185/65 R15</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-h2">Palette</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map(([name, hex]) => (
            <li
              key={name}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div
                className="h-12 w-full rounded-sm border border-border-strong"
                style={{ backgroundColor: hex }}
              />
              <p className="mt-2 text-small">{name}</p>
              <p className="tabular text-small text-muted">{hex}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-h2">Surfaces &amp; glow</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="text-h3">Raised</p>
            <p className="mt-2 text-small text-muted">surface + border</p>
          </div>
          <div className="rounded-lg border border-border-strong bg-surface-raised p-6 shadow-glow">
            <p className="text-h3">Hover</p>
            <p className="mt-2 text-small text-muted">
              surface-raised + border-strong + glow
            </p>
          </div>
          <div className="rounded-lg border border-accent bg-surface p-6 shadow-glow-strong">
            <p className="text-h3 text-accent">Accent</p>
            <p className="mt-2 text-small text-muted">amber border + glow</p>
          </div>
        </div>
      </section>

      <section className="mt-16 mb-24">
        <h2 className="text-h2">Contrast check</h2>
        <div className="mt-6 space-y-3">
          <p className="text-body">text on background — 16.5:1</p>
          <p className="rounded-md bg-surface p-3 text-body">
            text on surface — 14.2:1
          </p>
          <p className="text-h3 text-accent">accent on background — 8.9:1</p>
          <p className="inline-block rounded-md bg-accent px-4 py-2 text-body font-semibold text-background">
            background on accent — 8.9:1
          </p>
        </div>
      </section>
    </main>
  );
}
