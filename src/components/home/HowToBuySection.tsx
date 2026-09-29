import { HowToBuy } from "@/components/shop/HowToBuy";
import { Section } from "@/components/ui";
import { getShopSettings } from "@/lib/sanity/settings";

/** Homepage band explaining that ordering happens on WhatsApp, not through a checkout. */
export async function HowToBuySection() {
  const settings = await getShopSettings();

  return (
    <Section>
      <h2 id="home-how" className="text-h2">
        How buying works
      </h2>
      <p className="mt-3 mb-8 max-w-[52ch] text-body text-muted">
        No online checkout. Pick your tyres, message us, and we take it from there.
      </p>
      <HowToBuy deliveryNote={settings.deliveryNote} headingLevel="h3" />
    </Section>
  );
}
