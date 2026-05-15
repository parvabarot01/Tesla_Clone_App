import "server-only";

import { cache } from "react";

import {
  getPaintOptionsForVehicle,
  interiorOptions,
  wheelOptions,
  type OrderOption,
} from "@/constants/orderOptions";
import { getPrismaClient } from "@/lib/prisma";

export type CheckoutOrderRecord = {
  createdAt: Date;
  id: string;
  interiorId: string;
  paintId: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  paymentStatus: string;
  paidAt: Date | null;
  submittedAt: Date;
  totalPrice: number;
  updatedAt: Date;
  userId: string | null;
  vehicleName: string;
  vehicleSlug: string;
  wheelId: string;
};

type OrderSelectionFields = Pick<
  CheckoutOrderRecord,
  "interiorId" | "paintId" | "vehicleSlug" | "wheelId"
>;

export type OrderSelectionDetails = {
  interiorLabel: string;
  paintLabel: string;
  wheelLabel: string;
};

function formatFallbackLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function findOptionLabel(options: OrderOption[], optionId: string) {
  return (
    options.find((option) => option.id === optionId)?.label ??
    formatFallbackLabel(optionId)
  );
}

const getOrderRecordById = cache(async (orderId: string) => {
  return getPrismaClient().order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      createdAt: true,
      id: true,
      interiorId: true,
      paintId: true,
      paymentMethod: true,
      paymentReference: true,
      paymentStatus: true,
      paidAt: true,
      submittedAt: true,
      totalPrice: true,
      updatedAt: true,
      userId: true,
      vehicleName: true,
      vehicleSlug: true,
      wheelId: true,
    },
  });
});

export async function getOrderById(orderId: string) {
  return getOrderRecordById(orderId);
}

export function getOrderSelectionDetails(
  order: OrderSelectionFields
): OrderSelectionDetails {
  const paintOptions = getPaintOptionsForVehicle(order.vehicleSlug);

  return {
    interiorLabel: findOptionLabel(interiorOptions, order.interiorId),
    paintLabel: findOptionLabel(paintOptions, order.paintId),
    wheelLabel: findOptionLabel(wheelOptions, order.wheelId),
  };
}
