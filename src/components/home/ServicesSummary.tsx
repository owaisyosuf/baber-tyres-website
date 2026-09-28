import Link from "next/link";
import { ServiceIcon } from "@/components/service/ServiceIcon";
import { Card, Section } from "@/components/ui";
import { getServices } from "@/lib/sanity/queries";

/**
 * Services summary — FR-A5. The services as Sanity lists them, each linking to
 * its section on /services. Hidden when there are none or Sanity cannot be
 * reached.
 */
export async function ServicesSummary() {
  let services;
  try {
    services = await getServices();
  } catch (error) {
    console.error("Services unavailable on the homepage:", error);
    return null;
  }
  if (services.length === 0) return null;

  return (
    <Section>
      <h2 id="home-services" className="text-h2">
        Services at the shop
      </h2>
      <p className="mt-3 mb-8 max-w-[52ch] text-body text-muted">
        Once your tyres are chosen, we can fit them for you.
      </p>
      <ul role="list" className="grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <li key={service._id}>
            <Card
              as="div"
              interactive
              className="relative flex h-full flex-col gap-3 p-6"
            >
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-background text-accent"
              >
                <ServiceIcon icon={service.icon} className="h-8 w-8" />
              </span>
              <h3 className="text-body font-semibold text-text">
                <Link
                  href={`/services#${service.slug}`}
                  className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
                >
                  {service.name}
                </Link>
              </h3>
              {service.description && (
                <p className="line-clamp-3 text-small text-muted">{service.description}</p>
              )}
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-body">
        <Link href="/services" className="text-accent underline underline-offset-4">
          All services and delivery
        </Link>
      </p>
    </Section>
  );
}
