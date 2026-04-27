"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  getPaintOptionsForVehicle,
  interiorOptions,
  wheelOptions,
  type OrderOption,
} from "@/constants/orderOptions";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types";

type OptionGroupProps = {
  description: string;
  name: string;
  options: OrderOption[];
  selectedId: string;
  title: string;
  onSelect: (id: string) => void;
};

function parsePrice(value: string) {
  return Number(value.replace(/[^0-9.]+/g, ""));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSelectedOption(options: OrderOption[], selectedId: string) {
  return options.find((option) => option.id === selectedId) ?? options[0];
}

function getPaintPreviewImage(vehicle: Vehicle, selectedPaint: OrderOption) {
  return selectedPaint.previewImages?.[vehicle.slug] ?? vehicle.image;
}

function OptionGroup({
  description,
  name,
  options,
  selectedId,
  title,
  onSelect,
}: OptionGroupProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </legend>
      <p className="text-sm leading-6 text-neutral-600">{description}</p>

      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
              className={cn(
                "group flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/6",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_40px_rgba(17,17,17,0.18)]"
                  : "border-black/8 bg-white text-neutral-950 hover:border-black/16 hover:bg-neutral-50 hover:shadow-[0_14px_32px_rgba(17,17,17,0.06)] motion-safe:hover:-translate-y-px"
              )}
            >
              <span className="flex flex-col gap-1">
                <span className="text-sm font-semibold sm:text-base">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "text-xs uppercase tracking-[0.2em]",
                    isSelected ? "text-white/62" : "text-neutral-500"
                  )}
                >
                  {name}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-sm font-semibold sm:text-base">
                  {formatCurrency(option.price)}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-3 rounded-full border transition-colors duration-200",
                    isSelected
                      ? "border-white bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.14)]"
                      : "border-neutral-300 bg-transparent group-hover:border-neutral-400"
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

type OrderConfiguratorProps = {
  vehicle: Vehicle;
};

export function OrderConfigurator({ vehicle }: OrderConfiguratorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedPaintId, setSelectedPaintId] = useState("");
  const [selectedWheelsId, setSelectedWheelsId] = useState(wheelOptions[0].id);
  const [selectedInteriorId, setSelectedInteriorId] = useState(
    interiorOptions[0].id
  );

  const paintOptions = useMemo(
    () => getPaintOptionsForVehicle(vehicle.slug),
    [vehicle.slug]
  );
  const basePrice = useMemo(
    () => parsePrice(vehicle.startingPrice),
    [vehicle.startingPrice]
  );
  const selectedPaint = getSelectedOption(paintOptions, selectedPaintId);
  const selectedWheels = getSelectedOption(wheelOptions, selectedWheelsId);
  const selectedInterior = getSelectedOption(interiorOptions, selectedInteriorId);
  const previewImage = getPaintPreviewImage(vehicle, selectedPaint);
  const totalPrice =
    basePrice +
    selectedPaint.price +
    selectedWheels.price +
    selectedInterior.price;

  return (
    <section className="bg-neutral-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink
            href={ROUTES.vehicleDetails(vehicle.slug)}
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
          >
            Back to Vehicle Details
          </ButtonLink>
          <ButtonLink
            href={ROUTES.vehicles}
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
          >
            Back to Vehicles
          </ButtonLink>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <Reveal as="article" className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
            <div className="relative aspect-[5/4] overflow-hidden bg-neutral-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewImage}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.72, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={previewImage}
                    alt={`${vehicle.name} preview in ${selectedPaint.label}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-black/6 to-transparent" />
              <div className="absolute left-5 top-5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selectedPaint.id}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex rounded-full border border-white/18 bg-black/28 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm"
                  >
                    {selectedPaint.label}
                  </motion.span>
                </AnimatePresence>
              </div>
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
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-500">
                Color preview updates when a supported paint image is available.
              </p>

              <dl className="grid gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-[1.35rem] bg-neutral-50 px-4 py-4 transition-[background-color,transform] duration-200 ease-out motion-safe:hover:-translate-y-px">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Range
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-neutral-950">
                    {vehicle.range}
                  </dd>
                </div>
                <div className="rounded-[1.35rem] bg-neutral-50 px-4 py-4 transition-[background-color,transform] duration-200 ease-out motion-safe:hover:-translate-y-px">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Top Speed
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-neutral-950">
                    {vehicle.topSpeed}
                  </dd>
                </div>
                <div className="rounded-[1.35rem] bg-neutral-50 px-4 py-4 transition-[background-color,transform] duration-200 ease-out motion-safe:hover:-translate-y-px">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    0-60 mph
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-neutral-950">
                    {vehicle.acceleration}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal
            as="article"
            delay={0.08}
            className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
          >
            <div className="border-b border-black/6 px-6 py-6 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Configure
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                Build your {vehicle.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                This is a frontend-only mock configurator. Select paint, wheels,
                and interior options to see the total update instantly.
              </p>
            </div>

            <div className="space-y-8 px-6 py-6 sm:px-8">
              <OptionGroup
                title="Paint Color"
                name="Paint"
                description="Choose a finish that fits the mood of your build."
                options={paintOptions}
                selectedId={selectedPaintId}
                onSelect={setSelectedPaintId}
              />

              <OptionGroup
                title="Wheels"
                name="Wheels"
                description="Dial in the overall stance and road presence."
                options={wheelOptions}
                selectedId={selectedWheelsId}
                onSelect={setSelectedWheelsId}
              />

              <OptionGroup
                title="Interior"
                name="Interior"
                description="Pick a cabin finish for a cleaner everyday experience."
                options={interiorOptions}
                selectedId={selectedInteriorId}
                onSelect={setSelectedInteriorId}
              />

              <section
                aria-labelledby="price-summary-heading"
                className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6"
              >
                <h3
                  id="price-summary-heading"
                  className="text-lg font-semibold tracking-tight text-neutral-950"
                >
                  Price Summary
                </h3>

                <dl className="mt-5 space-y-3 text-sm sm:text-base">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-neutral-600">Base price</dt>
                    <dd className="font-semibold text-neutral-950">
                      {formatCurrency(basePrice)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-neutral-600">Paint price</dt>
                    <dd className="font-semibold text-neutral-950">
                      {formatCurrency(selectedPaint.price)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-neutral-600">Wheels price</dt>
                    <dd className="font-semibold text-neutral-950">
                      {formatCurrency(selectedWheels.price)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-neutral-600">Interior price</dt>
                    <dd className="font-semibold text-neutral-950">
                      {formatCurrency(selectedInterior.price)}
                    </dd>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/8 pt-4">
                    <dt className="text-base font-semibold text-neutral-950">
                      Total price
                    </dt>
                    <AnimatePresence mode="wait">
                      <motion.dd
                        key={totalPrice}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="text-2xl font-semibold tracking-tight text-neutral-950"
                      >
                        {formatCurrency(totalPrice)}
                      </motion.dd>
                    </AnimatePresence>
                  </div>
                </dl>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  size="lg"
                  className="h-11 flex-1 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
                >
                  Continue
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="h-11 flex-1 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
                >
                  Save Build
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
