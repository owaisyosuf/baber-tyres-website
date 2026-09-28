import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { CATALOG_PATH } from "@/lib/filters";
import { formatPhoneDisplay } from "@/lib/format";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

/**
 * Shown by a detail page when Sanity cannot be reached (NFR-11, design.md §13).
 * Rendered on the server, so it is in the HTML even with JavaScript off, and it
 * always carries working WhatsApp and call actions from the shop settings.
 */
export async function Unavailable({ what }: { what: string }) {
  const settings = await getShopSettings();
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);

  return (
    <Container className="py-16 md:py-24">
      <div role="alert" className="rounded-lg border border-border bg-surface p-6 sm:p-10">
        <h1 className="text-h2">We could not load {what} just now</h1>
        <p className="mt-3 max-w-[52ch] text-body text-muted">
          Please try again in a moment, or message or call us and we will help you directly.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            aria-label="Chat with us on WhatsApp"
          >
            WhatsApp
          </Button>
          <Button
            href={`tel:${settings.phoneE164}`}
            variant="secondary"
            icon={<PhoneIcon />}
            aria-label={`Call us on ${phoneDisplay}`}
          >
            Call {phoneDisplay}
          </Button>
        </div>
        <p className="mt-6 text-body">
          <Link href={CATALOG_PATH} className="text-accent underline underline-offset-4">
            Browse tyres
          </Link>
        </p>
      </div>
    </Container>
  );
}
