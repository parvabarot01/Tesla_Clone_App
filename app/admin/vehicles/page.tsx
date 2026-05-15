import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import { getAdminVehiclesViewData } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin Vehicles | Tesla Clone",
  description: "Review persisted vehicle catalog entries, pricing, and slugs.",
};

export default async function AdminVehiclesPage() {
  const vehicles = await getAdminVehiclesViewData();

  return (
    <>
      <Reveal className="max-w-3xl">
        <AdminSectionHeader
          eyebrow="Admin Vehicles"
          title="Vehicles"
          description="Review the persisted catalog entries that power the public vehicle, ordering, and comparison flows."
          badge={`${vehicles.length} total`}
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.length === 0 ? (
          <Reveal
            delay={0.06}
            as="article"
            className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-[0_20px_50px_rgba(17,17,17,0.08)] md:col-span-2 sm:p-8 xl:col-span-3"
          >
            <AdminEmptyState
              title="No vehicles available yet"
              description="Seeded or persisted catalog vehicles will appear here once the database has vehicle records."
              actionHref={ROUTES.vehicles}
              actionLabel="Open Vehicle Catalog"
            />
          </Reveal>
        ) : (
          vehicles.map((vehicle, index) => (
            <Reveal
              key={vehicle.id}
              delay={0.06 + index * 0.03}
              as="article"
              className="rounded-[1.85rem] border border-black/6 bg-white p-6 shadow-[0_18px_42px_rgba(17,17,17,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {vehicle.category}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                {vehicle.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                {vehicle.tagline}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-black/6 bg-neutral-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Starting Price
                  </p>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {vehicle.startingPriceFormatted}
                  </p>
                </div>

                <div className="rounded-[1.35rem] border border-black/6 bg-neutral-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Slug
                  </p>
                  <p className="mt-3 font-mono text-sm font-semibold text-neutral-950">
                    {vehicle.slug}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <ButtonLink
                  href={ROUTES.vehicleDetails(vehicle.slug)}
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                >
                  View Public Page
                  <ArrowUpRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </>
  );
}
