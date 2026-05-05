"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  CircleDot,
  Palette,
  Sofa,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ApiRequestError } from "@/lib/fetcher";
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
import {
  buildOrderPriceBreakdown,
  createOrderPayload,
  formatCurrency,
  getOrderPreviewCandidates,
  getSelectedOrderOption,
  submitOrderPayload,
  validateOrderSelection,
} from "@/lib/order";
import {
  getBuildStorageKey,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import type {
  OrderConfirmation,
  OrderSelection,
  OrderValidationError,
  PersistedBuildSelection,
  Vehicle,
} from "@/types";

type OptionGroupProps = {
  description: string;
  icon: LucideIcon;
  options: OrderOption[];
  selectedId: string;
  title: string;
  onSelect: (id: string) => void;
};

function formatOptionCardPrice(price: number) {
  return price === 0 ? "Included" : formatCurrency(price);
}

function OptionGroup({
  description,
  icon: Icon,
  options,
  selectedId,
  title,
  onSelect,
}: OptionGroupProps) {
  const selectedOption = getSelectedOrderOption(options, selectedId);

  return (
    <fieldset className="rounded-[1.75rem] border border-black/6 bg-neutral-50/90 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl border border-black/6 bg-white shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
              <Icon className="size-4 text-neutral-800" />
            </span>
            <legend className="text-lg font-semibold tracking-tight text-neutral-950">
              {title}
            </legend>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            {description}
          </p>
        </div>

        {selectedOption ? (
          <span className="inline-flex w-fit rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            {selectedOption.label}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
              className={cn(
                "group flex w-full items-start justify-between gap-4 rounded-[1.4rem] border px-4 py-4 text-left transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/6",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_40px_rgba(17,17,17,0.18)]"
                  : "border-black/8 bg-white text-neutral-950 hover:border-black/16 hover:bg-neutral-50 hover:shadow-[0_14px_32px_rgba(17,17,17,0.06)] motion-safe:hover:-translate-y-px"
              )}
            >
              <span className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl border transition-colors duration-200",
                    isSelected
                      ? "border-white/15 bg-white/10"
                      : "border-black/8 bg-neutral-50"
                  )}
                >
                  {option.swatchClassName ? (
                    <span
                      aria-hidden="true"
                      className={cn("size-4 rounded-full", option.swatchClassName)}
                    />
                  ) : (
                    <Icon
                      className={cn(
                        "size-4",
                        isSelected ? "text-white" : "text-neutral-700"
                      )}
                    />
                  )}
                </span>

                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-semibold sm:text-base">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span
                      className={cn(
                        "text-sm leading-6",
                        isSelected ? "text-white/72" : "text-neutral-600"
                      )}
                    >
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-3">
                <span className="text-sm font-semibold sm:text-base">
                  {formatOptionCardPrice(option.price)}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
                    isSelected
                      ? "bg-white/12 text-white"
                      : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                  )}
                >
                  {isSelected ? <Check className="size-3" /> : null}
                  {isSelected ? "Selected" : "Choose"}
                </span>
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

type OrderFeedbackState =
  | { kind: "idle" }
  | { kind: "saved"; message: string }
  | { kind: "error"; errors: OrderValidationError[]; message: string }
  | { kind: "success"; message: string; order: OrderConfirmation };

type PreviewMediaProps = {
  category: string;
  paintLabel: string;
  prefersReducedMotion: boolean | null;
  previewCandidates: string[];
  vehicleName: string;
};

