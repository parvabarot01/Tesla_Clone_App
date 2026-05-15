import "server-only";

import type {
  Order as PersistedOrder,
  Vehicle as DbVehicle,
} from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import {
  buildOrderPriceBreakdownFromBasePrice,
  type ValidatedOrderSelection,
} from "@/lib/order";
import { getPaymentStatusValue } from "@/lib/payment";
import type { OrderConfirmation } from "@/types";

function parseSubmittedAt(submittedAt: string) {
  const parsedDate = new Date(submittedAt);

  return Number.isNaN(parsedDate.valueOf()) ? new Date() : parsedDate;
}

export function mapValidatedOrderToCreateInput(
  validatedSelection: Extract<ValidatedOrderSelection, { isValid: true }>,
  dbVehicle: DbVehicle,
  submittedAt: string,
  userId?: string | null
) {
  const pricing = buildOrderPriceBreakdownFromBasePrice(
    dbVehicle.startingPrice,
    validatedSelection.paintOption,
    validatedSelection.wheelOption,
    validatedSelection.interiorOption
  );

  return {
    vehicleSlug: dbVehicle.slug,
    vehicleName: dbVehicle.name,
    paintId: validatedSelection.selection.paintId,
    wheelId: validatedSelection.selection.wheelId,
    interiorId: validatedSelection.selection.interiorId,
    basePrice: pricing.basePrice,
    paintPrice: pricing.paintPrice,
    wheelPrice: pricing.wheelPrice,
    interiorPrice: pricing.interiorPrice,
    totalPrice: pricing.totalPrice,
    submittedAt: parseSubmittedAt(submittedAt),
    ...(userId
      ? {
          user: {
            connect: {
              id: userId,
            },
          },
        }
      : {}),
  } satisfies Prisma.OrderCreateInput;
}

export function mapPersistedOrderToConfirmation(
  order: PersistedOrder
): OrderConfirmation {
  return {
    accepted: true,
    orderId: order.id,
    paymentStatus: getPaymentStatusValue(order.paymentStatus),
    vehicleSlug: order.vehicleSlug,
    vehicleName: order.vehicleName,
    totalPrice: order.totalPrice,
    submittedAt: order.submittedAt.toISOString(),
  };
}
