// TEMPORARY — design-token + primitive + icon proof for T002/T004/T005. Replaced by the real homepage in T016.

import { Badge, Button, Card, Heading } from "@/components/ui";
import {
  AlignmentIcon,
  BalancingIcon,
  CarIcon,
  CheckIcon,
  ChevronIcon,
  ClockIcon,
  CloseIcon,
  FilterIcon,
  FittingIcon,
  ForkliftIcon,
  LocationIcon,
  OffRoadIcon,
  PhoneIcon,
  RadialGlow,
  SuvIcon,
  TreadMotif,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { siteConfig } from "@/lib/site";
import { genericWhatsAppLink } from "@/lib/whatsapp";

const icons = [
  ["WhatsApp", WhatsAppIcon],
  ["Phone", PhoneIcon],
  ["Location", LocationIcon],
  ["Clock", ClockIcon],
  ["Car", CarIcon],
  ["SUV", SuvIcon],
  ["Truck", TruckIcon],
  ["Forklift", ForkliftIcon],
  ["Off-road", OffRoadIcon],
  ["Fitting", FittingIcon],
  ["Alignment", AlignmentIcon],
  ["Balancing", BalancingIcon],
  ["Filter", FilterIcon],
  ["Close", CloseIcon],
  ["Check", CheckIcon],
] as const;

const colors = [
  ["background", "#0A0A0B"],
  ["surface", "#16161A"],
  ["surface-raised", "#1E1E24"],
  ["border", "#26262D"],
  ["border-strong", "#34343D"],
  ["accent", "#FF9500"],
  ["accent-glow", "#FFB340"],
  ["text", "#FAFAFA"],
  ["muted", "#8A8A94"],
  ["in-stock", "#22C55E"],
  ["out-stock", "#71717A"],
];

export default function TokenProof() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-label uppercase text-accent">Design tokens</p>
      <h1 className="mt-3 text-display">Baber Tyres Corporation</h1>
      <p className="mt-4 max-w-[70ch] text-body-lg text-muted">
        Importer &amp; dealer of 20+ tyre brands — M.A. Jinnah Road, Karachi.
      </p>

      <section className="mt-16">
        <h2 className="text-h2">Type scale</h2>
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          <p className="text-display">Display 800</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-body-lg">Body large — lead paragraph text.</p>
          <p className="text-body">Body — default paragraph text at 16px.</p>
          <p className="text-small text-muted">Small — metadata and captions.</p>
          <p className="text-label uppercase text-muted">Label — eyebrow</p>
          <p className="tabular text-h3 text-accent">PKR 14,500 · 185/65 R15</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-h2">Palette</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map(([name, hex]) => (
            <li
              key={name}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div
                className="h-12 w-full rounded-sm border border-border-strong"
                style={{ backgroundColor: hex }}
              />
              <p className="mt-2 text-small">{name}</p>
              <p className="tabular text-small text-muted">{hex}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-h2">Surfaces &amp; glow</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="text-h3">Raised</p>
            <p className="mt-2 text-small text-muted">surface + border</p>
          </div>
          <div className="rounded-lg border border-border-strong bg-surface-raised p-6 shadow-glow">
            <p className="text-h3">Hover</p>
            <p className="mt-2 text-small text-muted">
              surface-raised + border-strong + glow
            </p>
          </div>
          <div className="rounded-lg border border-accent bg-surface p-6 shadow-glow-strong">
            <p className="text-h3 text-accent">Accent</p>
            <p className="mt-2 text-small text-muted">amber border + glow</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-h2">Contrast check</h2>
        <div className="mt-6 space-y-3">
          <p className="text-body">text on background — 16.5:1</p>
          <p className="rounded-md bg-surface p-3 text-body">
            text on surface — 14.2:1
          </p>
          <p className="text-h3 text-accent">accent on background — 8.9:1</p>
          <p className="inline-block rounded-md bg-accent px-4 py-2 text-body font-semibold text-background">
            background on accent — 8.9:1
          </p>
        </div>
      </section>

      {/* T004 primitives — exercised here so real usage compiles and renders, not just isolated files. */}
      <section className="mt-16 mb-24">
        <Heading level={2} eyebrow="T004">
          UI primitives
        </Heading>

        <p className="mt-6 text-label uppercase text-muted">Buttons</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="primary">Browse Tyres</Button>
          <Button
            variant="whatsapp"
            href={genericWhatsAppLink()}
            icon={<WhatsAppIcon />}
          >
            Inquire on WhatsApp
          </Button>
          <Button
            variant="secondary"
            href={`tel:${siteConfig.phoneE164}`}
            icon={<PhoneIcon />}
          >
            Call
          </Button>
          <Button variant="ghost" icon={<ChevronIcon direction="right" />} iconPosition="right">
            View all
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <p className="mt-8 text-label uppercase text-muted">Badges</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Badge variant="solid-accent">Importer</Badge>
          <Badge variant="outline-accent">Dealer</Badge>
          <Badge variant="outline-muted">Stocked</Badge>
          <Badge variant="subtle-success" dot>
            In Stock
          </Badge>
          <Badge variant="subtle-neutral" dot>
            Out of Stock
          </Badge>
        </div>

        <p className="mt-8 text-label uppercase text-muted">Cards</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Card elevation="raised" interactive className="p-6">
            <Heading level={3}>Raised, interactive</Heading>
            <p className="mt-2 text-small text-muted">Hover to see the lift.</p>
          </Card>
          <Card elevation="accent" className="p-6">
            <Heading level={3} className="text-accent">
              Accent
            </Heading>
            <p className="mt-2 text-small text-muted">Amber border + glow.</p>
          </Card>
          <Card elevation="flat" className="p-6">
            <Heading level={3}>Flat</Heading>
            <p className="mt-2 text-small text-muted">Background only.</p>
          </Card>
        </div>
      </section>

      {/* T005 icons, tread motif, and radial glow. */}
      <section className="mt-16 mb-24">
        <Heading level={2} eyebrow="T005">
          Icon set &amp; motifs
        </Heading>

        <p className="mt-6 text-label uppercase text-muted">Icons — 24×24, 1.5px stroke</p>
        <div className="mt-3 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-8">
          {icons.map(([name, IconComponent]) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4"
            >
              <IconComponent className="text-accent" />
              <p className="text-small text-muted">{name}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-label uppercase text-muted">Radial glow</p>
        <div className="relative mt-3 h-48 overflow-hidden rounded-lg border border-border bg-background">
          <RadialGlow />
          <div className="relative flex h-full items-center justify-center">
            <p className="text-h3">Hero backdrop candidate</p>
          </div>
        </div>

        <p className="mt-8 text-label uppercase text-muted">Tread motif</p>
        <div className="relative mt-3 h-48 overflow-hidden rounded-lg border border-border bg-surface text-border-strong">
          <TreadMotif className="absolute inset-0 opacity-40" />
          <div className="relative flex h-full items-center justify-center">
            <p className="text-h3 text-text">Section divider candidate</p>
          </div>
        </div>
      </section>
    </div>
  );
}
