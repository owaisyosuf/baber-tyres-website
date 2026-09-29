import Image, { type StaticImageData } from "next/image";
import type { ComponentType } from "react";
import { FilterIcon, FittingIcon, WhatsAppIcon, type IconProps } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui";
import findPhoto from "../../../public/images/how-to-buy/find.jpg";
import fittingPhoto from "../../../public/images/how-to-buy/fitting.jpg";
import messagePhoto from "../../../public/images/how-to-buy/message.jpg";

interface Step {
  Icon: ComponentType<IconProps>;
  photo: StaticImageData;
  photoAlt: string;
  title: string;
  text: string;
}

/**
 * The three steps of buying from the shop. There is no online checkout, so a
 * first-time visitor needs to see that the order happens on WhatsApp. The
 * photos are free-licence (Pexels) illustrations of each step, not of this
 * shop (Constitution §II.6).
 */
export function HowToBuy({ deliveryNote, headingLevel: Heading = "h2" }: {
  deliveryNote: string;
  headingLevel?: "h2" | "h3";
}) {
  const steps: Step[] = [
    {
      Icon: FilterIcon,
      photo: findPhoto,
      photoAlt: "Rows of car tyres stacked on racks in a tyre store",
      title: "Find your tyre",
      text: "Browse by vehicle, brand or size. If your size is not listed, just ask.",
    },
    {
      Icon: WhatsAppIcon,
      photo: messagePhoto,
      photoAlt: "A man sending a message on his phone",
      title: "Message us on WhatsApp",
      text: "Send us your size and we confirm price and stock with you directly. There is no online checkout.",
    },
    {
      Icon: FittingIcon,
      photo: fittingPhoto,
      photoAlt: "A mechanic fitting a wheel and tyre onto a car",
      title: "Fitting or delivery",
      text: `Get your tyres fitted at our shop. ${deliveryNote}`,
    },
  ];

  return (
    <ol role="list" className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal index={index} className="h-full">
            <Card interactive className="group flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                <Image
                  src={step.photo}
                  alt={step.photoAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 ease-out-soft group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                />
                <span
                  aria-hidden
                  className="absolute top-3 left-3 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background/90 text-accent"
                >
                  <step.Icon className="h-6 w-6" />
                </span>
                <span
                  aria-hidden
                  className="absolute right-3 bottom-2 tabular font-display text-h2 text-text drop-shadow"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <Heading className="text-body-lg font-semibold text-text">{step.title}</Heading>
                <p className="text-body text-muted">{step.text}</p>
              </div>
            </Card>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
