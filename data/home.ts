import type {
  EnergyCard,
  FeatureCard,
  HeroContent,
  PromoCard,
} from "@/types";

export const heroContent: HeroContent = {
  title: "Full Self-Driving (Supervised)",
  subtitle: "Available for $99/mo",
  backgroundImage: "/images/hero.jpg",
  primaryCta: {
    label: "Demo FSD (Supervised)",
  },
  secondaryCta: {
    label: "Learn More",
  },
};

export const promoCards: PromoCard[] = [
  {
    title: "Current Offers",
    description: "Explore limited-time offers on Tesla-inspired vehicles.",
    image: "/images/current-offers.jpg",
    buttonText: "Learn More",
  },
  {
    title: "American Heroes",
    description:
      "$500 off for military, first responders, healthcare, teachers and students.",
    image: "/images/american-heroes.jpg",
    buttonText: "Learn More",
  },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Travel Safer. Arrive Refreshed.",
    description:
      "Advanced driver-assistance features designed for a more confident drive.",
    image: "/images/travel-safer.jpg",
    buttonText: "Learn More",
  },
  {
    title: "Features That Come Standard",
    description:
      "Smart technology, useful storage, and comfort-focused features.",
    image: "/images/standard-features.jpg",
    buttonText: "Learn More",
  },
];

export const energyCards: EnergyCard[] = [
  {
    title: "Solar Panels",
    subtitle: "Power Your Home and Reduce Your Electricity Bill",
    image: "/images/solar-panels.jpg",
    primaryButtonText: "Order Now",
    secondaryButtonText: "Learn More",
  },
  {
    title: "Powerwall",
    subtitle: "Keep Your Lights On During Outages",
    image: "/images/powerwall.jpg",
    primaryButtonText: "Order Now",
    secondaryButtonText: "Learn More",
  },
];
