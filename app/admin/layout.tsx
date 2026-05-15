import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import type { AuthenticatedUser } from "@/auth";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminUnauthorized } from "@/components/admin/AdminUnauthorized";
import { PageTransition } from "@/components/shared/PageTransition";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import { getAdminPageAccess } from "@/lib/admin";

type AdminLayoutProps = {
  children: ReactNode;
};

function getDisplayName(user: AuthenticatedUser) {
  const trimmedName = user.name?.trim();

  return trimmedName || user.email || "Tesla Operator";
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, user } = await getAdminPageAccess(ROUTES.admin);

  if (!isAdmin) {
    return <AdminUnauthorized user={user} />;
  }

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-neutral-100 via-white to-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal
            as="article"
            className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
          >
            <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-neutral-500">
                  Internal Operations
                </p>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                    {getDisplayName(user)}
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                    Review live orders, mock payment activity, demo-drive
                    requests, and the persisted vehicle catalog from one
                    protected internal workspace.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-2xl border border-black/6 bg-white p-3 text-neutral-900 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Access
                    </p>
                    <p className="mt-1 text-base font-semibold text-neutral-950">
                      Admin
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-600">
                  <p>{user.email ?? "Signed in admin account available."}</p>
                  <p>
                    This area focuses on operational visibility for persisted
                    orders, checkout statuses, requests, and catalog data.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href={ROUTES.dashboard}
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                  >
                    User Dashboard
                  </ButtonLink>
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

            <div className="border-t border-black/6 px-6 py-6 sm:px-8">
              <AdminNavigation />
            </div>
          </Reveal>

          <div className="mt-8 space-y-6">{children}</div>
        </div>
      </section>
    </PageTransition>
  );
}
