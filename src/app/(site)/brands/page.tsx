import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandCard } from "@/components/brand";
import { WhatsAppIcon } from "@/components/icons";
import { BrandGridSkeleton } from "@/components/skeleton/Skeletons";
import { Reveal } from "@/components/motion/Reveal";
import { Button, Container, CtaBanner, PageHero } from "@/components/ui";
import { RELATIONSHIP_GROUPS } from "@/lib/brand";
import { getBrands } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { socialMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";
import { rethrowDuringBuild } from "@/lib/build-phase";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  const title = `Tyre Brands in ${settings.city}`;
  const description = `The tyre brands ${settings.shopName} imports, deals in and stocks in ${settings.city}. See which are direct imports, then browse each brand's sizes or message us on WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: "/brands" },
    ...socialMetadata({ title, description, path: "/brands", siteName: settings.shopName }),
  };
}

/** Shown when Sanity cannot be reached — the visitor can still reach the shop (NFR-11). */
async function BrandsUnavailable() {
  const settings = await getShopSettings();
  return (
    <div role="alert" className="rounded-lg border border-border bg-surface p-6 sm:p-10">
      <h2 className="font-display text-h3">We could not load the brand list just now</h2>
      <p className="mt-3 max-w-[52ch] text-body text-muted">
        Please message us on WhatsApp and we will tell you which brands and sizes we have.
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

async function Brands() {
  let brands;
  try {
    brands = await getBrands();
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Brands unavailable:", error);
    return <BrandsUnavailable />;
  }

  return (
    <div className="flex flex-col gap-16">
      {RELATIONSHIP_GROUPS.map((group) => {
        const inGroup = brands.filter((brand) => brand.relationship === group.relationship);
        if (inGroup.length === 0) return null;
        return (
          <section key={group.relationship} aria-labelledby={`brands-${group.relationship}`}>
            <div className="mb-8 flex flex-col gap-3 border-l-2 border-accent pl-4 sm:pl-6">
              <h2 id={`brands-${group.relationship}`} className="text-h2">
                {group.heading}
              </h2>
              <p className="max-w-[60ch] text-body text-muted">{group.intro}</p>
            </div>
            <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inGroup.map((brand, index) => (
                <li key={brand._id}>
                  <Reveal index={index} className="h-full">
                    <BrandCard brand={brand} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default async function BrandsPage() {
  const settings = await getShopSettings();

  return (
    <>
      <PageHero
        eyebrow={`${siteConfig.brandCountLabel} tyre brands`}
        title="Brands we import and deal in"
        intro="Some of these we bring into Pakistan ourselves, others we sell as a dealer. Every brand has its own page with its sizes and how we carry it."
        breadcrumb={[{ label: "Brands" }]}
      >
        <Button href="/tyres" variant="primary">
          Browse all tyres
        </Button>
        <Button
          href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
          variant="secondary"
          icon={<WhatsAppIcon />}
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </Button>
      </PageHero>

      <Container className="py-12 md:py-20">
        <Suspense fallback={<BrandGridSkeleton />}>
          <Brands />
        </Suspense>

        <div className="mt-16 md:mt-24">
          <CtaBanner
            id="brands-cta"
            title="Looking for another brand?"
            actions={
              <Button
                href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
                variant="whatsapp"
                icon={<WhatsAppIcon />}
                aria-label="Ask about a brand on WhatsApp"
              >
                Ask on WhatsApp
              </Button>
            }
          >
            We carry {siteConfig.brandCountLabel} brands and not all of them are listed here. Send
            us the brand and size and we will tell you what we have.
          </CtaBanner>
        </div>
      </Container>
    </>
  );
}
