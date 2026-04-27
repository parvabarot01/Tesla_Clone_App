import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <header
      className={cn(
        "max-w-3xl space-y-4",
        isCentered && "mx-auto text-center"
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-7 text-neutral-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
