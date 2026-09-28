"use client";

import type { getFilterOptions } from "@/lib/sanity/queries";
import type { RawFilters } from "./raw";

export type FilterOptions = Awaited<ReturnType<typeof getFilterOptions>>;

interface FilterFieldsProps {
  /** Keeps ids unique when the fields are rendered twice (sidebar and sheet). */
  idPrefix: string;
  options: FilterOptions;
  raw: RawFilters;
  onToggleBrand: (slug: string, checked: boolean) => void;
  onCategory: (slug: string) => void;
  onSize: (field: "width" | "profile" | "rim", value: string) => void;
  onPrice: (field: "min" | "max", value: string) => void;
  /** Apply a typed price straight away (blur or Enter) instead of waiting. */
  onPriceCommit: () => void;
}

const legendClassName = "mb-2 text-label uppercase text-muted";
const optionClassName = "flex min-h-11 cursor-pointer items-center gap-3 text-body text-text";
const inputClassName =
  "min-h-11 w-full rounded-md border border-muted bg-background px-3 text-body text-text placeholder:text-muted";

/**
 * The filter controls — brand, vehicle type, size, and price (FR-B2). They are
 * fully controlled by the panel, and native inputs throughout so keyboard and
 * screen-reader behaviour comes for free.
 */
export function FilterFields({
  idPrefix,
  options,
  raw,
  onToggleBrand,
  onCategory,
  onSize,
  onPrice,
  onPriceCommit,
}: FilterFieldsProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="flex flex-col gap-6">
      {options.brands.length > 0 && (
        <fieldset>
          <legend className={legendClassName}>Brand</legend>
          {options.brands.map((brand) => (
            <label key={brand.slug} className={optionClassName}>
              <input
                type="checkbox"
                className="h-5 w-5 accent-accent"
                checked={raw.brands.includes(brand.slug)}
                onChange={(event) => onToggleBrand(brand.slug, event.target.checked)}
              />
              {brand.name}
            </label>
          ))}
        </fieldset>
      )}

      {options.categories.length > 0 && (
        <fieldset>
          <legend className={legendClassName}>Vehicle type</legend>
          <label className={optionClassName}>
            <input
              type="radio"
              name={id("category")}
              className="h-5 w-5 accent-accent"
              checked={raw.category === ""}
              onChange={() => onCategory("")}
            />
            All vehicles
          </label>
          {options.categories.map((category) => (
            <label key={category.slug} className={optionClassName}>
              <input
                type="radio"
                name={id("category")}
                className="h-5 w-5 accent-accent"
                checked={raw.category === category.slug}
                onChange={() => onCategory(category.slug)}
              />
              {category.name}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend className={legendClassName}>Size</legend>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["width", "Width", options.widths],
              ["profile", "Profile", options.profiles],
              ["rim", "Rim", options.rims],
            ] as const
          ).map(([field, label, values]) => {
            const current = raw[field];
            // A size that came in through the URL but is not in the list must
            // still be visible, or the form would silently disagree with it.
            const choices =
              current && !values.some((value) => String(value) === current)
                ? [...values, Number(current)].sort((a, b) => a - b)
                : values;
            return (
              <div key={field}>
                <label htmlFor={id(field)} className="mb-1 block text-small text-muted">
                  {label}
                </label>
                <select
                  id={id(field)}
                  className={inputClassName}
                  value={current}
                  onChange={(event) => onSize(field, event.target.value)}
                >
                  <option value="">Any</option>
                  {choices.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-small text-muted">
          Read it off your tyre&apos;s sidewall, e.g. 185/65 R15.
        </p>
      </fieldset>

      <fieldset>
        <legend className={legendClassName}>Price (PKR)</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["min", "Min"],
              ["max", "Max"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label htmlFor={id(field)} className="mb-1 block text-small text-muted">
                {label}
              </label>
              <input
                id={id(field)}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Any"
                className={`tabular ${inputClassName}`}
                value={raw[field]}
                onChange={(event) => onPrice(field, event.target.value)}
                onBlur={onPriceCommit}
              />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
