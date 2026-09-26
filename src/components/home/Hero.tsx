import { ChevronIcon, LocationIcon, RadialGlow, TreadMotif, WhatsAppIcon } from "@/components/icons";
import { Button, Container, Section } from "@/components/ui";
import { HeroSpotlight } from "./HeroSpotlight";
import { TyreGraphic } from "./TyreGraphic";
import { getShopSettings } from "@/lib/sanity/settings";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

/**
 * Homepage hero — FR-A1. Carried by type, not photography (NFR-12): an
 * oversized display heading over an amber radial glow and a faded tread
 * pattern. The H1 is the LCP element — plain text with nothing lazy or
 * animated above it — so there is no image to prioritise.
 */
export async function Hero() {
  const settings = await getShopSettings();

  return (
    <Section bleed className="relative overflow-hidden">
      <RadialGlow />
      <div
        aria-hidden
        className="absolute inset-0 text-border-strong opacity-40"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
        }}
      >
        <TreadMotif className="h-full w-full" />
      </div>
      <TyreGraphic className="pointer-events-none absolute -right-24 top-1/2 hidden aspect-square w-[min(46vw,560px)] -translate-y-1/2 opacity-80 md:block" />
      <HeroSpotlight />

      <Container className="relative">
        <p className="text-label uppercase text-accent">{siteConfig.tagline}</p>

        <h1 className="mt-4 w-fit bg-linear-to-r from-[color-mix(in_srgb,var(--color-text),var(--color-accent-glow)_22%)] via-accent-glow via-55% to-accent bg-clip-text text-display text-transparent">
          {settings.shopName}
        </h1>

        <p className="mt-6 max-w-[42ch] text-body-lg text-muted">
          Car, SUV, truck, forklift and off-road tyres from the brands we import
          and deal in — with fitting, computerized alignment and balancing.
        </p>

        <p className="mt-6 flex items-center gap-2 text-body text-text">
          <LocationIcon className="shrink-0 text-accent" size={20} />
          <span>
            {settings.addressLine}, {settings.city}
          </span>
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            href="/tyres"
            variant="primary"
            icon={<ChevronIcon direction="right" />}
            iconPosition="right"
          >
            Browse Tyres
          </Button>
          <Button
            href={buildWhatsAppLink(genericInquiryMessage(), settings.whatsappE164)}
            variant="secondary"
            icon={<WhatsAppIcon />}
            aria-label="Chat with us on WhatsApp"
          >
            WhatsApp
          </Button>
        </div>
      </Container>
    </Section>
  );
}
