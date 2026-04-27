import { EmptyState } from "@/components/shared/EmptyState";
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
        <SectionHeader
          eyebrow="Vehicle Lineup"
          title="Explore Our Vehicles"
          description="Compare range, speed, acceleration, and pricing across the lineup."
          align="left"
        />

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="list-none">
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
