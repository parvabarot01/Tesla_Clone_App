type AdminSectionHeaderProps = {
  badge?: string;
  description: string;
  eyebrow?: string;
  title: string;
};

export function AdminSectionHeader({
  badge,
  description,
  eyebrow = "Admin",
  title,
}: AdminSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm leading-7 text-neutral-600 sm:text-base">
          {description}
        </p>
      </div>

      {badge ? (
        <span className="inline-flex w-fit rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
          {badge}
        </span>
      ) : null}
    </header>
  );
}
