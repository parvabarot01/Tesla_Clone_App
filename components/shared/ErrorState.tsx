import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again or return to a previous page.",
  actionLabel,
  actionHref,
}: ErrorStateProps) {
  return (
    <section className="flex min-h-[46svh] items-center justify-center bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
          {description}
        </p>
        {actionLabel && actionHref ? (
          <div className="mt-7 flex justify-center">
            <Link
              href={actionHref}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: cn(
                  "h-11 rounded-full border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-950 transition-[background-color,border-color,transform] duration-200 hover:bg-neutral-100 motion-safe:hover:-translate-y-px"
                ),
              })}
            >
              {actionLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
