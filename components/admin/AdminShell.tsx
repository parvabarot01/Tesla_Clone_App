import {
  ArrowUpRight,
  CalendarClock,
  CarFront,
  CreditCard,
  ReceiptText,
} from "lucide-react";

import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import type { AdminOverviewData } from "@/lib/admin";

type AdminShellProps = {
  overview: AdminOverviewData;
};

const adminAreas = [
  {
    title: "Orders",
    description:
      "Review real customer orders, saved configurations, and newest operational activity.",
    icon: ReceiptText,
    href: ROUTES.adminOrders,
    valueKey: "orderCount",
  },
  {
    title: "Pending Payments",
    description:
      "Track saved orders that are still waiting for mock checkout completion and follow-up.",
    icon: CreditCard,
    href: ROUTES.adminOrders,
    valueKey: "pendingPaymentCount",
  },
  {
    title: "Demo Drives",
    description:
      "Inspect request timing, submitted locations, and customer scheduling details in one view.",
    icon: CalendarClock,
    href: ROUTES.adminDemoDrives,
    valueKey: "demoDriveRequestCount",
  },
  {
    title: "Vehicles",
    description:
      "Check the persisted catalog, pricing foundation, categories, and live vehicle slugs.",
    icon: CarFront,
    href: ROUTES.adminVehicles,
    valueKey: "vehicleCount",
  },
] as const satisfies Array<{
  description: string;
  href: string;
  icon: typeof ReceiptText;
  title: string;
  valueKey: keyof AdminOverviewData;
}>;

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function AdminShell({ overview }: AdminShellProps) {
  return (
    <>
      <Reveal className="max-w-3xl">
        <AdminSectionHeader
          title="Admin Dashboard"
          description="Manage vehicles, orders, payments, and requests."
          badge="Phase 4"
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {adminAreas.map(({ description, href, icon: Icon, title, valueKey }, index) => (
          <Reveal
            key={title}
            delay={0.08 + index * 0.04}
            as="article"
            className="rounded-[1.85rem] border border-black/6 bg-white p-6 shadow-[0_18px_42px_rgba(17,17,17,0.06)]"
          >
            <div className="inline-flex rounded-2xl border border-black/6 bg-neutral-50 p-3 text-neutral-900">
              <Icon className="h-5 w-5" />
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                  Live Data
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {title}
                </h2>
              </div>
              <span className="text-3xl font-semibold tracking-tight text-neutral-950">
                {formatCount(overview[valueKey])}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
              {description}
            </p>

            <div className="mt-5">
              <ButtonLink
                href={href}
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
              >
                Open Section
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal
        delay={0.24}
        as="article"
        className="rounded-[2rem] border border-black/6 bg-neutral-950 px-6 py-6 text-white shadow-[0_24px_54px_rgba(17,17,17,0.18)] sm:px-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/55">
              Internal Visibility
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Core persisted business data is now visible to admins.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
              Orders, mock payment states, demo-drive requests, and the live
              vehicle catalog are now accessible from this protected operations
              layer without changing the public browsing experience.
            </p>
          </div>

          <ButtonLink
            href={ROUTES.adminOrders}
            size="lg"
            className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-[background-color,transform] duration-200 hover:bg-neutral-200 motion-safe:hover:-translate-y-px"
          >
            Review Orders
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Reveal>
    </>
  );
}
