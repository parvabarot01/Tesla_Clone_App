import "server-only";

import {
  getPaintOptionsForVehicle,
  interiorOptions,
  wheelOptions,
  type OrderOption,
} from "@/constants/orderOptions";
import { getPrismaClient } from "@/lib/prisma";

type DashboardOrderRecord = {
  id: string;
  interiorId: string;
  paintId: string;
  submittedAt: Date;
  totalPrice: number;
  vehicleName: string;
  vehicleSlug: string;
  wheelId: string;
};

type DashboardDemoDriveRecord = {
  id: string;
  location: string;
  preferredDate: string;
  preferredTimeSlot: string;
  referenceId: string;
  submittedAt: Date;
  vehicleName: string;
  vehicleSlug: string;
};

export type DashboardOrderHistoryItem = {
  id: string;
  interiorLabel: string;
  paintLabel: string;
  shortId: string;
  submittedAtFormatted: string;
  totalPriceFormatted: string;
  vehicleName: string;
  vehicleSlug: string;
  wheelLabel: string;
};

export type DashboardDemoDriveHistoryItem = {
  id: string;
  location: string;
  preferredDateFormatted: string;
  preferredTimeSlot: string;
  referenceId: string;
  submittedAtFormatted: string;
  vehicleName: string;
  vehicleSlug: string;
};

export type DashboardData = {
  demoDriveRequests: DashboardDemoDriveHistoryItem[];
  orders: DashboardOrderHistoryItem[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const submittedAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const preferredDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

function formatSubmittedAt(value: Date) {
  return submittedAtFormatter.format(value);
}

function formatPreferredDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return preferredDateFormatter.format(parsedDate);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

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

function mapOrderRecord(order: DashboardOrderRecord): DashboardOrderHistoryItem {
  const paintOptions = getPaintOptionsForVehicle(order.vehicleSlug);

  return {
    id: order.id,
    interiorLabel: findOptionLabel(interiorOptions, order.interiorId),
    paintLabel: findOptionLabel(paintOptions, order.paintId),
    shortId: order.id.slice(0, 8).toUpperCase(),
    submittedAtFormatted: formatSubmittedAt(order.submittedAt),
    totalPriceFormatted: formatCurrency(order.totalPrice),
    vehicleName: order.vehicleName,
    vehicleSlug: order.vehicleSlug,
    wheelLabel: findOptionLabel(wheelOptions, order.wheelId),
  };
}

function mapDemoDriveRecord(
  demoDriveRequest: DashboardDemoDriveRecord
): DashboardDemoDriveHistoryItem {
  return {
    id: demoDriveRequest.id,
    location: demoDriveRequest.location,
    preferredDateFormatted: formatPreferredDate(
      demoDriveRequest.preferredDate
    ),
    preferredTimeSlot: demoDriveRequest.preferredTimeSlot,
    referenceId: demoDriveRequest.referenceId,
    submittedAtFormatted: formatSubmittedAt(demoDriveRequest.submittedAt),
    vehicleName: demoDriveRequest.vehicleName,
    vehicleSlug: demoDriveRequest.vehicleSlug,
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const prisma = getPrismaClient();

  const [orders, demoDriveRequests] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        interiorId: true,
        paintId: true,
        submittedAt: true,
        totalPrice: true,
        vehicleName: true,
        vehicleSlug: true,
        wheelId: true,
      },
    }),
    prisma.demoDriveRequest.findMany({
      where: {
        userId,
      },
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        location: true,
        preferredDate: true,
        preferredTimeSlot: true,
        referenceId: true,
        submittedAt: true,
        vehicleName: true,
        vehicleSlug: true,
      },
    }),
  ]);

  return {
    demoDriveRequests: demoDriveRequests.map(mapDemoDriveRecord),
    orders: orders.map(mapOrderRecord),
  };
}
