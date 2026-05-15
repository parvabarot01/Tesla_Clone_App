import { ShieldAlert } from "lucide-react";

import type { AuthenticatedUser } from "@/auth";
import { PageTransition } from "@/components/shared/PageTransition";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";

type AdminUnauthorizedProps = {
  user: AuthenticatedUser;
};

export function AdminUnauthorized({ user }: AdminUnauthorizedProps) {
  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-neutral-100 via-white to-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="inline-flex rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                <ShieldAlert className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Admin Access
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                This account does not have admin access.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                You are signed in, but your account is currently assigned the{" "}
                <span className="font-semibold text-neutral-950">
                  {user.role}
                </span>{" "}
                role. Ask an administrator to update your role to{" "}
                <span className="font-semibold text-neutral-950">ADMIN</span>{" "}
                before using the internal operations area.
              </p>

              <div className="mt-6 rounded-[1.6rem] border border-black/6 bg-neutral-50 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                  Signed in as
                </p>
                <p className="mt-2 text-sm font-semibold text-neutral-950">
                  {user.email ?? user.name ?? "Authenticated account"}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={ROUTES.dashboard}
                  size="lg"
                  className="h-11 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
                >
                  Back to Dashboard
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
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
