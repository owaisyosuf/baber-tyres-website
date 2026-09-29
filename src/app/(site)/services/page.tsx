import type { Metadata } from "next";
import { Suspense } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { ServiceIcon } from "@/components/service/ServiceIcon";
import { ServiceListSkeleton } from "@/components/skeleton/Skeletons";
import { ShopVisitDetails } from "@/components/shop/ShopVisitDetails";
import { Button, Container, PageHero } from "@/components/ui";
import { MediaOrIcon } from "@/components/ui/MediaOrIcon";
import { getServices } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { socialMetadata } from "@/lib/seo/metadata";
import {
  buildWhatsAppLink,
  deliveryInquiryMessage,
  genericInquiryMessage,
  serviceInquiryMessage,
} from "@/lib/whatsapp";
import { rethrowDuringBuild } from "@/lib/build-phase";

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  let names: string[] = [];
  try {
    names = (await getServices()).map((service) => service.name);
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Services unavailable for metadata:", error);
  }
  const offered = names.length > 0 ? `${names.join(", ")} at ` : "Tyre services at ";
  const title = `Tyre Services in ${settings.city}`;
  const description = `${offered}${settings.shopName}, ${settings.addressLine}, ${settings.city}. Message us on WhatsApp to book or ask a question.`;
  return {
    title,
    description,
    alternates: { canonical: "/services" },
    ...socialMetadata({ title, description, path: "/services", siteName: settings.shopName }),
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
    rethrowDuringBuild(error);
    console.error("Services unavailable:", error);
    return <ServicesUnavailable />;
  }
  const settings = await getShopSettings();

  return (
    <div className="flex flex-col gap-6">
      {services.map((service, index) => (
        <section
          key={service._id}
          id={service.slug}
          aria-labelledby={`service-${service.slug}`}
          className="grid scroll-mt-20 overflow-hidden rounded-lg border border-border bg-surface md:grid-cols-5"
        >
          <MediaOrIcon
            image={service.image}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            sizes="(min-width: 768px) 40vw, 100vw"
            priority={index === 0}
            className={[
              "aspect-[16/10] md:col-span-2 md:aspect-auto md:h-full md:min-h-72",
              index % 2 === 1 ? "md:order-last" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            icon={<ServiceIcon icon={service.icon} className="h-8 w-8" />}
          />
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-10 md:col-span-3">
            <span className="flex items-center gap-2 text-label uppercase text-accent">
              <ServiceIcon icon={service.icon} className="h-5 w-5" />
              Service
            </span>
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
        <ShopVisitDetails settings={settings} />
      </section>
    </div>
  );
}

export default async function ServicesPage() {
  const settings = await getShopSettings();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Fitting, alignment and balancing"
        intro="Once your tyres are chosen, we fit them at our shop with computerized alignment and balancing. Message us on WhatsApp to check timing or ask a question."
        breadcrumb={[{ label: "Services" }]}
      >
        <Button
          href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
          variant="whatsapp"
          icon={<WhatsAppIcon />}
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </Button>
        <Button href="/tyres" variant="secondary">
          Browse tyres
        </Button>
      </PageHero>
      <Container className="py-12 md:py-20">
        <Suspense fallback={<ServiceListSkeleton />}>
          <Services />
          <DeliveryAndLocation />
        </Suspense>
      </Container>
    </>
  );
}
