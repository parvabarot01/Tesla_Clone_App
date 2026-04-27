import { EnergySection } from "@/components/home/EnergySection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { PromoCards } from "@/components/home/PromoCards";
import { energyCards, featureCards, heroContent, promoCards } from "@/data/home";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <HeroSection content={heroContent} />
      <PromoCards cards={promoCards} />
      <FeatureGrid cards={featureCards} />
      <EnergySection cards={energyCards} />
    </>
  );
}
