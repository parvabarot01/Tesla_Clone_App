"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { CompareTable } from "@/components/compare/CompareTable";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types";

const MIN_COMPARE_COUNT = 2;
const MAX_COMPARE_COUNT = 4;

type CompareSelectorProps = {
  vehicles: Vehicle[];
};

export function CompareSelector({ vehicles }: CompareSelectorProps) {
  const [selectedSlugs, setSelectedSlugs] = useState(() =>
    vehicles
      .slice(0, Math.min(MIN_COMPARE_COUNT, vehicles.length))
      .map((vehicle) => vehicle.slug)
  );

  const selectedVehicles = useMemo(
    () =>
      selectedSlugs
        .map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)),
    [selectedSlugs, vehicles]
  );

  function handleToggleVehicle(slug: string) {
    setSelectedSlugs((currentSelectedSlugs) => {
      if (currentSelectedSlugs.includes(slug)) {
        return currentSelectedSlugs.filter((currentSlug) => currentSlug !== slug);
      }

      if (currentSelectedSlugs.length >= MAX_COMPARE_COUNT) {
        return currentSelectedSlugs;
      }

      return [...currentSelectedSlugs, slug];
    });
  }

  const helperText =
    selectedSlugs.length < MIN_COMPARE_COUNT
      ? "Select at least two vehicles to unlock the full side-by-side comparison."
      : selectedSlugs.length >= MAX_COMPARE_COUNT
        ? "Maximum selection reached. Deselect a vehicle to choose a different model."
        : `Comparing ${selectedSlugs.length} vehicles. You can add up to ${MAX_COMPARE_COUNT}.`;

  return (
    <div className="mt-10 space-y-8">
      <Reveal
        as="section"
        className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-[0_20px_50px_rgba(17,17,17,0.08)] sm:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Select Models
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Compare between two and four vehicles
            </h2>
            <p className="text-sm leading-7 text-neutral-600 sm:text-base">
              Choose the models you want to evaluate side by side. The table
              below updates instantly to compare pricing, performance, and
              positioning across the lineup.
            </p>
          </div>

          <span className="inline-flex w-fit rounded-full border border-black/8 bg-neutral-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600">
            {selectedSlugs.length} selected
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => {
            const isSelected = selectedSlugs.includes(vehicle.slug);
            const isDisabled =
              !isSelected && selectedSlugs.length >= MAX_COMPARE_COUNT;

            return (
              <button
                key={vehicle.id}
                type="button"
                aria-pressed={isSelected}
                disabled={isDisabled}
                onClick={() => handleToggleVehicle(vehicle.slug)}
                className={cn(
                  "group overflow-hidden rounded-[1.6rem] border text-left transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/6",
                  isSelected
                    ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_40px_rgba(17,17,17,0.18)]"
                    : "border-black/8 bg-white text-neutral-950 hover:border-black/16 hover:bg-neutral-50 hover:shadow-[0_14px_32px_rgba(17,17,17,0.06)] motion-safe:hover:-translate-y-px",
                  isDisabled &&
                    "cursor-not-allowed opacity-60 motion-safe:hover:translate-y-0 hover:shadow-none"
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} selection preview`}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 768px) 44vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-black/5 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm",
                        isSelected
                          ? "border border-white/18 bg-white/10 text-white"
                          : "border border-black/8 bg-white/85 text-neutral-700"
                      )}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {vehicle.name}
                        </h3>
                        <p
                          className={cn(
                            "mt-1 text-sm font-medium",
                            isSelected ? "text-white/72" : "text-neutral-500"
                          )}
                        >
                          {vehicle.category}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {vehicle.startingPrice}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "text-sm leading-6",
                        isSelected ? "text-white/76" : "text-neutral-600"
                      )}
                    >
                      {vehicle.tagline}
                    </p>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.18em]">
                    <div
                      className={cn(
                        "rounded-[1rem] px-3 py-3",
                        isSelected
                          ? "bg-white/8 text-white/78"
                          : "bg-neutral-50 text-neutral-500"
                      )}
                    >
                      <dt>Range</dt>
                      <dd
                        className={cn(
                          "mt-2 text-sm font-semibold normal-case tracking-normal",
                          isSelected ? "text-white" : "text-neutral-950"
                        )}
                      >
                        {vehicle.range}
                      </dd>
                    </div>
                    <div
                      className={cn(
                        "rounded-[1rem] px-3 py-3",
                        isSelected
                          ? "bg-white/8 text-white/78"
                          : "bg-neutral-50 text-neutral-500"
                      )}
                    >
                      <dt>Top speed</dt>
                      <dd
                        className={cn(
                          "mt-2 text-sm font-semibold normal-case tracking-normal",
                          isSelected ? "text-white" : "text-neutral-950"
                        )}
                      >
                        {vehicle.topSpeed}
                      </dd>
                    </div>
                    <div
                      className={cn(
                        "rounded-[1rem] px-3 py-3",
                        isSelected
                          ? "bg-white/8 text-white/78"
                          : "bg-neutral-50 text-neutral-500"
                      )}
                    >
                      <dt>0-60</dt>
                      <dd
                        className={cn(
                          "mt-2 text-sm font-semibold normal-case tracking-normal",
                          isSelected ? "text-white" : "text-neutral-950"
                        )}
                      >
                        {vehicle.acceleration}
                      </dd>
                    </div>
                  </dl>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm leading-6 text-neutral-600">{helperText}</p>
      </Reveal>

      {selectedVehicles.length >= MIN_COMPARE_COUNT ? (
        <Reveal as="section" delay={0.08} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Results
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Side-by-side comparison
            </h2>
            <p className="text-sm leading-7 text-neutral-600 sm:text-base">
              Scan the selected lineup across performance, pricing, and
              positioning.
            </p>
          </div>

          <CompareTable vehicles={selectedVehicles} />
        </Reveal>
      ) : (
        <Reveal
          as="section"
          delay={0.08}
          className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-10 text-center shadow-[0_18px_44px_rgba(17,17,17,0.05)] sm:px-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            Select one more vehicle to compare
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Choose at least two models from the selector above to unlock the
            comparison table with pricing, performance, and next-step actions.
          </p>
        </Reveal>
      )}
    </div>
  );
}
