import Link from "next/link";
import { ClockIcon, LocationIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { formatPhoneDisplay } from "@/lib/format";
import { formatOpeningHours } from "@/lib/hours";
import { getBrands, getCategories } from "@/lib/sanity/queries";
import { getShopSettings } from "@/lib/sanity/settings";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";
import { rethrowDuringBuild } from "@/lib/build-phase";

/** The footer lists a handful of brands; the full set lives on /brands. */
const FOOTER_BRAND_LIMIT = 8;

const headingClassName = "mb-3 text-label uppercase text-muted";
const linkClassName =
  "inline-flex min-h-11 items-center text-body text-text transition-colors duration-150 ease-out-soft hover:text-accent";

// Content lists degrade to empty on a Sanity failure (NFR-11); the contact
// block never depends on them, so it always renders.
async function orEmpty<T>(request: Promise<T[]>): Promise<T[]> {
  try {
    return await request;
  } catch (error) {
    rethrowDuringBuild(error);
    console.error("Footer list unavailable:", error);
    return [];
  }
}

/**
 * Site footer — R6, FR-A6. Every contact detail and the opening hours come
 * from the shop settings (Sanity, falling back to lib/site.ts); nothing is
 * typed into this component.
 */
export async function Footer() {
  const [settings, categories, brands] = await Promise.all([
    getShopSettings(),
    orEmpty(getCategories()),
    orEmpty(getBrands()),
  ]);

  const hours = formatOpeningHours(settings.hours);
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);
  const whatsappHref = buildWhatsAppLink(
    genericInquiryMessage(),
    settings.whatsappE164,
  );
  const footerBrands = brands.slice(0, FOOTER_BRAND_LIMIT);

  return (
    <footer className="mt-16 border-t border-border bg-surface pb-(--sticky-contact-space) md:pb-0">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-text">
              {settings.shopName}
            </p>
            <p className="mt-2 text-small text-muted">{siteConfig.tagline}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
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
            </div>
          </div>

          <div>
            <h2 className={headingClassName}>Visit us</h2>
            <address className="flex gap-3 not-italic text-body text-text">
              <LocationIcon className="mt-1 shrink-0 text-accent" size={20} />
              <span>
                {settings.addressLine}, {settings.city}
              </span>
            </address>

            <div className="mt-4 flex gap-3">
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

            <p className="mt-4 text-small text-muted">{settings.deliveryNote}</p>
          </div>

          {categories.length > 0 && (
            <nav aria-label="Tyres by vehicle">
              <h2 className={headingClassName}>Tyres by vehicle</h2>
              <ul>
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link href={`/categories/${category.slug}`} className={linkClassName}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {footerBrands.length > 0 && (
            <nav aria-label="Brands">
              <h2 className={headingClassName}>Brands</h2>
              <ul>
                {footerBrands.map((brand) => (
                  <li key={brand._id}>
                    <Link href={`/brands/${brand.slug}`} className={linkClassName}>
                      {brand.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/brands" className={`${linkClassName} text-accent`}>
                    All brands
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>

        <p className="mt-10 border-t border-border pt-6 text-small text-muted">
          © {settings.shopName}
        </p>
      </Container>
    </footer>
  );
}
