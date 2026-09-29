import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/service/ServiceIcon";
import { Card, Section } from "@/components/ui";
import { MediaOrIcon } from "@/components/ui/MediaOrIcon";
import { getServices } from "@/lib/sanity/queries";
import { rethrowDuringBuild } from "@/lib/build-phase";

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 400;

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
    rethrowDuringBuild(error);
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
        {services.map((service, index) => (
          <li key={service._id}>
            <Reveal index={index} className="h-full">
              <Card
                as="div"
                interactive
                className="group relative flex h-full flex-col overflow-hidden"
              >
                <MediaOrIcon
                  image={service.image}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-[16/10]"
                  icon={<ServiceIcon icon={service.icon} className="h-8 w-8" />}
                />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="flex items-center gap-2 text-body font-semibold text-text">
                    <ServiceIcon icon={service.icon} className="h-5 w-5 shrink-0 text-accent" />
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
                </div>
              </Card>
            </Reveal>
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
