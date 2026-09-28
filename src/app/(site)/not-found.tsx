import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { CATALOG_PATH } from "@/lib/filters";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

const linkClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border-strong px-5 text-body font-semibold text-text transition-colors duration-150 ease-out-soft hover:border-accent hover:text-accent";

/**
 * Branded 404 — design.md §13. A wrong link is not a dead end: it offers the
 * catalog, the services, and WhatsApp.
 */
export default async function NotFound() {
  const settings = await getShopSettings();

  return (
    <Container className="py-16 md:py-24">
      <p className="text-label uppercase text-accent">404</p>
      <h1 className="mt-3 text-h1">We could not find that page</h1>
      <p className="mt-4 max-w-[52ch] text-body-lg text-muted">
        The link may be old, or a tyre may have been removed. Browse what we have, or message us
        and we will help you find it.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
          variant="whatsapp"
          icon={<WhatsAppIcon />}
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </Button>
        <Link href={CATALOG_PATH} className={linkClassName}>
          Browse tyres
        </Link>
        <Link href="/services" className={linkClassName}>
          Our services
        </Link>
        <Link href="/" className={linkClassName}>
          Home
        </Link>
      </div>
    </Container>
  );
}
