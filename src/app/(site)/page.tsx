import { BrandStrip } from "@/components/home/BrandStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { LocationBlock } from "@/components/home/LocationBlock";
import { ServicesSummary } from "@/components/home/ServicesSummary";
import { SizeFinder } from "@/components/home/SizeFinder";
import { TrustStrip } from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <SizeFinder />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStrip />
      <ServicesSummary />
      <LocationBlock />
    </>
  );
}
