import {
  createApiErrorResponse,
  createApiSuccessResponse,
  isRecord,
  readString,
} from "@/lib/api";
import { getCurrentAuthUserId } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import {
  createMockPaymentReference,
  getMockPaymentMethodValue,
  getPaymentStatusValue,
  isMockPaymentMethod,
  isMockPaymentResultStatus,
  isTerminalPaymentStatus,
} from "@/lib/payment";
import type {
  MockPaymentMethod,
  PaymentConfirmation,
  PaymentUpdatePayload,
} from "@/types";

type PaymentRouteContext = {
  params: Promise<{ orderId: string }>;
};

function mapOrderToPaymentConfirmation(order: {
  id: string;
  paidAt: Date | null;
  paymentMethod: string | null;
  paymentReference: string | null;
  paymentStatus: string;
  vehicleName: string;
}): PaymentConfirmation {
  const paymentMethod = getMockPaymentMethodValue(order.paymentMethod);

  return {
    accepted: true,
    orderId: order.id,
    paymentMethod: paymentMethod ?? undefined,
    paymentReference: order.paymentReference ?? undefined,
    paidAt: order.paidAt?.toISOString(),
    paymentStatus: getPaymentStatusValue(order.paymentStatus),
    vehicleName: order.vehicleName,
  };
}

function getValidatedPaymentBody(
  value: unknown,
  orderId: string
): {
  paymentMethod: MockPaymentMethod;
  paymentStatus: PaymentUpdatePayload["paymentStatus"];
} | null {
  if (!isRecord(value)) {
    return null;
  }

  const payloadOrderId = readString(value.orderId);
  const paymentMethodValue = readString(value.paymentMethod).toUpperCase();
  const paymentStatusValue = readString(value.paymentStatus).toUpperCase();

  if (payloadOrderId && payloadOrderId !== orderId) {
    return null;
  }

  if (
    !isMockPaymentMethod(paymentMethodValue) ||
    !isMockPaymentResultStatus(paymentStatusValue)
  ) {
    return null;
  }

  return {
    paymentMethod: paymentMethodValue,
    paymentStatus: paymentStatusValue,
  };
}

export async function POST(
  request: Request,
  { params }: PaymentRouteContext
) {
  const { orderId } = await params;
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return createApiErrorResponse(
      "INVALID_PAYMENT_REQUEST",
      "Unable to process the payment payload.",
      { status: 400 }
    );
  }

  const paymentUpdate = getValidatedPaymentBody(body, orderId);

  if (!paymentUpdate) {
    return createApiErrorResponse(
      "INVALID_PAYMENT_PAYLOAD",
      "A valid mock payment method and result are required.",
      { status: 400 }
    );
  }

  try {
    const prisma = getPrismaClient();
    const currentUserId = await getCurrentAuthUserId();
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        paidAt: true,
        paymentMethod: true,
        paymentReference: true,
        paymentStatus: true,
        userId: true,
        vehicleName: true,
      },
    });

    if (!existingOrder) {
      return createApiErrorResponse(
        "ORDER_NOT_FOUND",
        "The requested order could not be found.",
        { status: 404 }
      );
    }

    if (existingOrder.userId && !currentUserId) {
      return createApiErrorResponse(
        "PAYMENT_AUTH_REQUIRED",
        "Sign in to continue payment for this saved order.",
        { status: 401 }
      );
    }

    if (existingOrder.userId && currentUserId !== existingOrder.userId) {
      return createApiErrorResponse(
        "PAYMENT_ACCESS_DENIED",
        "You do not have permission to update this order.",
        { status: 403 }
      );
    }

    if (isTerminalPaymentStatus(existingOrder.paymentStatus)) {
      return createApiErrorResponse(
        "PAYMENT_ALREADY_FINALIZED",
        "This order has already reached a final payment state.",
        {
          details: {
            paymentStatus: getPaymentStatusValue(existingOrder.paymentStatus),
          },
          status: 409,
        }
      );
    }

    const nextReference =
      paymentUpdate.paymentStatus === "CANCELLED"
        ? existingOrder.paymentReference
        : createMockPaymentReference(orderId, paymentUpdate.paymentMethod);

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paidAt:
          paymentUpdate.paymentStatus === "PAID" ? new Date() : null,
        paymentMethod: paymentUpdate.paymentMethod,
        paymentReference: nextReference,
        paymentStatus: paymentUpdate.paymentStatus,
      },
      select: {
        id: true,
        paidAt: true,
        paymentMethod: true,
        paymentReference: true,
        paymentStatus: true,
        vehicleName: true,
      },
    });

    return createApiSuccessResponse(
      mapOrderToPaymentConfirmation(updatedOrder)
    );
  } catch {
    return createApiErrorResponse(
      "PAYMENT_UPDATE_FAILED",
      "Unable to update the mock payment right now.",
      { status: 500 }
    );
  }
}
