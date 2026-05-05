import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { DemoDriveForm } from "@/components/demo-drive/DemoDriveForm";
import { PageTransition } from "@/components/shared/PageTransition";
import { Reveal } from "@/components/shared/Reveal";
import { SpecGrid } from "@/components/shared/SpecGrid";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { vehicleService } from "@/services/vehicleService";

type DemoDrivePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const vehicleSlugs = await vehicleService.getVehicleSlugs({
    source: "auto",
  });

  return vehicleSlugs.map((vehicleSlug) => ({
    slug: vehicleSlug,
  }));
}

export async function generateMetadata({
  params,
}: DemoDrivePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await vehicleService.getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: `Demo Drive Vehicle | ${siteConfig.name}`,
      description: "Schedule a demo drive for a Tesla-inspired electric vehicle.",
    };
  }

  return {
    title: `Demo Drive ${vehicle.name} | ${siteConfig.name}`,
    description: `Schedule a demo drive for the ${vehicle.name}.`,
  };
}

export default async function DemoDrivePage({ params }: DemoDrivePageProps) {
  const { slug } = await params;
  const vehicle = await vehicleService.getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const specs = [
    { label: "Range", value: vehicle.range },
    { label: "Top Speed", value: vehicle.topSpeed },
    { label: "0-60 mph", value: vehicle.acceleration },
  ];

  return (
    <PageTransition>
      <section className="bg-neutral-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8">
            <ButtonLink
              href={ROUTES.vehicles}
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
            >
              Back to Vehicles
            </ButtonLink>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal as="article" className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
              <div className="relative aspect-[5/4] overflow-hidden bg-neutral-100">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.name} preview placeholder image`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-black/6 to-transparent" />
              </div>

              <div className="space-y-4 px-6 py-7 sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-neutral-500">
                  {vehicle.category}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  {vehicle.name}
                </h1>
                <p className="text-sm leading-7 text-neutral-600 sm:text-base">
                  {vehicle.tagline}
                </p>

                <div className="pt-2">
                  <SpecGrid specs={specs} columns={3} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <DemoDriveForm vehicle={vehicle} />
            </Reveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
