import Link from "next/link";
import { Suspense } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { siteConfig } from "@/lib/site";
import { genericWhatsAppLink } from "@/lib/whatsapp";
import { CurrentNavList } from "./CurrentNavList";
import { MobileNav } from "./MobileNav";
import { NavList } from "./NavList";

const desktopListClassName = "flex items-center gap-1";

/**
 * Sticky site header — FR-D1. Below `md` it is the wordmark and a menu
 * button (contact actions live in the sticky bottom bar, T014); from `md` up
 * it shows the full nav and a WhatsApp action.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${siteConfig.shopName} — home`}
          className="font-display text-lg font-bold tracking-tight text-text"
        >
          {siteConfig.shopName}
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden md:block">
            {/* usePathname can suspend under Cache Components; the fallback is
                the same links without the current-page marker. */}
            <Suspense
              fallback={
                <NavList pathname={null} listClassName={desktopListClassName} />
              }
            >
              <CurrentNavList listClassName={desktopListClassName} />
            </Suspense>
          </nav>

          <div className="hidden md:block">
            <Button
              href={genericWhatsAppLink()}
              variant="whatsapp"
              icon={<WhatsAppIcon />}
              aria-label="Chat with us on WhatsApp"
            >
              WhatsApp
            </Button>
          </div>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
