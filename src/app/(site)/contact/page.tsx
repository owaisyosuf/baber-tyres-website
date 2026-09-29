import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LocationIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { ShopMap } from "@/components/shop/ShopMap";
import { ShopVisitDetails } from "@/components/shop/ShopVisitDetails";
import { Button, Container, CtaBanner, PageHero } from "@/components/ui";
import { formatPhoneDisplay } from "@/lib/format";
import { mapsDirectionsUrl } from "@/lib/maps";
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

/** One way to reach the shop: an icon, a heading, a line or two, and its action. */
function ContactCard({
  id,
  icon,
  title,
  children,
  action,
  highlight = false,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  action: ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      aria-labelledby={id}
      className={[
        "flex h-full flex-col gap-4 rounded-lg border bg-surface p-6 sm:p-8",
        highlight ? "border-accent shadow-glow" : "border-border",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-accent [&>svg]:h-6 [&>svg]:w-6"
      >
        {icon}
      </span>
      <h2 id={id} className="text-h3">
        {title}
      </h2>
      <div className="flex-1 text-body text-muted">{children}</div>
      <div>{action}</div>
    </section>
  );
}

export default async function ContactPage() {
  const settings = await getShopSettings();
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);
  const whatsappHref = buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164);
  const directionsUrl = mapsDirectionsUrl(settings);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us about your tyres"
        intro="The quickest way to reach us is WhatsApp or a call. Tell us your tyre size and we will confirm price and stock."
        breadcrumb={[{ label: "Contact" }]}
      >
        <Button
          href={whatsappHref}
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
      </PageHero>

      <Container className="py-12 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <ContactCard
            id="contact-whatsapp"
            icon={<WhatsAppIcon />}
            title="WhatsApp"
            highlight
            action={
              <Button
                href={whatsappHref}
                variant="whatsapp"
                icon={<WhatsAppIcon />}
                aria-label="Chat with us on WhatsApp"
              >
                Start a chat
              </Button>
            }
          >
            Send your tyre size, or a photo of the tyre sidewall, and we will reply with what we have.
          </ContactCard>

          <ContactCard
            id="contact-call"
            icon={<PhoneIcon />}
            title="Call"
            action={
              <Button
                href={`tel:${settings.phoneE164}`}
                variant="secondary"
                icon={<PhoneIcon />}
                aria-label={`Call us on ${phoneDisplay}`}
              >
                Call now
              </Button>
            }
          >
            <p className="tabular font-display text-h3 text-text">{phoneDisplay}</p>
            <p className="mt-2">During opening hours.</p>
          </ContactCard>

          <ContactCard
            id="contact-visit"
            icon={<LocationIcon />}
            title="Visit the shop"
            action={
              <Button href={directionsUrl} variant="secondary" icon={<LocationIcon />}>
                Get directions
              </Button>
            }
          >
            <ShopVisitDetails settings={settings} showCall={false} />
          </ContactCard>
        </div>

        <div className="mt-12">
          <CtaBanner
            id="contact-delivery"
            title={`Delivery across ${settings.city}`}
            actions={
              <Button
                href={buildWhatsAppLink(deliveryInquiryMessage(), settings.whatsappE164)}
                variant="whatsapp"
                icon={<WhatsAppIcon />}
                aria-label="Ask about delivery charges on WhatsApp"
              >
                WhatsApp for delivery charges
              </Button>
            }
          >
            {settings.deliveryNote}
          </CtaBanner>
        </div>

        <section aria-labelledby="contact-map" className="mt-16">
          <h2 id="contact-map" className="text-h2">
            Find us
          </h2>
          <p className="mt-3 mb-6 text-body text-muted">
            {settings.addressLine}, {settings.city}
          </p>
          <ShopMap settings={settings} />
        </section>
      </Container>
    </>
  );
}
