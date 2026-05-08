import {
  Activity,
  CalendarClock,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

type DashboardOverviewCardsProps = {
  demoDriveCount: number;
  email: string | null;
  ordersCount: number;
};

type DashboardOverviewCard = {
  description: string;
  icon: LucideIcon;
  title: string;
  value: string;
};

export function DashboardOverviewCards({
  demoDriveCount,
  email,
  ordersCount,
}: DashboardOverviewCardsProps) {
  const cards: DashboardOverviewCard[] = [
    {
      title: "Orders",
      value: String(ordersCount),
      description:
        ordersCount > 0
          ? "Saved orders connected to your account."
          : "Your saved vehicle orders will appear here.",
      icon: ShoppingBag,
    },
    {
      title: "Demo Drives",
      value: String(demoDriveCount),
      description:
        demoDriveCount > 0
          ? "Demo-drive requests connected to your account."
          : "Your saved demo-drive requests will appear here.",
      icon: CalendarClock,
    },
    {
      title: "Saved Activity",
      value: String(ordersCount + demoDriveCount),
      description:
        ordersCount + demoDriveCount > 0
          ? "Your account history is visible in this dashboard."
          : "Activity saved to your account will appear here.",
      icon: Activity,
    },
    {
      title: "Account",
      value: "Active",
      description:
        email ?? "This dashboard is only available while signed in.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Reveal
            key={card.title}
            delay={0.05 + index * 0.04}
            className="h-full"
          >
            <article className="flex h-full flex-col rounded-[1.75rem] border border-black/6 bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.06)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    {card.title}
                  </p>
                  <p
                    className={cn(
                      "mt-4 text-3xl font-semibold tracking-tight text-neutral-950",
                      card.title === "Account" && "text-2xl"
                    )}
                  >
                    {card.value}
                  </p>
                </div>
                <span className="inline-flex rounded-2xl border border-black/6 bg-neutral-50 p-3 text-neutral-800">
                  <Icon className="h-5 w-5" />
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-neutral-600">
                {card.description}
              </p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
