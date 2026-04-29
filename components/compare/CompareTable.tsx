import Image from "next/image";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import type { Vehicle } from "@/types";

type CompareTableProps = {
  vehicles: Vehicle[];
};

type CompareRow = {
  label: string;
  render: (vehicle: Vehicle) => ReactNode;
};

const compareRows: CompareRow[] = [
  {
    label: "Vehicle name",
    render: (vehicle) => (
      <span className="text-lg font-semibold tracking-tight text-neutral-950">
        {vehicle.name}
      </span>
    ),
  },
  {
    label: "Category",
    render: (vehicle) => vehicle.category,
  },
  {
    label: "Tagline",
    render: (vehicle) => (
      <span className="leading-6 text-neutral-600">{vehicle.tagline}</span>
    ),
  },
  {
    label: "Range",
    render: (vehicle) => vehicle.range,
  },
  {
    label: "Top speed",
    render: (vehicle) => vehicle.topSpeed,
  },
  {
    label: "Acceleration",
    render: (vehicle) => vehicle.acceleration,
  },
  {
    label: "Starting price",
    render: (vehicle) => (
      <span className="font-semibold text-neutral-950">
        {vehicle.startingPrice}
      </span>
    ),
  },
];

export function CompareTable({ vehicles }: CompareTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
      <div className="border-b border-black/6 px-5 py-3 text-sm leading-6 text-neutral-600 lg:hidden">
        Swipe horizontally to compare more details.
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-separate border-spacing-0">
          <caption className="sr-only">
            Compare selected vehicles across key specs and pricing.
          </caption>
          <thead>
            <tr className="bg-neutral-50">
              <th
                scope="col"
                className="sticky left-0 z-20 w-48 border-b border-black/6 bg-neutral-50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500"
              >
                Spec
              </th>
              {vehicles.map((vehicle) => (
                <th
                  key={vehicle.id}
                  scope="col"
                  className="border-b border-black/6 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500"
                >
                  {vehicle.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-black/6 bg-white px-5 py-5 text-left text-sm font-semibold text-neutral-950"
              >
                Preview
              </th>
              {vehicles.map((vehicle) => (
                <td
                  key={`${vehicle.id}-preview`}
                  className="border-b border-black/6 px-5 py-5 align-top"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-neutral-100">
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.name} comparison preview`}
                      fill
                      sizes="(min-width: 1024px) 25vw, 60vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                  </div>
                </td>
              ))}
            </tr>

            {compareRows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-b border-black/6 bg-white px-5 py-4 text-left text-sm font-semibold text-neutral-950"
                >
                  {row.label}
                </th>
                {vehicles.map((vehicle) => (
                  <td
                    key={`${vehicle.id}-${row.label}`}
                    className="border-b border-black/6 px-5 py-4 align-top text-sm text-neutral-700"
                  >
                    {row.render(vehicle)}
                  </td>
                ))}
              </tr>
            ))}

            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-5 text-left text-sm font-semibold text-neutral-950"
              >
                Actions
              </th>
              {vehicles.map((vehicle) => (
                <td
                  key={`${vehicle.id}-actions`}
                  className="px-5 py-5 align-top"
                >
                  <div className="flex flex-col gap-3">
                    <ButtonLink
                      href={ROUTES.vehicleDetails(vehicle.slug)}
                      size="lg"
                      className="h-10 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-neutral-800 motion-safe:hover:-translate-y-px"
                    >
                      View Details
                    </ButtonLink>
                    <ButtonLink
                      href={ROUTES.order(vehicle.slug)}
                      size="lg"
                      variant="outline"
                      className="h-10 rounded-full px-5 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                    >
                      Order Now
                    </ButtonLink>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
