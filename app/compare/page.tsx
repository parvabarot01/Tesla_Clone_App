import type { Metadata } from "next";

import { CompareSelector } from "@/components/compare/CompareSelector";
import { PageTransition } from "@/components/shared/PageTransition";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { vehicleService } from "@/services/vehicleService";

export const metadata: Metadata = {
  title: "Compare Vehicles",
  description:
    "Compare performance, range, and pricing across the current vehicle lineup.",
};

export default async function ComparePage() {
  const vehicles = await vehicleService.getVehicles();

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-neutral-100 via-white to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Compare"
              title="Compare Vehicles"
              description="Select two to four models and review pricing, performance, and positioning side by side in one product-focused view."
              align="left"
            />
          </Reveal>

          <CompareSelector vehicles={vehicles} />
        </div>
      </section>
    </PageTransition>
  );
}
