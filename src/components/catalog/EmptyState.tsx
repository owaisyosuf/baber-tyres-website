import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { CATALOG_PATH } from "@/lib/filters";

interface EmptyStateProps {
  /** Whether any filter is active — a filtered search offers a way out of it. */
  filtered: boolean;
  /** WhatsApp link, pre-filled with the size that was searched for, if any. */
  whatsappHref: string;
}

/**
 * No results — design.md §7.5, FR-B1. An empty catalog is a lead, not a dead
 * end: the visitor can message the shop about the size they could not find.
 */
export function EmptyState({ filtered, whatsappHref }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 sm:p-10">
      <h2 className="font-display text-h3">
        {filtered ? "No tyres match these filters" : "No tyres to show right now"}
      </h2>
      <p className="mt-3 max-w-[52ch] text-body text-muted">
        Size nahi mili? Humein WhatsApp par message karein — stock aata rehta hai, aur
        hum aap ke liye check kar dete hain.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          href={whatsappHref}
          variant="whatsapp"
          icon={<WhatsAppIcon />}
          aria-label="Ask about your size on WhatsApp"
        >
          Ask on WhatsApp
        </Button>
        {filtered && (
          <Link
            href={CATALOG_PATH}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-strong px-5 text-body font-semibold text-text transition-colors duration-150 ease-out-soft hover:border-accent hover:text-accent"
          >
            Clear all filters
          </Link>
        )}
      </div>
    </div>
  );
}
