import Form from "next/form";
import { useId } from "react";
import { SearchIcon } from "@/components/icons";
import { CATALOG_PATH } from "@/lib/filters";

interface SiteSearchProps {
  /** "compact" for the header bar; "full" for page bodies and the mobile menu. */
  size?: "compact" | "full";
  defaultValue?: string;
  onSubmit?: () => void;
  className?: string;
}

/**
 * Site search: a plain GET form to the catalog with `q`, so it works without
 * JavaScript. The catalog turns a size, brand or vehicle type in the text
 * into the matching filters (lib/search.ts).
 */
export function SiteSearch({ size = "full", defaultValue, onSubmit, className }: SiteSearchProps) {
  const inputId = useId();
  const compact = size === "compact";

  return (
    <Form
      action={CATALOG_PATH}
      role="search"
      onSubmit={onSubmit}
      className={["relative flex items-center", className].filter(Boolean).join(" ")}
    >
      <label htmlFor={inputId} className="sr-only">
        Search tyres by size or brand
      </label>
      <input
        id={inputId}
        type="search"
        name="q"
        defaultValue={defaultValue}
        maxLength={60}
        placeholder={compact ? "Size or brand…" : "Size or brand, e.g. 185/65 R15"}
        autoComplete="off"
        enterKeyHint="search"
        className={[
          "w-full rounded-md border border-border-strong bg-background pr-12 pl-4 text-text placeholder:text-muted",
          "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          compact ? "h-10 text-small" : "h-12 text-body",
        ].join(" ")}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-muted transition-colors duration-150 ease-out-soft hover:text-accent"
      >
        <SearchIcon size={20} />
      </button>
    </Form>
  );
}
