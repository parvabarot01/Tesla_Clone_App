"use client";

import Link from "next/link";
import { CalendarClock, CarFront, LayoutDashboard, ReceiptText } from "lucide-react";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const adminNavigationItems = [
  {
    label: "Overview",
    href: ROUTES.admin,
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: ROUTES.adminOrders,
    icon: ReceiptText,
  },
  {
    label: "Demo Drives",
    href: ROUTES.adminDemoDrives,
    icon: CalendarClock,
  },
  {
    label: "Vehicles",
    href: ROUTES.adminVehicles,
    icon: CarFront,
  },
] as const;

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex flex-wrap gap-3">
      {adminNavigationItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 motion-safe:hover:-translate-y-px",
              isActive
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-black/10 bg-white text-neutral-700 hover:border-black/20 hover:bg-neutral-50 hover:text-neutral-950"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
