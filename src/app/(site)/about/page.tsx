import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { ShopVisitDetails } from "@/components/shop/ShopVisitDetails";
import { Button, Container } from "@/components/ui";
import { RELATIONSHIP_GROUPS } from "@/lib/brand";
import { getBrands, getServices } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  return {
    // The layout's title template appends the shop name.
    title: `About us — tyre importer and dealer in ${settings.city}`,
    description: `${settings.shopName} is a tyre importer and dealer on ${settings.addressLine}, ${settings.city}. See the brands we import, the brands we deal in, and how to reach us.`,
    alternates: { canonical: "/about" },
  };
}

/** The brands, grouped the same way as /brands. Left out entirely if Sanity is unreachable. */
async function BrandGroups() {
  let brands;
  try {
    brands = await getBrands();
  } catch (error) {
    console.error("Brands unavailable on About:", error);
    return null;
  }

  return (
    <dl className="mt-6 flex flex-col gap-4">
      {RELATIONSHIP_GROUPS.map((group) => {
        const inGroup = brands.filter((brand) => brand.relationship === group.relationship);
        if (inGroup.length === 0) return null;
        return (
          <div key={group.relationship}>
            <dt className="text-label uppercase text-accent">{group.heading}</dt>
            <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-body-lg">
              {inGroup.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brands/${brand.slug}`}
                  className="text-text underline decoration-border-strong underline-offset-4 hover:text-accent"
                >
                  {brand.name}
                </Link>
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/** The services we offer, from Sanity. Left out entirely if Sanity is unreachable. */
async function ServiceList() {
  let services;
  try {
    services = await getServices();
  } catch (error) {
    console.error("Services unavailable on About:", error);
    return null;
  }
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="about-shop" className="mt-12">
      <h2 id="about-shop" className="text-h2">
        At the shop
      </h2>
      <p className="mt-4 max-w-[60ch] text-body text-muted">
        Once your tyres are chosen, we can fit them for you. The services we offer are:
      </p>
      <ul role="list" className="mt-4 flex flex-col gap-2 text-body-lg text-text">
        {services.map((service) => (
          <li key={service._id}>
            <Link
              href={`/services#${service.slug}`}
              className="underline decoration-border-strong underline-offset-4 hover:text-accent"
            >
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function AboutPage() {
  const settings = await getShopSettings();

  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-h1">About {settings.shopName}</h1>
      <p className="mt-3 max-w-[60ch] text-body-lg text-muted">
        {settings.shopName} is a tyre importer and dealer on {settings.addressLine},{" "}
        {settings.city}. We carry car, SUV, truck, forklift and off-road tyres across 20+ brands.
      </p>

      <section aria-labelledby="about-brands" className="mt-12">
        <h2 id="about-brands" className="text-h2">
          Importer and dealer
        </h2>
        <p className="mt-4 max-w-[60ch] text-body text-muted">
          Some brands we import ourselves. Others we deal in. We keep the two apart on this site
          so you know exactly who you are buying from. Every brand below has its own page, with
          its sizes and how we carry it.
        </p>
        <BrandGroups />
        <p className="mt-6 text-body">
          <Link href="/brands" className="text-accent underline underline-offset-4">
            See all brands
          </Link>
        </p>
      </section>

      <section aria-labelledby="about-how" className="mt-12">
        <h2 id="about-how" className="text-h2">
          How buying from us works
        </h2>
        <ul
          role="list"
          className="mt-4 flex max-w-[60ch] list-disc flex-col gap-2 pl-5 text-body text-muted marker:text-accent"
        >
          <li>
            There is no online checkout. Browse the tyres, then message us your size on WhatsApp
            and we confirm price and stock with you directly.
          </li>
          <li>{settings.deliveryNote}</li>
          <li>If you do not see your size listed, ask us on WhatsApp. We will tell you what is available.</li>
        </ul>
      </section>

      <ServiceList />

      <section
        aria-labelledby="about-visit"
        className="mt-12 rounded-lg border border-border bg-surface p-6 sm:p-10"
      >
        <h2 id="about-visit" className="font-display text-h3">
          Visit us
        </h2>
        <div className="mt-4">
          <ShopVisitDetails settings={settings} />
        </div>
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
      </section>
    </Container>
  );
}
