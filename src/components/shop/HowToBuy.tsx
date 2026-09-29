import type { ComponentType } from "react";
import { FilterIcon, FittingIcon, WhatsAppIcon, type IconProps } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui";

interface Step {
  Icon: ComponentType<IconProps>;
  title: string;
  text: string;
}

/**
 * The three steps of buying from the shop. There is no online checkout, so a
 * first-time visitor needs to see that the order happens on WhatsApp.
 */
export function HowToBuy({ deliveryNote, headingLevel: Heading = "h2" }: {
  deliveryNote: string;
  headingLevel?: "h2" | "h3";
}) {
  const steps: Step[] = [
    {
      Icon: FilterIcon,
      title: "Find your tyre",
      text: "Browse by vehicle, brand or size. If your size is not listed, just ask.",
    },
    {
      Icon: WhatsAppIcon,
      title: "Message us on WhatsApp",
      text: "Send us your size and we confirm price and stock with you directly. There is no online checkout.",
    },
    {
      Icon: FittingIcon,
      title: "Fitting or delivery",
      text: `Get your tyres fitted at our shop. ${deliveryNote}`,
    },
  ];

  return (
    <ol role="list" className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal index={index} className="h-full">
            <Card className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-accent"
                >
                  <step.Icon className="h-6 w-6" />
                </span>
                <span aria-hidden className="tabular font-display text-h2 text-border-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <Heading className="text-body-lg font-semibold text-text">{step.title}</Heading>
              <p className="text-body text-muted">{step.text}</p>
            </Card>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
