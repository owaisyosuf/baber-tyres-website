import type { Metadata } from "next";
import { BrandStrip } from "@/components/home/BrandStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { HowToBuySection } from "@/components/home/HowToBuySection";
import { LocationBlock } from "@/components/home/LocationBlock";
import { ServicesSummary } from "@/components/home/ServicesSummary";
import { SizeFinder } from "@/components/home/SizeFinder";
import { TrustStrip } from "@/components/home/TrustStrip";

// Title, description, and social tags come from the layout's defaults; the home
// page only needs to name itself as its canonical URL.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowToBuySection />
      <SizeFinder />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStrip />
      <ServicesSummary />
      <LocationBlock />
    </>
  );
}
