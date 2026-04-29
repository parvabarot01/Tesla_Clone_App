import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InfoCardProps = {
  children?: ReactNode;
  className?: string;
  description: string;
  eyebrow?: string;
  title: string;
};

export function InfoCard({
  children,
  className,
  description,
  eyebrow,
  title,
}: InfoCardProps) {
  return (
    <article
      className={cn(
        "rounded-[2rem] border border-black/6 bg-neutral-50 p-6 shadow-[0_16px_40px_rgba(17,17,17,0.06)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-px motion-safe:hover:shadow-[0_20px_44px_rgba(17,17,17,0.08)] sm:p-8",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
        {description}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}
