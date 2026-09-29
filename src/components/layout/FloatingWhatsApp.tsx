import { WhatsAppIcon } from "@/components/icons";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

/**
 * Desktop counterpart to StickyContact: a round WhatsApp button pinned to the
 * bottom-right corner from `md` up, so the main enquiry channel stays in
 * reach while scrolling long pages. Hidden while a modal <dialog> is open.
 */
export async function FloatingWhatsApp() {
  const settings = await getShopSettings();

  return (
    <a
      href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
      aria-label="Chat with us on WhatsApp"
      className="fixed right-6 bottom-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-glow-strong transition-transform duration-200 ease-out-soft hover:scale-105 motion-reduce:hover:scale-100 md:flex [body:has(dialog[open])_&]:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
