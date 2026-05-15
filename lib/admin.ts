import "server-only";

import { requireAuthenticatedUser, type AuthenticatedUser } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { formatMockPaymentMethod, formatPaymentStatus } from "@/lib/payment";
import { getPrismaClient } from "@/lib/prisma";
import type { UserRole } from "@/types";

export const ADMIN_ROLE: UserRole = "ADMIN";
export const USER_ROLE: UserRole = "USER";

export type AdminPageAccess = {
  isAdmin: boolean;
  user: AuthenticatedUser;
};

export type AdminOverviewData = {
  demoDriveRequestCount: number;
  orderCount: number;
  pendingPaymentCount: number;
  vehicleCount: number;
};

export type AdminOrderListItem = {
  customerLabel: string;
  customerSecondaryLabel: string;
  id: string;
  paymentMethodLabel: string | null;
  paymentReference: string | null;
  paymentStatus: string;
  paymentStatusLabel: string;
  shortId: string;
  submittedAtFormatted: string;
  totalPriceFormatted: string;
  vehicleName: string;
};

export type AdminDemoDriveListItem = {
  customerLabel: string;
  customerSecondaryLabel: string;
  id: string;
  location: string;
  preferredDateFormatted: string;
  preferredTimeSlot: string;
  referenceId: string;
  submittedAtFormatted: string;
  vehicleName: string;
};

export type AdminVehicleListItem = {
  category: string;
  id: string;
  name: string;
  slug: string;
  startingPriceFormatted: string;
  tagline: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export function isAdminRole(role?: string | null): role is UserRole {
  return role === ADMIN_ROLE;
}

export function isAdminUser(
  user?: Pick<AuthenticatedUser, "role"> | null
): user is AuthenticatedUser {
  return isAdminRole(user?.role);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDateTime(value: Date) {
  return dateTimeFormatter.format(value);
}

function formatDateOnly(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return dateFormatter.format(parsedDate);
}

function getLinkedUserIdentity(
  user: {
    email: string | null;
    name: string | null;
  } | null,
  fallbackPrimary: string,
  fallbackSecondary: string
) {
  const trimmedName = user?.name?.trim();
  const trimmedEmail = user?.email?.trim() ?? null;

  if (trimmedName && trimmedEmail) {
    return {
      primary: trimmedName,
      secondary: trimmedEmail,
    };
  }

  if (trimmedName) {
    return {
      primary: trimmedName,
      secondary: "Account linked",
    };
  }

  if (trimmedEmail) {
    return {
      primary: trimmedEmail,
      secondary: "Account linked",
    };
  }

  return {
    primary: fallbackPrimary,
    secondary: fallbackSecondary,
  };
}

function getDemoDriveIdentity(demoDriveRequest: {
  email: string;
  fullName: string;
  user: {
    email: string | null;
    name: string | null;
  } | null;
}) {
  const linkedIdentity = getLinkedUserIdentity(demoDriveRequest.user, "", "");

  if (linkedIdentity.primary) {
    return linkedIdentity;
  }

  const trimmedName = demoDriveRequest.fullName.trim();
  const trimmedEmail = demoDriveRequest.email.trim();

  return {
    primary: trimmedName || trimmedEmail || "Guest request",
    secondary: trimmedName && trimmedEmail ? trimmedEmail : "Request details",
  };
}

export async function getAdminPageAccess(
  callbackUrl = ROUTES.admin
): Promise<AdminPageAccess> {
  const user = await requireAuthenticatedUser(callbackUrl);

  return {
    isAdmin: isAdminUser(user),
    user,
  };
}

export async function getCurrentAdminUser(
  callbackUrl = ROUTES.admin
): Promise<AuthenticatedUser | null> {
  const user = await requireAuthenticatedUser(callbackUrl);

  return isAdminUser(user) ? user : null;
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const prisma = getPrismaClient();

  const [orderCount, pendingPaymentCount, demoDriveRequestCount, vehicleCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          paymentStatus: "PENDING",
        },
      }),
      prisma.demoDriveRequest.count(),
      prisma.vehicle.count(),
    ]);

  return {
    demoDriveRequestCount,
    orderCount,
    pendingPaymentCount,
    vehicleCount,
  };
}

export async function getAdminOrdersViewData(): Promise<AdminOrderListItem[]> {
  const prisma = getPrismaClient();
  const orders = await prisma.order.findMany({
    orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      paymentMethod: true,
      paymentReference: true,
      paymentStatus: true,
      submittedAt: true,
      totalPrice: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      vehicleName: true,
    },
  });

  return orders.map((order) => {
    const customerIdentity = getLinkedUserIdentity(
      order.user,
      "Guest order",
      "No linked account"
    );

    return {
      customerLabel: customerIdentity.primary,
      customerSecondaryLabel: customerIdentity.secondary,
      id: order.id,
      paymentMethodLabel: order.paymentMethod
        ? formatMockPaymentMethod(order.paymentMethod)
        : null,
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus,
      paymentStatusLabel: formatPaymentStatus(order.paymentStatus),
      shortId: order.id.slice(0, 8).toUpperCase(),
      submittedAtFormatted: formatDateTime(order.submittedAt),
      totalPriceFormatted: formatCurrency(order.totalPrice),
      vehicleName: order.vehicleName,
    };
  });
}

export async function getAdminDemoDriveViewData(): Promise<
  AdminDemoDriveListItem[]
> {
  const prisma = getPrismaClient();
  const demoDriveRequests = await prisma.demoDriveRequest.findMany({
    orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
    select: {
      email: true,
      fullName: true,
      id: true,
      location: true,
      preferredDate: true,
      preferredTimeSlot: true,
      referenceId: true,
      submittedAt: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      vehicleName: true,
    },
  });

  return demoDriveRequests.map((demoDriveRequest) => {
    const customerIdentity = getDemoDriveIdentity(demoDriveRequest);

    return {
      customerLabel: customerIdentity.primary,
      customerSecondaryLabel: customerIdentity.secondary,
      id: demoDriveRequest.id,
      location: demoDriveRequest.location,
      preferredDateFormatted: formatDateOnly(demoDriveRequest.preferredDate),
      preferredTimeSlot: demoDriveRequest.preferredTimeSlot,
      referenceId: demoDriveRequest.referenceId,
      submittedAtFormatted: formatDateTime(demoDriveRequest.submittedAt),
      vehicleName: demoDriveRequest.vehicleName,
    };
  });
}

export async function getAdminVehiclesViewData(): Promise<AdminVehicleListItem[]> {
  const prisma = getPrismaClient();
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: {
      category: true,
      id: true,
      name: true,
      slug: true,
      startingPrice: true,
      tagline: true,
    },
  });

  return vehicles.map((vehicle) => ({
    category: vehicle.category,
    id: vehicle.id,
    name: vehicle.name,
    slug: vehicle.slug,
    startingPriceFormatted: formatCurrency(vehicle.startingPrice),
    tagline: vehicle.tagline,
  }));
}
