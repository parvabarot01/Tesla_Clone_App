import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ROUTES } from "@/constants/routes";
import { getAdminOrdersViewData } from "@/lib/admin";
import { getPaymentStatusValue } from "@/lib/payment";

export const metadata: Metadata = {
  title: "Admin Orders | Tesla Clone",
  description: "Review persisted customer orders and mock payment status activity.",
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

export default async function AdminOrdersPage() {
  const orders = await getAdminOrdersViewData();

  return (
    <>
      <Reveal className="max-w-3xl">
        <AdminSectionHeader
          eyebrow="Admin Orders"
          title="Orders"
          description="Inspect saved orders, customer identity, pricing, and mock payment status from the live database."
          badge={`${orders.length} total`}
        />
      </Reveal>

      <Reveal
        delay={0.06}
        as="article"
        className="rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
      >
        {orders.length === 0 ? (
          <div className="px-6 py-6 sm:px-8">
            <AdminEmptyState
              title="No orders available yet"
              description="Saved customer orders will appear here once the public ordering flow creates persisted records."
              actionHref={ROUTES.vehicles}
              actionLabel="Browse Vehicles"
            />
          </div>
        ) : (
          <div className="space-y-4 px-6 py-6 sm:px-8">
            {orders.map((order) => (
              <section
                key={order.id}
                className="rounded-[1.75rem] border border-black/8 bg-neutral-50 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Order {order.shortId}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                      {order.vehicleName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Submitted {order.submittedAtFormatted}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
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

                  <div className="rounded-[1.4rem] border border-black/8 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Total
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
                      {order.totalPriceFormatted}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Customer
                    </p>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {order.customerLabel}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      {order.customerSecondaryLabel}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Payment
                    </p>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {order.paymentMethodLabel ?? "Not selected"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      {order.paymentReference ?? "Reference pending"}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Record
                    </p>
                    <p className="mt-3 font-mono text-sm font-semibold text-neutral-950">
                      {order.id}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Persisted order ID
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Submitted
                    </p>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {order.submittedAtFormatted}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Newest orders appear first
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </Reveal>
    </>
  );
}
