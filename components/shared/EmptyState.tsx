import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

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
    <section className="flex min-h-[42svh] items-center justify-center bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
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
                className:
                  "h-11 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white hover:bg-neutral-800",
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
