import type { Metadata } from "next";

import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Charging",
  description: "Charge at home or on the road with a growing charging network.",
};

export default function ChargingPage() {
  return (
    <PageHero
      title="Charging Made Simple"
      subtitle="Charge at home or on the road with a growing charging network."
      backgroundImage="/images/charging-page.jpg"
      primaryButtonText="Find Chargers"
      secondaryButtonText="Learn More"
    />
  );
}
