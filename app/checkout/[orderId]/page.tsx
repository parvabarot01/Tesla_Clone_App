import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight, CircleDot, Palette, ReceiptText, Sofa } from "lucide-react";

import { getCurrentAuthUser } from "@/auth";
import { MockPaymentPanel } from "@/components/checkout/MockPaymentPanel";
import { PageTransition } from "@/components/shared/PageTransition";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/order";
import { getOrderById, getOrderSelectionDetails } from "@/lib/orders";
import { formatMockPaymentMethod, formatPaymentStatus, getPaymentStatusValue } from "@/lib/payment";

type CheckoutPageProps = {
  params: Promise<{ orderId: string }>;
};

export const metadata: Metadata = {
  title: "Checkout | Tesla Clone",
  description: "Review your saved order and continue to payment.",
};

function getCheckoutGuidance(
  paymentStatus: string,
  currentUserSignedIn: boolean,
  vehicleSlug: string
) {
  switch (getPaymentStatusValue(paymentStatus)) {
    case "PAID":
      return {
        ctaHref: currentUserSignedIn ? ROUTES.dashboard : ROUTES.vehicles,
        ctaLabel: currentUserSignedIn ? "Back to Dashboard" : "Browse Vehicles",
        description:
          "This saved order is now marked as paid in the mock internal payment system. The lifecycle fields and confirmation data are stored without using a real gateway.",
        eyebrow: "Payment Complete",
        title: "Mock payment recorded successfully.",
      };
    case "FAILED":
      return {
        ctaHref: ROUTES.order(vehicleSlug),
        ctaLabel: "Review Configuration",
        description:
          "The last mock attempt failed. You can retry from this checkout page or return to the saved build before trying again.",
        eyebrow: "Retry Available",
        title: "This order can be retried.",
      };
    case "CANCELLED":
      return {
        ctaHref: ROUTES.order(vehicleSlug),
        ctaLabel: "Configure Again",
        description:
          "The mock checkout was cancelled before completion. The order remains saved, so you can revisit the build and start again later.",
        eyebrow: "Checkout Cancelled",
        title: "The payment flow has been closed.",
      };
    case "PENDING":
    default:
      return {
        ctaHref: ROUTES.order(vehicleSlug),
        ctaLabel: "Review Configuration",
        description:
          "Use the mock payment controls to move this saved order into a paid, failed, or cancelled state while keeping the rest of the product flow unchanged.",
        eyebrow: "Mock Flow",
        title: "Complete the internal mock payment when ready.",
      };
  }
}

function formatSubmittedAt(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getPaymentStatusClasses(paymentStatus: string) {
  switch (getPaymentStatusValue(paymentStatus)) {
    case "PAID":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "FAILED":
      return "border-rose-200 bg-rose-50 text-rose-900";
    case "CANCELLED":
      return "border-neutral-200 bg-neutral-100 text-neutral-700";
    case "PENDING":
    default:
      return "border-amber-200 bg-amber-50 text-amber-900";
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderId } = await params;
  const [order, currentUser] = await Promise.all([
    getOrderById(orderId),
    getCurrentAuthUser(),
  ]);

  if (!order) {
    notFound();
  }

  if (order.userId && !currentUser) {
    redirect(ROUTES.signInWithCallback(ROUTES.checkout(orderId)));
  }

  if (order.userId && currentUser?.id !== order.userId) {
    notFound();
  }

  const selectionDetails = getOrderSelectionDetails(order);
  const statusLabel = formatPaymentStatus(order.paymentStatus);
  const paymentMethodLabel = formatMockPaymentMethod(order.paymentMethod);
  const checkoutGuidance = getCheckoutGuidance(
    order.paymentStatus,
    Boolean(currentUser),
    order.vehicleSlug
  );

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-neutral-100 via-white to-neutral-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={currentUser ? ROUTES.dashboard : ROUTES.order(order.vehicleSlug)}
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
            >
              {currentUser ? "Back to Dashboard" : "Back to Order"}
            </ButtonLink>
            <ButtonLink
              href={ROUTES.order(order.vehicleSlug)}
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
            >
              Configure Again
            </ButtonLink>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start">
            <article className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
              <div className="border-b border-black/6 px-6 py-7 sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  Checkout
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  Review your saved order
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base">
                  This V0.8 checkout carries an existing order into a realistic
                  mock payment stage and records internal lifecycle updates
                  without introducing a real payment gateway.
                </p>
              </div>

              <div className="space-y-6 px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Order {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                      {order.vehicleName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Submitted {formatSubmittedAt(order.submittedAt)}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-black/8 bg-neutral-50 px-4 py-4 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${getPaymentStatusClasses(order.paymentStatus)}`}
                  >
                    {statusLabel}
                  </span>
                  <span className="inline-flex rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                    {paymentMethodLabel}
                  </span>
                  {order.paymentReference ? (
                    <span className="inline-flex rounded-full border border-black/8 bg-neutral-50 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                      {order.paymentReference}
                    </span>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-black/6 bg-neutral-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      <Palette className="h-4 w-4" />
                      Paint
                    </div>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {selectionDetails.paintLabel}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-black/6 bg-neutral-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      <CircleDot className="h-4 w-4" />
                      Wheels
                    </div>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {selectionDetails.wheelLabel}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-black/6 bg-neutral-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      <Sofa className="h-4 w-4" />
                      Interior
                    </div>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {selectionDetails.interiorLabel}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    <ReceiptText className="h-4 w-4" />
                    Payment Lifecycle
                  </div>

                  <dl className="mt-5 space-y-3 text-sm sm:text-base">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-neutral-600">Current status</dt>
                      <dd className="text-right font-semibold text-neutral-950">
                        {statusLabel}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-neutral-600">Stored payment method</dt>
                      <dd className="text-right font-semibold text-neutral-950">
                        {paymentMethodLabel}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-neutral-600">Payment reference</dt>
                      <dd className="text-right font-semibold text-neutral-950">
                        {order.paymentReference ?? "Generated after a mock payment attempt"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-neutral-600">Paid at</dt>
                      <dd className="text-right font-semibold text-neutral-950">
                        {order.paidAt ? formatSubmittedAt(order.paidAt) : "Not paid yet"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </article>

            <aside className="rounded-[2rem] border border-black/6 bg-white px-6 py-7 shadow-[0_20px_50px_rgba(17,17,17,0.08)] sm:px-8">
              <MockPaymentPanel
                currentPaymentMethod={order.paymentMethod}
                orderId={order.id}
                paymentStatus={order.paymentStatus}
              />

              <div className="mt-6 rounded-[1.6rem] border border-black/6 bg-neutral-950 px-5 py-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/55">
                  {checkoutGuidance.eyebrow}
                </p>
                <p className="mt-3 text-lg font-semibold tracking-tight">
                  {checkoutGuidance.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  {checkoutGuidance.description}
                </p>
                <div className="mt-5">
                  <ButtonLink
                    href={checkoutGuidance.ctaHref}
                    size="lg"
                    className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-[background-color,transform] duration-200 hover:bg-neutral-200 motion-safe:hover:-translate-y-px"
                  >
                    {checkoutGuidance.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
