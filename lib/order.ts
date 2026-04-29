import type { OrderOption } from "@/constants/orderOptions";
import type { Vehicle } from "@/types";

const previewExtensions = ["jpeg", "jpg", "avif", "webp", "png"] as const;

export type OrderPricingBreakdown = {
  basePrice: number;
  paintPrice: number;
  wheelsPrice: number;
  interiorPrice: number;
  totalPrice: number;
};

export function parseCurrency(value: string) {
  return Number(value.replace(/[^0-9.]+/g, ""));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getSelectedOrderOption(
  options: OrderOption[],
  selectedId: string
) {
  return options.find((option) => option.id === selectedId) ?? options[0];
}

export function getOrderPricingBreakdown(
  vehicle: Vehicle,
  selectedPaint: OrderOption,
  selectedWheels: OrderOption,
  selectedInterior: OrderOption
): OrderPricingBreakdown {
  const basePrice = parseCurrency(vehicle.startingPrice);
  const paintPrice = selectedPaint.price;
  const wheelsPrice = selectedWheels.price;
  const interiorPrice = selectedInterior.price;

  return {
    basePrice,
    paintPrice,
    wheelsPrice,
    interiorPrice,
    totalPrice: basePrice + paintPrice + wheelsPrice + interiorPrice,
  };
}

export function getOrderPreviewCandidates(
  vehicle: Vehicle,
  selectedPaint?: OrderOption
) {
  const explicitPath = selectedPaint?.previewImages?.[vehicle.slug];
  const generatedOrderPaths = selectedPaint
    ? previewExtensions.map(
        (extension) => `/images/order/${vehicle.slug}/${selectedPaint.id}.${extension}`
      )
    : [];
  const generatedVehiclePaths = selectedPaint
    ? previewExtensions.map(
        (extension) =>
          `/images/vehicles/${vehicle.slug}/${selectedPaint.id}.${extension}`
      )
    : [];

  return Array.from(
    new Set([
      explicitPath,
      ...generatedOrderPaths,
      ...generatedVehiclePaths,
      vehicle.image,
    ].filter((value): value is string => Boolean(value)))
  );
}
