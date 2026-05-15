import { ButtonLink } from "@/components/ui/button-link";

type AdminEmptyStateProps = {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  title: string;
};

export function AdminEmptyState({
  actionHref,
  actionLabel,
  description,
  title,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-[1.85rem] border border-dashed border-black/10 bg-neutral-50 p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <div className="mt-5">
          <ButtonLink
            href={actionHref}
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
          >
            {actionLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
