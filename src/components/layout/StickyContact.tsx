import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { formatPhoneDisplay } from "@/lib/format";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

/**
 * Mobile-only contact bar — FR-D1, Constitution §VI: WhatsApp and Call are
 * one tap away from every page. An <aside> so it is a landmark rather than
 * loose content outside every region. The Footer reserves `--sticky-contact-space`
 * (globals.css) beneath its content so this bar never sits over the footer's
 * own actions. The bar hides itself while any modal <dialog> — the mobile
 * menu, and later the filter sheet — is open, using a Tailwind variant
 * rather than a globals.css rule because the `flex` utility would outrank a
 * base-layer rule.
 */
export async function StickyContact() {
  const settings = await getShopSettings();
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);

  return (
    <aside
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden [body:has(dialog[open])_&]:hidden"
    >
      <Button
        href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
        variant="whatsapp"
        icon={<WhatsAppIcon />}
        aria-label="Chat with us on WhatsApp"
        className="flex-7"
      >
        WhatsApp
      </Button>
      <Button
        href={`tel:${settings.phoneE164}`}
        variant="secondary"
        icon={<PhoneIcon />}
        aria-label={`Call us on ${phoneDisplay}`}
        className="flex-3"
      >
        Call
      </Button>
    </aside>
  );
}