function isOrderValidationError(value: unknown): value is OrderValidationError {
  return (
    typeof value === "object" &&
    value !== null &&
    "field" in value &&
    "message" in value &&
    typeof value.field === "string" &&
    typeof value.message === "string"
  );
}

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function PreviewMedia({
  category,
  paintLabel,
  prefersReducedMotion,
  previewCandidates,
  vehicleName,
}: PreviewMediaProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewImage = previewCandidates[previewIndex] ?? previewCandidates[0];

  const handlePreviewError = () => {
    setPreviewIndex((currentIndex) => {
      if (currentIndex >= previewCandidates.length - 1) {
        return currentIndex;
      }

      return currentIndex + 1;
    });
  };

  return (
    <div className="relative aspect-[5/4] overflow-hidden bg-neutral-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={previewImage}
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 0.76, scale: 1.018 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.12 : 0.24,
            ease: "easeOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src={previewImage}
            alt={`${vehicleName} preview in ${paintLabel}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            onError={handlePreviewError}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/8 to-transparent" />

      <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
        <motion.span
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex rounded-full border border-white/18 bg-black/28 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm"
        >
          {paintLabel}
        </motion.span>

        <span className="inline-flex rounded-full border border-white/18 bg-black/28 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
          {category}
        </span>
      </div>
    </div>
  );
}

export function OrderConfigurator({ vehicle }: OrderConfiguratorProps) {
  const prefersReducedMotion = useReducedMotion();
  const paintOptions = getPaintOptionsForVehicle(vehicle.slug);
  const defaultPaintId = paintOptions[0]?.id ?? "";
  const defaultWheelsId = wheelOptions[0].id;
  const defaultInteriorId = interiorOptions[0].id;
  const buildStorageKey = getBuildStorageKey(vehicle.slug);
  const hasRestoredBuildRef = useRef(false);

  const [selectedPaintId, setSelectedPaintId] = useState(
    () => defaultPaintId
  );
  const [selectedWheelsId, setSelectedWheelsId] = useState(defaultWheelsId);
  const [selectedInteriorId, setSelectedInteriorId] = useState(defaultInteriorId);
  const [feedback, setFeedback] = useState<OrderFeedbackState>({ kind: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedBuild =
      safeLocalStorageGet<PersistedBuildSelection>(buildStorageKey);

    if (!storedBuild) {
      hasRestoredBuildRef.current = true;
      return;
    }

    const availablePaintOptions = getPaintOptionsForVehicle(vehicle.slug);
    const fallbackPaintId = availablePaintOptions[0]?.id ?? "";
    const nextPaintId = availablePaintOptions.some(
      (option) => option.id === storedBuild.paintId
    )
      ? storedBuild.paintId
      : fallbackPaintId;
    const nextWheelsId = wheelOptions.some(
      (option) => option.id === storedBuild.wheelsId
    )
      ? storedBuild.wheelsId
      : defaultWheelsId;
    const nextInteriorId = interiorOptions.some(
      (option) => option.id === storedBuild.interiorId
    )
      ? storedBuild.interiorId
      : defaultInteriorId;

    const frame = window.requestAnimationFrame(() => {
      setSelectedPaintId(nextPaintId);
      setSelectedWheelsId(nextWheelsId);
      setSelectedInteriorId(nextInteriorId);
      hasRestoredBuildRef.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [buildStorageKey, defaultInteriorId, defaultWheelsId, vehicle.slug]);

  const selectedPaint = getSelectedOrderOption(paintOptions, selectedPaintId);
  const selectedWheels = getSelectedOrderOption(wheelOptions, selectedWheelsId);
  const selectedInterior = getSelectedOrderOption(
    interiorOptions,
    selectedInteriorId
  );
  const currentSelection: OrderSelection = {
    vehicleSlug: vehicle.slug,
    paintId: selectedPaintId,
    wheelId: selectedWheelsId,
    interiorId: selectedInteriorId,
  };
  const pricing = selectedPaint
    ? buildOrderPriceBreakdown(
        vehicle,
        selectedPaint,
        selectedWheels,
        selectedInterior
      )
    : {
        basePrice: 0,
        paintPrice: 0,
        wheelPrice: 0,
        interiorPrice: 0,
        totalPrice: 0,
      };

  const previewCandidates = getOrderPreviewCandidates(vehicle, selectedPaint);
  const previewSignature = previewCandidates.join("|");

  useEffect(() => {
    if (!hasRestoredBuildRef.current || !selectedPaint) {
      return;
    }

    safeLocalStorageSet(buildStorageKey, {
      paintId: selectedPaint.id,
      wheelsId: selectedWheels.id,
      interiorId: selectedInterior.id,
    } satisfies PersistedBuildSelection);
  }, [
    buildStorageKey,
    selectedInterior.id,
    selectedPaint,
    selectedWheels.id,
  ]);

  function handlePaintSelect(paintId: string) {
    setFeedback({ kind: "idle" });
    setSelectedPaintId(paintId);
  }

  function handleWheelsSelect(wheelsId: string) {
    setFeedback({ kind: "idle" });
    setSelectedWheelsId(wheelsId);
  }

  function handleInteriorSelect(interiorId: string) {
    setFeedback({ kind: "idle" });
    setSelectedInteriorId(interiorId);
  }

  function handleResetBuild() {
    setFeedback({ kind: "idle" });
    setSelectedPaintId(defaultPaintId);
    setSelectedWheelsId(defaultWheelsId);
    setSelectedInteriorId(defaultInteriorId);
  }

  function handleSaveBuild() {
    safeLocalStorageSet(buildStorageKey, {
      paintId: selectedPaintId,
      wheelsId: selectedWheelsId,
      interiorId: selectedInteriorId,
    } satisfies PersistedBuildSelection);

    setFeedback({
      kind: "saved",
      message: `Build saved locally for ${vehicle.name}.`,
    });
  }

  async function handleContinue() {
    const validation = validateOrderSelection(currentSelection);

    if (!validation.isValid) {
      setFeedback({
        kind: "error",
        message: "Review the selected configuration before continuing.",
        errors: validation.errors,
      });
      return;
    }

    const payload = createOrderPayload(validation);

    setIsSubmitting(true);

    try {
      const result = await submitOrderPayload(payload);

      safeLocalStorageRemove(buildStorageKey);

      setFeedback({
        kind: "success",
        message: `Order saved for ${result.vehicleName}.`,
        order: result,
      });
    } catch (error) {
      const errors =
        error instanceof ApiRequestError && Array.isArray(error.details)
          ? error.details.filter(isOrderValidationError)
          : [];

      setFeedback({
        kind: "error",
        message:
          error instanceof ApiRequestError
            ? error.message
            : "Unable to save the order right now.",
        errors,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-24">
            <Reveal
              as="article"
              className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
            >
              <PreviewMedia
                key={previewSignature}
                category={vehicle.category}
                paintLabel={selectedPaint?.label ?? "Preview"}
                prefersReducedMotion={prefersReducedMotion}
                previewCandidates={previewCandidates}
                vehicleName={vehicle.name}
              />

              <div className="space-y-5 px-6 py-7 sm:px-8">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-neutral-500">
                    Design Your Build
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                    {vehicle.name}
                  </h1>
                  <p className="text-sm leading-7 text-neutral-600 sm:text-base">
                    {vehicle.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    {selectedPaint?.label}
                  </span>
                  <span className="inline-flex rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    {selectedWheels.label}
                  </span>
                  <span className="inline-flex rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    {selectedInterior.label}
                  </span>
                </div>

                <dl className="grid gap-3 pt-1 sm:grid-cols-3">
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

                <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                  Paint-based preview imagery updates automatically when a matching placeholder image exists.
                </p>
              </div>
            </Reveal>

            <Reveal
              as="section"
              delay={0.08}
              className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
            >
              <div className="border-b border-black/6 px-6 py-6 sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  Selected Build
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                  Build summary
                </h2>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  A quick readout of the current configuration and its pricing breakdown.
                </p>
              </div>

              <div className="space-y-6 px-6 py-6 sm:px-8">
                <dl className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-neutral-600">Vehicle</dt>
                    <dd className="text-right text-sm font-semibold text-neutral-950">
                      {vehicle.name}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-neutral-600">Paint</dt>
                    <dd className="text-right text-sm font-semibold text-neutral-950">
                      {selectedPaint?.label}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-neutral-600">Wheels</dt>
                    <dd className="text-right text-sm font-semibold text-neutral-950">
                      {selectedWheels.label}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-neutral-600">Interior</dt>
                    <dd className="text-right text-sm font-semibold text-neutral-950">
                      {selectedInterior.label}
                    </dd>
                  </div>
                </dl>

                <div className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    <Sparkles className="size-4" />
                    Pricing
                  </div>

                  <dl className="mt-5 space-y-3 text-sm sm:text-base">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-neutral-600">Base price</dt>
                      <dd className="font-semibold text-neutral-950">
                        {formatCurrency(pricing.basePrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-neutral-600">
                        Paint
                        {selectedPaint ? (
                          <span className="ml-2 text-xs text-neutral-500">
                            {selectedPaint.label}
                          </span>
                        ) : null}
                      </dt>
                      <dd className="font-semibold text-neutral-950">
                        {formatCurrency(pricing.paintPrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-neutral-600">
                        Wheels
                        <span className="ml-2 text-xs text-neutral-500">
                          {selectedWheels.label}
                        </span>
                      </dt>
                      <dd className="font-semibold text-neutral-950">
                        {formatCurrency(pricing.wheelPrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-neutral-600">
                        Interior
                        <span className="ml-2 text-xs text-neutral-500">
                          {selectedInterior.label}
                        </span>
                      </dt>
                      <dd className="font-semibold text-neutral-950">
                        {formatCurrency(pricing.interiorPrice)}
                      </dd>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/8 pt-4">
                      <dt className="text-base font-semibold text-neutral-950">
                        Total price
                      </dt>
                      <AnimatePresence mode="wait">
                        <motion.dd
                          key={pricing.totalPrice}
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, y: 8 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: -8 }
                          }
                          transition={{ duration: 0.18 }}
                          className="text-2xl font-semibold tracking-tight text-neutral-950"
                        >
                          {formatCurrency(pricing.totalPrice)}
                        </motion.dd>
                      </AnimatePresence>
                    </div>
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal
            as="article"
            delay={0.1}
            className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
          >
            <div className="border-b border-black/6 px-6 py-6 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Configure
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                Build your {vehicle.name}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Refine the exterior, wheel package, and interior finish to create a more complete frontend-only buying flow.
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <OptionGroup
                title="Paint Color"
                description="Choose a finish that sets the tone for the exterior. Matching placeholder preview imagery will appear when available."
                icon={Palette}
                options={paintOptions}
                selectedId={selectedPaintId}
                onSelect={handlePaintSelect}
              />

              <OptionGroup
                title="Wheels"
                description="Dial in the overall stance and road presence with a wheel setup that matches your build."
                icon={CircleDot}
                options={wheelOptions}
                selectedId={selectedWheelsId}
                onSelect={handleWheelsSelect}
              />

              <OptionGroup
                title="Interior"
                description="Pick a cabin finish that feels clean, quiet, and premium for everyday use."
                icon={Sofa}
                options={interiorOptions}
                selectedId={selectedInteriorId}
                onSelect={handleInteriorSelect}
              />

              <div className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    size="lg"
                    disabled={isSubmitting}
                    onClick={handleContinue}
                    className="h-11 flex-1 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
                  >
                    {isSubmitting ? "Saving Order..." : "Save Order"}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={handleSaveBuild}
                    className="h-11 flex-1 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
                  >
                    Save Build
                  </Button>
                </div>

                {feedback.kind !== "idle" ? (
                  <div
                    aria-live="polite"
                    className={cn(
                      "mt-4 rounded-[1.35rem] border px-4 py-4 text-sm leading-6 shadow-[0_16px_34px_rgba(17,17,17,0.05)] sm:px-5",
                      feedback.kind === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                        : feedback.kind === "saved"
                          ? "border-sky-200 bg-sky-50 text-sky-950"
                          : "border-rose-200 bg-rose-50 text-rose-950"
                    )}
                  >
                    <p className="font-semibold">{feedback.message}</p>

                    {feedback.kind === "error" && feedback.errors.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm">
                        {feedback.errors.map((error) => (
                          <li key={`${error.field}-${error.message}`}>
                            {error.message}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {feedback.kind === "success" ? (
                      <div className="mt-3 space-y-1 text-sm">
                        <p>
                          Saved order {feedback.order.orderId} for{" "}
                          {feedback.order.vehicleName} at{" "}
                          {formatCurrency(feedback.order.totalPrice)}.
                        </p>
                        <p>
                          Selection: {selectedPaint?.label}, {selectedWheels.label},{" "}
                          {selectedInterior.label}.
                        </p>
                        <p>
                          Submitted {formatSubmittedAt(feedback.order.submittedAt)}.
                        </p>
                        <p>
                          Your saved local build was cleared after the order was
                          recorded.
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-neutral-600">
                    Build selections save automatically on this device for{" "}
                    {vehicle.name}.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full px-4 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
                    onClick={handleResetBuild}
                  >
                    Reset build
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
