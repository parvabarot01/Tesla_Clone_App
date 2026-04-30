import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaGroup } from "@/components/shared/CtaGroup";
import { PageTransition } from "@/components/shared/PageTransition";
import { Reveal } from "@/components/shared/Reveal";
import { SpecGrid } from "@/components/shared/SpecGrid";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { resolveBackgroundImage } from "@/lib/utils";
import { vehicleService } from "@/services/vehicleService";

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const vehicleSlugs = await vehicleService.getVehicleSlugs({
    source: "local",
  });

  return vehicleSlugs.map((vehicleSlug) => ({
    slug: vehicleSlug,
  }));
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await vehicleService.getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: `Vehicle | ${siteConfig.name}`,
      description: "Explore Tesla-inspired electric vehicles.",
    };
  }

  return {
    title: `${vehicle.name} | ${siteConfig.name}`,
    description: vehicle.tagline,
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await vehicleService.getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const categoryLabel = vehicle.category.toLowerCase();
  const specs = [
    { label: "Range", value: vehicle.range },
    { label: "Top Speed", value: vehicle.topSpeed },
    { label: "Acceleration", value: vehicle.acceleration },
    { label: "Starting Price", value: vehicle.startingPrice },
  ];

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-neutral-900"
          style={{
            backgroundImage: resolveBackgroundImage(
              vehicle.image,
              "linear-gradient(180deg, rgba(17, 17, 17, 0.18) 0%, rgba(17, 17, 17, 0.44) 38%, rgba(17, 17, 17, 0.82) 100%)"
            ),
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        <div className="relative z-10 flex min-h-[calc(92svh-3.5rem)] items-end px-4 pb-16 pt-16 sm:px-6 md:pb-20 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <StaggerGroup
              className="max-w-4xl space-y-5"
              delayChildren={0.05}
              staggerChildren={0.07}
            >
              <p className="inline-flex rounded-full border border-white/16 bg-black/24 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/74 backdrop-blur-sm">
                {vehicle.category}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {vehicle.name}
              </h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-white/84 sm:text-lg lg:text-xl">
                {vehicle.tagline}
              </p>

              <div className="pt-3">
                <CtaGroup
                  primaryLabel="Order Now"
                  primaryHref={ROUTES.order(vehicle.slug)}
                  secondaryLabel="Demo Drive"
                  secondaryHref={ROUTES.demoDrive(vehicle.slug)}
                  tertiaryLabel="Back to Vehicles"
                  tertiaryHref={ROUTES.vehicles}
                  align="left"
                />
              </div>
            </StaggerGroup>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="vehicle-specs-heading"
        className="bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Key Specs
            </p>
            <h2
              id="vehicle-specs-heading"
              className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl"
            >
              Performance at a glance
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <SpecGrid specs={specs} />
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="vehicle-overview-heading"
        className="bg-neutral-50 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white px-6 py-8 shadow-[0_18px_48px_rgba(17,17,17,0.06)] sm:px-8 sm:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Overview
              </p>
              <h2
                id="vehicle-overview-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl"
              >
                Built for Electric Performance
              </h2>
              <p className="mt-5 text-sm leading-8 text-neutral-600 sm:text-base">
                {vehicle.name} is presented here as a Tesla-inspired {categoryLabel}
                {" "}
                experience focused on clean performance, confident daily usability,
                and a premium all-electric feel. This frontend-only detail page gives
                the {vehicle.name} room to highlight its range, speed, and pricing
                in a simple format that can expand later without changing the core
                layout.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
