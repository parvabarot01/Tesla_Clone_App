import type { Metadata } from "next";

import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Energy",
  description: "Generate, store, and manage clean energy from your home.",
};

export default function EnergyPage() {
  return (
    <PageHero
      title="Energy for Everything"
      subtitle="Generate, store, and manage clean energy from your home."
      backgroundImage="/images/energy-page.jpg"
      primaryButtonText="Order Now"
      secondaryButtonText="Learn More"
    />
  );
}
