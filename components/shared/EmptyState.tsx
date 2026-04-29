import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <section className="flex min-h-[46svh] items-center justify-center bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
            {description}
          </p>
        ) : null}
        {actionLabel && actionHref ? (
          <div className="mt-7 flex justify-center">
            <Link
              href={actionHref}
              className={buttonVariants({
                size: "lg",
                className: cn(
                  "h-11 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-neutral-800 motion-safe:hover:-translate-y-px"
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
