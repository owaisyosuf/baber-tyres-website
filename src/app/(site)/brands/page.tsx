import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandCard } from "@/components/brand";
import { WhatsAppIcon } from "@/components/icons";
import { BrandGridSkeleton } from "@/components/skeleton/Skeletons";
import { Button, Container } from "@/components/ui";
import { RELATIONSHIP_GROUPS } from "@/lib/brand";
import { getBrands } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";
import { rethrowDuringBuild } from "@/lib/build-phase";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  return {
    title: `Tyre Brands in ${settings.city}`,
    description: `The tyre brands ${settings.shopName} imports, deals in and stocks in ${settings.city}. See which are direct imports, then browse each brand's sizes or message us on WhatsApp.`,
    alternates: { canonical: "/brands" },
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
    <div className="flex flex-col gap-12">
      {RELATIONSHIP_GROUPS.map((group) => {
        const inGroup = brands.filter((brand) => brand.relationship === group.relationship);
        if (inGroup.length === 0) return null;
        return (
          <section key={group.relationship} aria-labelledby={`brands-${group.relationship}`}>
            <h2 id={`brands-${group.relationship}`} className="text-h2">
              {group.heading}
            </h2>
            <p className="mt-2 mb-6 max-w-[60ch] text-body text-muted">{group.intro}</p>
            <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inGroup.map((brand) => (
                <li key={brand._id}>
                  <BrandCard brand={brand} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-h1">Brands</h1>
      <p className="mt-3 mb-8 max-w-[60ch] text-body-lg text-muted">
        Some of these we import ourselves, some we deal in, and some we simply stock. Each page
        says which.
      </p>
      <Suspense fallback={<BrandGridSkeleton />}>
        <Brands />
      </Suspense>
    </Container>
  );
}
