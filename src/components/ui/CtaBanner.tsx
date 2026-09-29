import type { ReactNode } from "react";
import { RadialGlow } from "@/components/icons";

interface CtaBannerProps {
  id: string;
  title: string;
  children: ReactNode;
  /** The buttons. */
  actions: ReactNode;
}

/** Closing call-to-action box for inner pages: heading, one line, and the contact buttons. */
export function CtaBanner({ id, title, children, actions }: CtaBannerProps) {
  return (
    <section
      aria-labelledby={id}
      className="relative overflow-hidden rounded-xl border border-accent/40 bg-surface p-6 sm:p-12"
    >
      <RadialGlow />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id={id} className="text-h2">
            {title}
          </h2>
          <p className="mt-3 max-w-[52ch] text-body text-muted">{children}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">{actions}</div>
      </div>
    </section>
  );
}
