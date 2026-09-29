import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { ServicesSummary } from "@/components/home/ServicesSummary";
import { HowToBuy } from "@/components/shop/HowToBuy";
import { ShopVisitDetails } from "@/components/shop/ShopVisitDetails";
import { Button, Card, CtaBanner, PageHero, Section } from "@/components/ui";
import { RELATIONSHIP_GROUPS } from "@/lib/brand";
import { formatPhoneDisplay } from "@/lib/format";
import { getBrands } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";
import { getShopSettings } from "@/lib/sanity/settings";
import { socialMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";
import { rethrowDuringBuild } from "@/lib/build-phase";

const LOGO_WIDTH = 240;
const LOGO_HEIGHT = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  // The layout's title template appends the shop name.
  const title = `About us — tyre importer and dealer in ${settings.city}`;
  const description = `${settings.shopName} is a tyre importer and dealer on ${settings.addressLine}, ${settings.city}. See the brands we import, the brands we deal in, and how to reach us.`;
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    ...socialMetadata({ title, description, path: "/about", siteName: settings.shopName }),
  };
}

/** One card per relationship group, with each brand's logo linking to its page. Left out if Sanity is unreachable. */
async function BrandGroups() {
  let brands;
  try {
    brands = await getBrands();
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Brands unavailable on About:", error);
    return null;
  }

  const groups = RELATIONSHIP_GROUPS.map((group) => ({
    ...group,
    brands: brands.filter((brand) => brand.relationship === group.relationship),
  })).filter((group) => group.brands.length > 0);
  if (groups.length === 0) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {groups.map((group, index) => (
        <Reveal key={group.relationship} index={index} className="h-full">
          <section
            aria-labelledby={`about-${group.relationship}`}
            className="flex h-full flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:p-8"
          >
            <div>
              <h3 id={`about-${group.relationship}`} className="text-h3">
                {group.heading}
              </h3>
              <p className="mt-2 text-body text-muted">{group.intro}</p>
            </div>
            <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.brands.map((brand) => {
                const logoUrl = brand.logo
                  ? sanityImageUrl(brand.logo, LOGO_WIDTH, LOGO_HEIGHT, "max")
                  : null;
                return (
                  <li key={brand._id}>
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="group flex h-20 items-center justify-center rounded-md bg-text p-3 transition-shadow duration-300 ease-out-soft hover:shadow-glow"
                    >
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={`${brand.name} logo`}
                          width={LOGO_WIDTH}
                          height={LOGO_HEIGHT}
                          className="h-full w-full object-contain opacity-80 grayscale transition-[filter,opacity] duration-300 ease-out-soft group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
                        />
                      ) : (
                        <span className="font-display text-body-lg font-bold text-background">
                          {brand.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

export default async function AboutPage() {
  const settings = await getShopSettings();
  const whatsappHref = buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164);
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`Tyre importer and dealer in ${settings.city}`}
        intro={`${settings.shopName} is on ${settings.addressLine}, ${settings.city}. We carry car, SUV, truck, forklift and off-road tyres across ${siteConfig.brandCountLabel} brands, and fit them at our shop.`}
        breadcrumb={[{ label: "About" }]}
      >
        <Button href="/tyres" variant="primary">
          Browse tyres
        </Button>
        <Button
          href={whatsappHref}
          variant="secondary"
          icon={<WhatsAppIcon />}
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </Button>
      </PageHero>

      <Section>
        <h2 id="about-brands" className="text-h2">
          Importer and dealer
        </h2>
        <p className="mt-3 mb-8 max-w-[60ch] text-body text-muted">
          Some brands we import ourselves. Others we deal in. We keep the two apart on this site so
          you know exactly who you are buying from.
        </p>
        <BrandGroups />
        <p className="mt-8 text-body">
          <Link href="/brands" className="text-accent underline underline-offset-4">
            See all brands
          </Link>
        </p>
      </Section>

      <Section surface>
        <h2 id="about-how" className="text-h2">
          How buying from us works
        </h2>
        <p className="mt-3 mb-8 max-w-[60ch] text-body text-muted">
          Three steps, all on WhatsApp or at the shop.
        </p>
        <HowToBuy deliveryNote={settings.deliveryNote} headingLevel="h3" />
      </Section>

      <ServicesSummary />

      <Section surface>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="about-visit" className="text-h2">
              Visit the shop
            </h2>
            <p className="mt-3 max-w-[52ch] text-body text-muted">
              Bring your vehicle to the shop and we can fit your new tyres for you.
            </p>
          </div>
          <Card className="p-6 sm:p-8">
            <ShopVisitDetails settings={settings} showCall={false} />
          </Card>
        </div>

        <div className="mt-12">
          <CtaBanner
            id="about-cta"
            title="Tell us your tyre size"
            actions={
              <>
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
                  Call
                </Button>
              </>
            }
          >
            We reply with price and stock. If we do not have it, we will say so.
          </CtaBanner>
        </div>
      </Section>
    </>
  );
}
