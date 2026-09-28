import { CATALOG_PATH } from "@/lib/filters";
import { Button } from "@/components/ui";

export interface SizeFinderOptions {
  categories: readonly { name: string; slug: string }[];
  widths: readonly number[];
  profiles: readonly number[];
  rims: readonly number[];
}

const selectClassName =
  "min-h-11 w-full rounded-md border border-border-strong bg-background px-3 text-body text-text";
const labelClassName = "mb-1 block text-small text-muted";

/**
 * The size finder — FR-A2. A plain GET form to the catalog, so it works with
 * JavaScript off: the browser builds `/tyres?category=…&width=…&profile=…&rim=…`
 * itself, and the catalog's own URL parser (lib/filters.ts) validates it and
 * drops any field left on "Any". Native selects only, so no client code ships.
 */
export function SizeFinderForm({ options }: { options: SizeFinderOptions }) {
  const sizes = [
    ["width", "Width", options.widths],
    ["profile", "Profile", options.profiles],
    ["rim", "Rim", options.rims],
  ] as const;

  return (
    <form method="get" action={CATALOG_PATH} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {options.categories.length > 0 && (
          <div>
            <label htmlFor="finder-category" className={labelClassName}>
              Vehicle type
            </label>
            <select id="finder-category" name="category" className={selectClassName}>
              <option value="">Any vehicle</option>
              {options.categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {sizes.map(([name, label, values]) => (
          <div key={name}>
            <label htmlFor={`finder-${name}`} className={labelClassName}>
              {label}
            </label>
            <select id={`finder-${name}`} name={name} className={selectClassName}>
              <option value="">Any</option>
              {values.map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <p className="text-small text-muted">
        Read your size off the tyre&apos;s sidewall, for example 185/65 R15: width 185, profile
        65, rim 15.
      </p>
      <div>
        <Button type="submit" variant="primary">
          Find my tyres
        </Button>
      </div>
    </form>
  );
}
