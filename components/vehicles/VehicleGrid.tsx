import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { ROUTES } from "@/constants/routes";
import type { Vehicle } from "@/types";

type VehicleGridProps = {
  vehicles: Vehicle[];
};

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="No vehicles available"
        description="Vehicle information will appear here when it becomes available."
        actionLabel="Back Home"
        actionHref={ROUTES.home}
      />
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <SectionHeader
            eyebrow="Vehicle Lineup"
            title="Explore Our Vehicles"
            description="Compare range, speed, acceleration, and pricing across the lineup."
            align="left"
          />
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <li key={vehicle.id} className="list-none">
              <VehicleCard vehicle={vehicle} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
