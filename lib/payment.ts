import { API_ROUTES } from "@/constants/api";
import { fetchApiJson } from "@/lib/fetcher";
import type {
  MockPaymentMethod,
  MockPaymentResultStatus,
  PaymentConfirmation,
  PaymentStatus,
  PaymentUpdatePayload,
} from "@/types";

const paymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
] as const satisfies PaymentStatus[];

const mockPaymentResultStatuses = [
  "PAID",
  "FAILED",
  "CANCELLED",
] as const satisfies MockPaymentResultStatus[];

const mockPaymentMethods = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "UPI",
  "NET_BANKING",
] as const satisfies MockPaymentMethod[];

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const paymentMethodLabels: Record<MockPaymentMethod, string> = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  UPI: "UPI",
  NET_BANKING: "Net Banking",
};

function formatFallbackLabel(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const mockPaymentMethodOptions = [
  {
    value: "CREDIT_CARD",
    label: "Credit Card",
    description: "Preferred mock card flow for the fastest checkout path.",
  },
  {
    value: "DEBIT_CARD",
    label: "Debit Card",
    description: "Debit-style mock payment option for direct account checkout.",
  },
  {
    value: "UPI",
    label: "UPI",
    description: "Mock instant transfer option for lightweight mobile checkout.",
  },
  {
    value: "NET_BANKING",
    label: "Net Banking",
    description: "Mock bank portal flow for a more traditional payment path.",
  },
] as const satisfies Array<{
  description: string;
  label: string;
  value: MockPaymentMethod;
}>;

export function getPaymentStatusValue(value?: string | null): PaymentStatus {
  return paymentStatuses.includes(value as PaymentStatus)
    ? (value as PaymentStatus)
    : "PENDING";
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return paymentStatuses.includes(value as PaymentStatus);
}

export function getMockPaymentMethodValue(
  value?: string | null
): MockPaymentMethod | null {
  if (!value) {
    return null;
  }

  return mockPaymentMethods.includes(value as MockPaymentMethod)
    ? (value as MockPaymentMethod)
    : null;
}

export function isMockPaymentMethod(value: string): value is MockPaymentMethod {
  return mockPaymentMethods.includes(value as MockPaymentMethod);
}

export function isMockPaymentResultStatus(
  value: string
): value is MockPaymentResultStatus {
  return mockPaymentResultStatuses.includes(value as MockPaymentResultStatus);
}

export function formatPaymentStatus(value?: string | null) {
  const status = getPaymentStatusValue(value);

  return paymentStatusLabels[status];
}

export function formatMockPaymentMethod(value?: string | null) {
  const paymentMethod = getMockPaymentMethodValue(value);

  return paymentMethod
    ? paymentMethodLabels[paymentMethod]
    : value
      ? formatFallbackLabel(value)
      : "Not selected";
}

export function isTerminalPaymentStatus(value?: string | null) {
  const status = getPaymentStatusValue(value);

  return status === "PAID" || status === "CANCELLED";
}

export function createMockPaymentReference(
  orderId: string,
  paymentMethod: MockPaymentMethod
) {
  const methodCode = paymentMethod.split("_").map((part) => part[0]).join("");
  const orderCode = orderId.slice(0, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);

  return `MOCK-${methodCode}-${orderCode}-${timestamp}`;
}

export async function submitMockPaymentUpdate(payload: PaymentUpdatePayload) {
  return fetchApiJson<PaymentConfirmation>(API_ROUTES.orderPayment(payload.orderId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
