import Link from "next/link";
import { isCurrentRoute, navItems } from "./nav";

interface NavListProps {
  /** Current pathname, or null while it is unknown (the Suspense fallback). */
  pathname: string | null;
  /** Fired when a link is followed — the mobile drawer uses it to close. */
  onNavigate?: () => void;
  listClassName?: string;
  linkClassName?: string;
}

/**
 * The nav links themselves, shared by the desktop bar and the mobile drawer.
 * `aria-current="page"` is what tells assistive technology which route is
 * active; the amber colour is only the visual echo of it.
 */
export function NavList({
  pathname,
  onNavigate,
  listClassName,
  linkClassName,
}: NavListProps) {
  return (
    <ul className={listClassName}>
      {navItems.map((item) => {
        const current = isCurrentRoute(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={[
                "inline-flex min-h-11 items-center rounded-md px-3 text-body font-medium transition-colors duration-150 ease-out-soft",
                current ? "text-accent" : "text-text hover:text-accent",
                linkClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
