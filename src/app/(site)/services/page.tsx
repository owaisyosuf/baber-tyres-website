import type { Metadata } from "next";
import { Suspense } from "react";
import { ClockIcon, LocationIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { ServiceIcon } from "@/components/service/ServiceIcon";
import { Button, Container } from "@/components/ui";
import { formatOpeningHours } from "@/lib/hours";
import { formatPhoneDisplay } from "@/lib/format";
import { getServices } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import {
  buildWhatsAppLink,
  deliveryInquiryMessage,
  genericInquiryMessage,
  serviceInquiryMessage,
} from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  let names: string[] = [];
  try {
    names = (await getServices()).map((service) => service.name);
  } catch (error) {
    console.error("Services unavailable for metadata:", error);
  }
  const offered = names.length > 0 ? `${names.join(", ")} at ` : "Tyre services at ";
  return {
    title: `Tyre Services in ${settings.city}`,
    description: `${offered}${settings.shopName}, ${settings.addressLine}, ${settings.city}. Message us on WhatsApp to book or ask a question.`,
    alternates: { canonical: "/services" },
  };
}

/** Shown when Sanity cannot be reached — the visitor can still reach the shop (NFR-11). */
async function ServicesUnavailable() {
  const settings = await getShopSettings();
  return (
    <div role="alert" className="rounded-lg border border-border bg-surface p-6 sm:p-10">
      <h2 className="font-display text-h3">We could not load the services just now</h2>
      <p className="mt-3 max-w-[52ch] text-body text-muted">
        Please message us on WhatsApp and we will tell you what we can do for your vehicle.
      </p>
      <div className="mt-6">
        <Button
          href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
          variant="whatsapp"
          icon={<WhatsAppIcon />}
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
}

async function Services() {
  let services;
  try {
    services = await getServices();
  } catch (error) {
    console.error("Services unavailable:", error);
    return <ServicesUnavailable />;
  }
  const settings = await getShopSettings();

  return (
    <div className="flex flex-col gap-6">
      {services.map((service) => (
        <section
          key={service._id}
          id={service.slug}
          aria-labelledby={`service-${service.slug}`}
          className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:gap-8 sm:p-10"
        >
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-accent"
          >
            <ServiceIcon icon={service.icon} className="h-8 w-8" />
          </span>
          <div className="flex flex-col gap-3">
            <h2 id={`service-${service.slug}`} className="text-h2">
              {service.name} in {settings.city}
            </h2>
            {service.description && (
              <p className="max-w-[60ch] whitespace-pre-line text-body text-muted">
                {service.description}
              </p>
            )}
            <div className="mt-2">
              <Button
                href={buildWhatsAppLink(serviceInquiryMessage(service.name), settings.whatsappE164)}
                variant="whatsapp"
                icon={<WhatsAppIcon />}
                aria-label={`Ask about ${service.name} on WhatsApp`}
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

async function DeliveryAndLocation() {
  const settings = await getShopSettings();
  const hours = formatOpeningHours(settings.hours);
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-2">
      <section
        aria-labelledby="delivery"
        className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 sm:p-10"
      >
        <h2 id="delivery" className="text-h3 font-display">
          Delivery
        </h2>
        <p className="max-w-[52ch] text-body text-muted">{settings.deliveryNote}</p>
        <div className="mt-2">
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

      <section
        aria-labelledby="visit"
        className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:p-10"
      >
        <h2 id="visit" className="text-h3 font-display">
          Visit us
        </h2>
        <address className="flex gap-3 not-italic text-body text-text">
          <LocationIcon className="mt-1 shrink-0 text-accent" size={20} />
          <span>
            {settings.addressLine}, {settings.city}
          </span>
        </address>
        <div className="flex gap-3">
          <ClockIcon className="mt-1 shrink-0 text-accent" size={20} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body">
            <dt className="text-text">{hours.days}</dt>
            <dd className="tabular text-muted">{hours.time}</dd>
            {hours.closedDay && (
              <>
                <dt className="text-text">{hours.closedDay}</dt>
                <dd className="text-muted">Closed</dd>
              </>
            )}
          </dl>
        </div>
        <div className="mt-2">
          <Button
            href={`tel:${settings.phoneE164}`}
            variant="secondary"
            icon={<PhoneIcon />}
            aria-label={`Call us on ${phoneDisplay}`}
          >
            Call {phoneDisplay}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-h1">Services</h1>
      <p className="mt-3 mb-8 max-w-[60ch] text-body-lg text-muted">
        Fitting, computerized alignment and computerized balancing at our shop. Message us on
        WhatsApp to check timing or ask a question.
      </p>
      <Suspense
        fallback={
          <p role="status" className="text-muted">
            Loading services…
          </p>
        }
      >
        <Services />
        <DeliveryAndLocation />
      </Suspense>
    </Container>
  );
}
