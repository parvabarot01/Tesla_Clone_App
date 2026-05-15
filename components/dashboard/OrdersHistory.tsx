import { ArrowUpRight, CircleDot, Palette, Sofa, Sparkles } from "lucide-react";

import type { DashboardOrderHistoryItem } from "@/lib/dashboard";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import { getPaymentStatusValue } from "@/lib/payment";

type OrdersHistoryProps = {
  orders: DashboardOrderHistoryItem[];
};

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

function getCheckoutActionLabel(paymentStatus: string) {
  switch (getPaymentStatusValue(paymentStatus)) {
    case "FAILED":
      return "Retry Payment";
    case "PAID":
      return "View Checkout";
    case "CANCELLED":
      return "Review Checkout";
    case "PENDING":
    default:
      return "Go to Checkout";
  }
}

export function OrdersHistory({ orders }: OrdersHistoryProps) {
  return (
    <article className="rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
      <div className="border-b border-black/6 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Orders
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              Saved orders
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
              Your account-linked configurations, pricing, and submission
              details in one place.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            {orders.length} saved
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-6 sm:px-8">
          <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-neutral-50 p-5 sm:p-6">
            <p className="text-lg font-semibold tracking-tight text-neutral-950">
              No saved orders yet
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Save a vehicle order and it will appear here with its selected
              configuration and pricing details.
            </p>
            <div className="mt-5">
              <ButtonLink
                href={ROUTES.vehicles}
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
              >
                Browse Vehicles
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-6 py-6 sm:px-8">
          {orders.map((order) => (
            <section
              key={order.id}
              className="rounded-[1.75rem] border border-black/8 bg-neutral-50 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    Order {order.shortId}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                    {order.vehicleName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Submitted {order.submittedAtFormatted}
                  </p>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${getPaymentStatusClasses(order.paymentStatus)}`}
                      >
                        {order.paymentStatusLabel}
                      </span>
                      {order.paymentMethodLabel ? (
                        <span className="inline-flex rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                          {order.paymentMethodLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/8 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    Total
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
                    {order.totalPriceFormatted}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    <Palette className="h-4 w-4" />
                    Paint
                  </div>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {order.paintLabel}
                  </p>
                </div>

                <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    <CircleDot className="h-4 w-4" />
                    Wheels
                  </div>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {order.wheelLabel}
                  </p>
                </div>

                <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    <Sofa className="h-4 w-4" />
                    Interior
                  </div>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {order.interiorLabel}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  <span className="inline-flex rounded-full border border-black/8 bg-white px-3 py-1">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Account linked
                  </span>
                  <span className="inline-flex rounded-full border border-black/8 bg-white px-3 py-1 font-mono tracking-[0.14em]">
                    {order.shortId}
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href={ROUTES.checkout(order.id)}
                    size="lg"
                    className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                  >
                    {getCheckoutActionLabel(order.paymentStatus)}
                    <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink
                    href={ROUTES.order(order.vehicleSlug)}
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                  >
                    Configure Again
                    <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
