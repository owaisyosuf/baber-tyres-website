import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { ShopMap } from "@/components/shop/ShopMap";
import { ShopVisitDetails } from "@/components/shop/ShopVisitDetails";
import { Button, Section } from "@/components/ui";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, deliveryInquiryMessage } from "@/lib/whatsapp";

/**
 * Location, hours, and delivery — FR-A6. Everything is read from the shop
 * settings (R6). Delivery is stated with "charges apply" from the settings'
 * delivery note, never as free, and no rate is quoted.
 */
export async function LocationBlock() {
  const settings = await getShopSettings();

  return (
    <Section surface>
      <h2 id="home-location" className="text-h2">
        Visit us
      </h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6 rounded-lg border border-border bg-background p-6 sm:p-10">
          <ShopVisitDetails settings={settings} />
          <div className="border-t border-border pt-6">
            <h3 className="font-display text-h3">Delivery</h3>
            <p className="mt-3 max-w-[52ch] text-body text-muted">{settings.deliveryNote}</p>
            <div className="mt-4">
              <Button
                href={buildWhatsAppLink(deliveryInquiryMessage(), settings.whatsappE164)}
                variant="whatsapp"
                icon={<WhatsAppIcon />}
                aria-label="Ask about delivery charges on WhatsApp"
              >
                WhatsApp for delivery charges
              </Button>
            </div>
          </div>
        </Reveal>
        <Reveal index={1} className="flex flex-col justify-between gap-6">
          <ShopMap settings={settings} />
          <p className="text-body">
            <Link href="/contact" className="text-accent underline underline-offset-4">
              Contact details
            </Link>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
