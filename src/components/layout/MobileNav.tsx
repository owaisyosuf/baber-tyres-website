"use client";

import { Suspense, useEffect, useRef } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { CurrentNavList } from "./CurrentNavList";
import { NavList } from "./NavList";
import { SiteSearch } from "./SiteSearch";

const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Mobile drawer on a native modal <dialog>. showModal() gives the behaviour
 * the spec requires without hand-rolled focus code: the page behind becomes
 * inert, Tab stays inside the drawer, Esc closes it, and focus returns to the
 * button that opened it.
 */
export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A modal left open across the `md` breakpoint would keep the whole page
  // inert while the drawer itself is hidden, so close it when the desktop
  // nav takes over.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const linkClassName = "w-full py-3 text-body-lg";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Open menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text transition-colors duration-150 ease-out-soft hover:text-accent md:hidden"
      >
        <MenuIcon />
      </button>

      {/* The dialog is the full-viewport backdrop hit-target; the panel inside
          is the drawer, so a click that lands on the dialog itself is a
          click outside the panel. */}
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-background/80"
      >
        <div className="ml-auto flex h-full w-[min(20rem,85vw)] flex-col border-l border-border bg-surface">
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text transition-colors duration-150 ease-out-soft hover:text-accent"
            >
              <CloseIcon />
            </button>
          </div>
          <SiteSearch onSubmit={close} className="px-4 pb-4" />
          <nav aria-label="Mobile" className="px-4 pb-6">
            <Suspense
              fallback={
                <NavList
                  pathname={null}
                  onNavigate={close}
                  listClassName="flex flex-col"
                  linkClassName={linkClassName}
                />
              }
            >
              <CurrentNavList
                onNavigate={close}
                listClassName="flex flex-col"
                linkClassName={linkClassName}
              />
            </Suspense>
          </nav>
        </div>
      </dialog>
    </>
  );
}
