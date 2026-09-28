import type { Metadata } from "next";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { ShopMap } from "@/components/shop/ShopMap";
import { ShopVisitDetails } from "@/components/shop/ShopVisitDetails";
import { Button, Container } from "@/components/ui";
import { formatPhoneDisplay } from "@/lib/format";
import { getShopSettings } from "@/lib/sanity/settings";
import { socialMetadata } from "@/lib/seo/metadata";
import {
  buildWhatsAppLink,
  deliveryInquiryMessage,
  genericInquiryMessage,
} from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  // The layout's title template appends the shop name.
  const title = `Contact and location in ${settings.city}`;
  const description = `Find ${settings.shopName} on ${settings.addressLine}, ${settings.city}. Opening hours, phone and WhatsApp. Message us your tyre size and we will reply.`;
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    ...socialMetadata({ title, description, path: "/contact", siteName: settings.shopName }),
  };
}

const cardClassName = "flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:p-10";

export default async function ContactPage() {
  const settings = await getShopSettings();
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);

  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-h1">Contact</h1>
      <p className="mt-3 mb-8 max-w-[60ch] text-body-lg text-muted">
        The quickest way to reach us is WhatsApp or a call. Tell us your tyre size and we will
        confirm price and stock.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="contact-talk" className={cardClassName}>
          <h2 id="contact-talk" className="font-display text-h3">
            Message or call
          </h2>
          <p className="tabular text-body-lg text-text">{phoneDisplay}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
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
              Call
            </Button>
          </div>
        </section>

        <section aria-labelledby="contact-visit" className={cardClassName}>
          <h2 id="contact-visit" className="font-display text-h3">
            Visit us
          </h2>
          <ShopVisitDetails settings={settings} showCall={false} />
        </section>

        <section aria-labelledby="contact-delivery" className={`${cardClassName} lg:col-span-2`}>
          <h2 id="contact-delivery" className="font-display text-h3">
            Delivery
          </h2>
          <p className="max-w-[60ch] text-body text-muted">{settings.deliveryNote}</p>
          <div>
            <Button
              href={buildWhatsAppLink(deliveryInquiryMessage(), settings.whatsappE164)}
              variant="whatsapp"
              icon={<WhatsAppIcon />}
              aria-label="Ask about delivery charges on WhatsApp"
            >
              WhatsApp for delivery charges
            </Button>
          </div>
        </section>
      </div>

      <section aria-labelledby="contact-map" className="mt-12">
        <h2 id="contact-map" className="text-h2">
          Find us
        </h2>
        <div className="mt-6">
          <ShopMap settings={settings} />
        </div>
      </section>
    </Container>
  );
}
