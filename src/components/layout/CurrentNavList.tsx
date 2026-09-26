"use client";

import { usePathname } from "next/navigation";
import { NavList } from "./NavList";

type CurrentNavListProps = Omit<React.ComponentProps<typeof NavList>, "pathname">;

/** The only place the current route is read — everything else stays a Server Component. */
export function CurrentNavList(props: CurrentNavListProps) {
  return <NavList pathname={usePathname()} {...props} />;
}
