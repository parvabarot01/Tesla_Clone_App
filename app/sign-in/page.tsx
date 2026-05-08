import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentAuthUser } from "@/auth";
import { PageTransition } from "@/components/shared/PageTransition";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";
import { resolveSafeAuthRedirectPath } from "@/lib/auth";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access your dashboard and account activity.",
};

function getSignInErrorMessage(error?: string) {
  switch (error) {
    case "invalid-email":
      return "Enter a valid email address to continue.";
    case "invalid-request":
      return "The sign-in request could not be processed. Try again.";
    case "sign-in-failed":
      return "Unable to sign in right now. Please try again.";
    default:
      return null;
  }
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const user = await getCurrentAuthUser();
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolveSafeAuthRedirectPath(
    resolvedSearchParams.callbackUrl
  );
  const errorMessage = getSignInErrorMessage(resolvedSearchParams.error);

  if (user) {
    redirect(callbackUrl);
  }

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-neutral-100 via-white to-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
              <div className="border-b border-black/6 px-6 py-6 sm:px-8">
                <SectionHeader
                  eyebrow="Account"
                  title="Sign in to continue"
                  description="Access your dashboard, saved orders, and demo-drive activity from one protected account area."
                  align="left"
                />
              </div>

              <div className="space-y-6 px-6 py-6 sm:px-8">
                <div className="rounded-[1.75rem] border border-black/6 bg-neutral-50 p-5 sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    Redirect Destination
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-tight text-neutral-950">
                    Dashboard
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    After signing in, you&apos;ll return to{" "}
                    <span className="font-medium text-neutral-950">
                      {callbackUrl}
                    </span>
                    .
                  </p>
                </div>

                {errorMessage ? (
                  <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-900">
                    {errorMessage}
                  </div>
                ) : null}

                <form
                  action={ROUTES.authSignIn(callbackUrl)}
                  method="post"
                  className="space-y-5"
                >
                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-neutral-950"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your name"
                        className="h-12 w-full rounded-[1.2rem] border border-black/8 bg-white px-4 text-sm text-neutral-950 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-neutral-950 focus:bg-neutral-50 focus:ring-4 focus:ring-black/6"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-neutral-950"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Enter your email"
                        className="h-12 w-full rounded-[1.2rem] border border-black/8 bg-white px-4 text-sm text-neutral-950 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-neutral-950 focus:bg-neutral-50 focus:ring-4 focus:ring-black/6"
                      />
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-neutral-600">
                    Use your email to access the protected dashboard. Orders
                    and demo-drive requests submitted while signed in will be
                    linked to this account.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-neutral-800 motion-safe:hover:-translate-y-px"
                    >
                      Sign In
                    </button>
                    <ButtonLink
                      href={ROUTES.vehicles}
                      size="lg"
                      variant="outline"
                      className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                    >
                      Browse Vehicles
                    </ButtonLink>
                  </div>
                </form>

                <div className="rounded-[1.35rem] border border-black/6 bg-neutral-50 px-4 py-4 text-sm leading-6 text-neutral-600">
                  This project uses an Auth.js-compatible user and session
                  model while keeping the current sign-in flow lightweight for
                  local development.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
