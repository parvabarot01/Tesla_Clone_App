"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiRequestError } from "@/lib/fetcher";
import {
  formatMockPaymentMethod,
  formatPaymentStatus,
  getPaymentStatusValue,
  isTerminalPaymentStatus,
  mockPaymentMethodOptions,
  submitMockPaymentUpdate,
} from "@/lib/payment";
import { cn } from "@/lib/utils";
import type {
  MockPaymentMethod,
  MockPaymentResultStatus,
  PaymentConfirmation,
} from "@/types";

type MockPaymentPanelProps = {
  currentPaymentMethod?: string | null;
  orderId: string;
  paymentStatus: string;
};

type PaymentFeedbackState =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { confirmation: PaymentConfirmation; kind: "success" };

const paymentMethodIcons = {
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: Wallet,
  UPI: Smartphone,
  NET_BANKING: Landmark,
} as const;

function getInitialPaymentMethod(
  currentPaymentMethod?: string | null
): MockPaymentMethod {
  return mockPaymentMethodOptions.some(
    (option) => option.value === currentPaymentMethod
  )
    ? (currentPaymentMethod as MockPaymentMethod)
    : mockPaymentMethodOptions[0].value;
}

function getPanelTitle(paymentStatus: string) {
  switch (getPaymentStatusValue(paymentStatus)) {
    case "PAID":
      return "Mock payment complete";
    case "CANCELLED":
      return "Mock checkout cancelled";
    case "FAILED":
      return "Retry mock payment";
    case "PENDING":
    default:
      return "Mock payment selection";
  }
}

export function MockPaymentPanel({
  currentPaymentMethod,
  orderId,
  paymentStatus,
}: MockPaymentPanelProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [selectedMethod, setSelectedMethod] = useState<MockPaymentMethod>(() =>
    getInitialPaymentMethod(currentPaymentMethod)
  );
  const [feedback, setFeedback] = useState<PaymentFeedbackState>({
    kind: "idle",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentLocked = isTerminalPaymentStatus(paymentStatus);
  const paymentStatusLabel = formatPaymentStatus(paymentStatus);
  const isBusy = isSubmitting || isRefreshing;

  async function handleMockPayment(nextStatus: MockPaymentResultStatus) {
    setIsSubmitting(true);
    setFeedback({ kind: "idle" });

    try {
      const confirmation = await submitMockPaymentUpdate({
        orderId,
        paymentMethod: selectedMethod,
        paymentStatus: nextStatus,
      });

      setFeedback({
        kind: "success",
        confirmation,
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setFeedback({
        kind: "error",
        message:
          error instanceof ApiRequestError
            ? error.message
            : "Unable to process the mock payment right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusTone =
    feedback.kind === "success"
      ? getPaymentStatusValue(feedback.confirmation.paymentStatus)
      : null;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-neutral-500">
          Payment Method
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {getPanelTitle(paymentStatus)}
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
          {paymentLocked
            ? `This order is already in a final mock payment state: ${paymentStatusLabel}.`
            : paymentStatus === "FAILED"
              ? "The previous mock payment attempt failed. Choose a method and retry, or cancel the checkout."
              : "Choose a mock payment method to update the saved order with a realistic internal payment result."}
        </p>
      </div>

      <div className="grid gap-3">
        {mockPaymentMethodOptions.map((method) => {
          const Icon = paymentMethodIcons[method.value];
          const isSelected = selectedMethod === method.value;

          return (
            <label
              key={method.value}
              className={cn(
                "flex items-start gap-4 rounded-[1.5rem] border px-4 py-4 transition-[border-color,background-color,transform,box-shadow] duration-200",
                paymentLocked || isBusy ? "cursor-not-allowed opacity-75" : "cursor-pointer",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_20px_40px_rgba(17,17,17,0.18)]"
                  : "border-black/8 bg-white text-neutral-950 hover:border-black/14 hover:bg-neutral-50 motion-safe:hover:-translate-y-px"
              )}
            >
              <input
                type="radio"
                name="mock-payment-method"
                value={method.value}
                checked={isSelected}
                onChange={() => setSelectedMethod(method.value)}
                disabled={paymentLocked || isBusy}
                className="mt-1 h-4 w-4 border-neutral-300 text-neutral-950 focus:ring-neutral-300"
              />

              <span className="flex min-w-0 flex-1 items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border",
                    isSelected
                      ? "border-white/12 bg-white/10"
                      : "border-black/6 bg-neutral-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isSelected ? "text-white" : "text-neutral-700"
                    )}
                  />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-semibold sm:text-base">
                    {method.label}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-sm leading-6",
                      isSelected ? "text-white/72" : "text-neutral-600"
                    )}
                  >
                    {method.description}
                  </span>
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="rounded-[1.6rem] border border-dashed border-black/10 bg-neutral-50 p-5">
        <p className="text-sm font-semibold text-neutral-950">
          Selected method:{" "}
          <span className="text-neutral-600">
            {
              mockPaymentMethodOptions.find(
                (option) => option.value === selectedMethod
              )?.label
            }
          </span>
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Phase 2 stores the chosen method, payment result, mock reference, and
          paid timestamp directly on the saved order.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            disabled={paymentLocked || isBusy}
            onClick={() => handleMockPayment("PAID")}
            className="h-11 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
          >
            {isBusy ? "Processing..." : paymentLocked ? "Mock Payment Locked" : "Complete Mock Payment"}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={paymentLocked || isBusy}
            onClick={() => handleMockPayment("FAILED")}
            className="h-11 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
          >
            Simulate Failure
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          disabled={paymentLocked || isBusy}
          onClick={() => handleMockPayment("CANCELLED")}
          className="mt-3 h-10 rounded-full px-4 text-sm font-semibold text-neutral-600 transition-transform duration-200 hover:text-neutral-950 motion-safe:hover:-translate-y-px"
        >
          Cancel Mock Checkout
        </Button>

        {feedback.kind === "success" ? (
          <div
            className={cn(
              "mt-4 rounded-[1.25rem] border px-4 py-3 text-sm leading-6",
              statusTone === "PAID"
                ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                : statusTone === "FAILED"
                  ? "border-rose-200 bg-rose-50 text-rose-950"
                  : "border-neutral-200 bg-neutral-100 text-neutral-800"
            )}
          >
            <p className="font-semibold">
              {formatPaymentStatus(feedback.confirmation.paymentStatus)} recorded
              for this order.
            </p>
            <p className="mt-1">
              Order: {feedback.confirmation.orderId}.
            </p>
            <p className="mt-1">
              Vehicle: {feedback.confirmation.vehicleName}.
            </p>
            <p className="mt-1">
              Status: {formatPaymentStatus(feedback.confirmation.paymentStatus)}.
            </p>
            <p className="mt-1">
              Method: {formatMockPaymentMethod(feedback.confirmation.paymentMethod)}.
            </p>
            {feedback.confirmation.paymentReference ? (
              <p className="mt-1">
                Reference: {feedback.confirmation.paymentReference}.
              </p>
            ) : null}
            {feedback.confirmation.paidAt ? (
              <p className="mt-1">
                Paid at: {new Date(feedback.confirmation.paidAt).toLocaleString()}.
              </p>
            ) : null}
          </div>
        ) : null}

        {feedback.kind === "error" ? (
          <p className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950">
            {feedback.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
