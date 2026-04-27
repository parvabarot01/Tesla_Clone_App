import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import type { Vehicle } from "@/types";

type VehicleCardProps = {
  vehicle: Vehicle;
};

type SpecItemProps = {
  label: string;
  value: string;
};

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="rounded-2xl bg-neutral-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </dt>
      <dd className="mt-2 text-base font-semibold text-neutral-950">{value}</dd>
    </div>
  );
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_18px_48px_rgba(17,17,17,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} vehicle placeholder image`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
        <div className="absolute left-5 top-5">
          <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
            {vehicle.category}
          </span>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-7">
        <header className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                {vehicle.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-neutral-500">
                Starting at {vehicle.startingPrice}
              </p>
            </div>

            <Link
              href={ROUTES.vehicleDetails(vehicle.slug)}
              className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
            >
              Specs
            </Link>
          </div>

          <p className="text-sm leading-7 text-neutral-600 sm:text-base">
            {vehicle.tagline}
          </p>
        </header>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SpecItem label="Range" value={vehicle.range} />
          <SpecItem label="Top Speed" value={vehicle.topSpeed} />
          <SpecItem label="0-60 mph" value={vehicle.acceleration} />
        </dl>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={ROUTES.vehicleDetails(vehicle.slug)}
            size="lg"
            className="h-11 flex-1 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            View Details
          </ButtonLink>
          <ButtonLink
            href={ROUTES.order(vehicle.slug)}
            size="lg"
            variant="outline"
            className="h-11 flex-1 rounded-full px-6 text-sm font-semibold"
          >
            Order Now
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
