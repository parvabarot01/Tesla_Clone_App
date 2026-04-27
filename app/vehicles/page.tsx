import type { Metadata } from "next";

import { PageTransition } from "@/components/shared/PageTransition";
import { PageHero } from "@/components/shared/PageHero";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { vehicleService } from "@/services/vehicleService";

export const metadata: Metadata = {
  title: "Vehicles",
  description:
    "Explore performance, range, and technology built for the future.",
};

export default async function VehiclesPage() {
  const vehicles = await vehicleService.getVehicles();

  return (
    <PageTransition>
      <PageHero
        title="Electric Vehicles"
        subtitle="Explore performance, range, and technology built for the future."
        backgroundImage="/images/vehicles-page.jpg"
        primaryButtonText="View Inventory"
        secondaryButtonText="Compare Models"
      />
      <VehicleGrid vehicles={vehicles} />
    </PageTransition>
  );
}
