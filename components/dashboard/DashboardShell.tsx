import { ArrowUpRight, UserRound } from "lucide-react";

import type { AuthenticatedUser } from "@/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DemoDriveHistory } from "@/components/dashboard/DemoDriveHistory";
import { DashboardOverviewCards } from "@/components/dashboard/DashboardOverviewCards";
import { OrdersHistory } from "@/components/dashboard/OrdersHistory";
import { PageTransition } from "@/components/shared/PageTransition";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import type {
  DashboardDemoDriveHistoryItem,
  DashboardOrderHistoryItem,
} from "@/lib/dashboard";

type DashboardShellProps = {
  demoDriveRequests: DashboardDemoDriveHistoryItem[];
  orders: DashboardOrderHistoryItem[];
  user: AuthenticatedUser;
};

function getDisplayName(user: AuthenticatedUser) {
  const trimmedName = user.name?.trim();

  return trimmedName || user.email || "Tesla Driver";
}

export function DashboardShell({
  demoDriveRequests,
  orders,
  user,
}: DashboardShellProps) {
  const demoDriveCount = demoDriveRequests.length;
  const displayName = getDisplayName(user);
  const ordersCount = orders.length;
  const totalSavedActivity = ordersCount + demoDriveCount;

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-neutral-100 via-white to-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Dashboard"
              title="Dashboard"
              description="View your saved activity, orders, and requests."
              align="left"
            />
          </Reveal>

          <Reveal
            delay={0.05}
            as="article"
            className="mt-8 overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
          >
            <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-neutral-500">
                  Welcome Back
                </p>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                    Keep your saved orders, demo-drive requests, and account
                    activity in one protected place.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-2xl border border-black/6 bg-white p-3 text-neutral-900 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Account
                    </p>
                    <p className="mt-1 text-base font-semibold text-neutral-950">
                      Signed in
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-600">
                  <p>{user.email ?? "Signed in account available."}</p>
                  <p>
                    {totalSavedActivity > 0
                      ? `${totalSavedActivity} saved records are available below across your orders and demo-drive requests.`
                      : "Your saved activity will appear here as you place orders and request demo drives."}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href={ROUTES.vehicles}
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                  >
                    Browse Vehicles
                  </ButtonLink>
                  <SignOutButton
                    callbackUrl={ROUTES.home}
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                  >
                    Sign Out
                  </SignOutButton>
                </div>
              </div>
            </div>
          </Reveal>

          <DashboardOverviewCards
            demoDriveCount={demoDriveCount}
            email={user.email ?? null}
            ordersCount={ordersCount}
          />

          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            <Reveal delay={0.16} className="h-full">
              <OrdersHistory orders={orders} />
            </Reveal>

            <Reveal delay={0.22} className="h-full">
              <DemoDriveHistory demoDriveRequests={demoDriveRequests} />
            </Reveal>
          </div>

          <Reveal
            delay={0.28}
            as="article"
            className="mt-6 rounded-[2rem] border border-black/6 bg-neutral-950 px-6 py-6 text-white shadow-[0_24px_54px_rgba(17,17,17,0.18)] sm:px-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/55">
                  Account
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Your activity stays connected to your account.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
                  Orders and demo-drive requests submitted while signed in will
                  continue to appear here automatically.
                </p>
              </div>

              <ButtonLink
                href={ROUTES.vehicles}
                size="lg"
                className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-[background-color,transform] duration-200 hover:bg-neutral-200 motion-safe:hover:-translate-y-px"
              >
                Explore Vehicles
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
