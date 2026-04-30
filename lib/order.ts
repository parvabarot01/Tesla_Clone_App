import {
  getPaintOptionsForVehicle,
  interiorOptions,
  wheelOptions,
  type OrderOption,
} from "@/constants/orderOptions";
import { API_ROUTES } from "@/constants/api";
import { getVehicleBySlug as getLocalVehicleBySlug } from "@/data/vehicles";
import { fetchApiJson } from "@/lib/fetcher";
import type {
  OrderPayload,
  OrderPriceBreakdown,
  OrderSelection,
  OrderValidationError,
  Vehicle,
} from "@/types";

const previewExtensions = ["jpeg", "jpg", "avif", "webp", "png"] as const;

export type ValidatedOrderSelection =
  | {
      errors: [];
      interiorOption: OrderOption;
      isValid: true;
      paintOption: OrderOption;
      selection: OrderSelection;
      vehicle: Vehicle;
      wheelOption: OrderOption;
    }
  | {
      errors: OrderValidationError[];
      isValid: false;
      selection: OrderSelection;
    };

export type OrderSubmissionResult = {
  accepted: true;
  message: string;
  order: OrderPayload;
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

function findOrderOption(options: OrderOption[], optionId: string) {
  return options.find((option) => option.id === optionId);
}

export function buildOrderPriceBreakdown(
  vehicle: Vehicle,
  selectedPaint: OrderOption,
  selectedWheel: OrderOption,
  selectedInterior: OrderOption
): OrderPriceBreakdown {
  const basePrice = parseCurrency(vehicle.startingPrice);
  const paintPrice = selectedPaint.price;
  const wheelPrice = selectedWheel.price;
  const interiorPrice = selectedInterior.price;

  return {
    basePrice,
    paintPrice,
    wheelPrice,
    interiorPrice,
    totalPrice: basePrice + paintPrice + wheelPrice + interiorPrice,
  };
}

export function validateOrderSelection(
  selection: OrderSelection
): ValidatedOrderSelection {
  const errors: OrderValidationError[] = [];
  const vehicle = getLocalVehicleBySlug(selection.vehicleSlug);

  if (!vehicle) {
    errors.push({
      field: "vehicleSlug",
      message: "Choose a valid vehicle before continuing.",
    });
  }

  const paintOptions = vehicle ? getPaintOptionsForVehicle(vehicle.slug) : [];
  const paintOption = findOrderOption(paintOptions, selection.paintId);

  if (!paintOption) {
    errors.push({
      field: "paintId",
      message: "Choose a valid paint option for this vehicle.",
    });
  }

  const wheelOption = findOrderOption(wheelOptions, selection.wheelId);

  if (!wheelOption) {
    errors.push({
      field: "wheelId",
      message: "Choose a valid wheel option.",
    });
  }

  const interiorOption = findOrderOption(interiorOptions, selection.interiorId);

  if (!interiorOption) {
    errors.push({
      field: "interiorId",
      message: "Choose a valid interior option.",
    });
  }

  if (!vehicle || !paintOption || !wheelOption || !interiorOption) {
    return {
      isValid: false,
      errors,
      selection,
    };
  }

  return {
    isValid: true,
    errors: [],
    interiorOption,
    paintOption,
    selection,
    vehicle,
    wheelOption,
  };
}

export function createOrderPayload(
  validatedSelection: Extract<ValidatedOrderSelection, { isValid: true }>,
  submittedAt = new Date().toISOString()
): OrderPayload {
  return {
    vehicleSlug: validatedSelection.vehicle.slug,
    vehicleName: validatedSelection.vehicle.name,
    selection: validatedSelection.selection,
    pricing: buildOrderPriceBreakdown(
      validatedSelection.vehicle,
      validatedSelection.paintOption,
      validatedSelection.wheelOption,
      validatedSelection.interiorOption
    ),
    submittedAt,
  };
}

export async function submitOrderPayload(payload: OrderPayload) {
  return fetchApiJson<OrderSubmissionResult>(API_ROUTES.orders, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getOrderPreviewCandidates(
  vehicle: Vehicle,
  selectedPaint?: OrderOption
) {
  const explicitPath = selectedPaint?.previewImages?.[vehicle.slug];
  const generatedOrderPaths = selectedPaint
    ? previewExtensions.map(
        (extension) =>
          `/images/order/${vehicle.slug}/${selectedPaint.id}.${extension}`
      )
    : [];
  const generatedVehiclePaths = selectedPaint
    ? previewExtensions.map(
        (extension) =>
          `/images/vehicles/${vehicle.slug}/${selectedPaint.id}.${extension}`
      )
    : [];

  return Array.from(
    new Set(
      [
        explicitPath,
        ...generatedOrderPaths,
        ...generatedVehiclePaths,
        vehicle.image,
      ].filter((value): value is string => Boolean(value))
    )
  );
}
