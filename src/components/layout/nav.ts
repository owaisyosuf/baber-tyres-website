/** FR-D1 primary navigation. `href`s are the routes built in Phases 3–4. */
export const navItems = [
  { label: "Tyres", href: "/tyres" },
  { label: "Brands", href: "/brands" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * A nav item is current on its own route and anywhere beneath it, so
 * `/tyres/some-product` still marks "Tyres". Matching on the path segment
 * (not a bare prefix) keeps `/tyres-extra` from matching `/tyres`.
 */
export function isCurrentRoute(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
