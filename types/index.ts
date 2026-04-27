export type NavItem = {
  label: string;
  href: string;
};

export type CtaButton = {
  label: string;
  href?: string;
};

export type HeroContent = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
};

export type PromoCard = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  href?: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  href?: string;
};

export type EnergyCard = {
  title: string;
  subtitle: string;
  image: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  range: string;
  topSpeed: string;
  acceleration: string;
  startingPrice: string;
};

export type PageHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
};

export type PageStat = {
  value: string;
  label: string;
  detail?: string;
};

export type PageFeature = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  action: CtaButton;
  theme?: "light" | "dark";
  imageSide?: "left" | "right";
};

export type PageCollectionCard = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  action: CtaButton;
};

export type ShowcasePage = {
  title: string;
  description: string;
  hero: PageHero;
  stats: PageStat[];
  features: PageFeature[];
  collection: PageCollectionCard[];
  cta: {
    title: string;
    description: string;
    primaryCta: CtaButton;
    secondaryCta: CtaButton;
  };
};
