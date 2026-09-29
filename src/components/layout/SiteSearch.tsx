"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { SearchIcon, WhatsAppIcon } from "@/components/icons";
import { CATALOG_PATH } from "@/lib/filters";
import type { Suggestion, SuggestionsResponse } from "@/lib/search-suggest";

interface SiteSearchProps {
  /** "compact" for the header bar; "full" for page bodies and the mobile menu. */
  size?: "compact" | "full";
  /** Called when the visitor submits or picks a suggestion (closes the mobile menu). */
  onSubmit?: () => void;
  className?: string;
}

const MIN_LENGTH = 2;
const DEBOUNCE_MS = 200;

type State =
  | { status: "idle" }
  | { status: "ready"; query: string; suggestions: Suggestion[]; whatsappHref: string };

/**
 * Site search with suggestions as you type. Underneath it is a plain GET form
 * to the catalog with `q`, so it works without JavaScript; with it, a
 * combobox lists the size, brands, vehicle types and products that match
 * (api/search), and offers WhatsApp when nothing does. Arrow keys move through
 * the list, Enter opens the highlighted item, Esc closes it.
 */
export function SiteSearch({ size = "full", onSubmit, className }: SiteSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const compact = size === "compact";

  const query = value.trim();

  useEffect(() => {
    if (query.length < MIN_LENGTH) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as SuggestionsResponse;
        setState({ status: "ready", query, ...data });
        setActive(-1);
      } catch {
        // Aborted by a newer keystroke, or offline: the form still submits.
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => () => clearTimeout(blurTimer.current), []);

  const ready = state.status === "ready" && state.query === query && query.length >= MIN_LENGTH;
  const suggestions = ready ? state.suggestions : [];
  const whatsappHref = ready ? state.whatsappHref : "";
  const showList = open && ready;
  // No product listed for what was typed (even if a size or brand row matched):
  // a WhatsApp row closes the list, so a size that is not online is still a lead.
  const noProducts = !suggestions.some((suggestion) => suggestion.kind === "product");
  const whatsappIndex = noProducts ? suggestions.length : -1;
  const optionCount = suggestions.length + (noProducts ? 1 : 0);

  const optionId = (index: number) => `${listId}-option-${index}`;

  const go = (index: number) => {
    setOpen(false);
    onSubmit?.();
    if (index === whatsappIndex) {
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(suggestions[index].href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!showList || optionCount === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current + 1) % optionCount);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current <= 0 ? optionCount - 1 : current - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      go(active);
    }
  };

  const status = !showList
    ? ""
    : noProducts
      ? `No tyres listed for ${query}. You can ask on WhatsApp.`
      : `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"}`;

  return (
    <Form
      action={CATALOG_PATH}
      role="search"
      onSubmit={() => {
        setOpen(false);
        onSubmit?.();
      }}
      className={["relative flex items-center", className].filter(Boolean).join(" ")}
    >
      <label htmlFor={inputId} className="sr-only">
        Search tyres by size or brand
      </label>
      <input
        id={inputId}
        type="search"
        name="q"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 150);
        }}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
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

      <ul
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!showList}
        // Keeps focus in the input while an option is clicked.
        onMouseDown={(event) => event.preventDefault()}
        className={[
          "absolute top-full left-0 z-50 mt-2 overflow-hidden rounded-lg border border-border-strong bg-surface py-1 shadow-glow",
          // The header box is narrow; its list may grow wider. Elsewhere it matches the input.
          compact ? "w-96" : "right-0",
        ].join(" ")}
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={`${suggestion.kind}-${suggestion.href}`}
            id={optionId(index)}
            role="option"
            aria-selected={active === index}
            onClick={() => go(index)}
            onMouseEnter={() => setActive(index)}
            className={[
              "flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5",
              active === index ? "bg-surface-raised" : "",
              suggestion.kind === "all" ? "border-t border-border text-accent" : "text-text",
            ].join(" ")}
          >
            <span className="truncate text-body">{suggestion.label}</span>
            {suggestion.detail && (
              <span className="shrink-0 text-small text-muted">{suggestion.detail}</span>
            )}
          </li>
        ))}
        {noProducts && (
          <li
            id={optionId(whatsappIndex)}
            role="option"
            aria-selected={active === whatsappIndex}
            onClick={() => go(whatsappIndex)}
            onMouseEnter={() => setActive(whatsappIndex)}
            className={[
              "flex cursor-pointer flex-col gap-1 px-4 py-3",
              suggestions.length > 0 ? "border-t border-border" : "",
              active === whatsappIndex ? "bg-surface-raised" : "",
            ].join(" ")}
          >
            <span className="text-small text-muted">No tyres listed online for “{query}”</span>
            <span className="flex items-center gap-2 text-body font-semibold text-accent">
              <WhatsAppIcon size={18} />
              Ask on WhatsApp
            </span>
          </li>
        )}
      </ul>
      <span role="status" className="sr-only">
        {status}
      </span>
    </Form>
  );
}
