import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
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
    </>
  );
}
