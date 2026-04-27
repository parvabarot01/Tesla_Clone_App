import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaGroupProps = {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tertiaryLabel?: string;
  tertiaryHref?: string;
  align?: "left" | "center";
};

type CtaItem = {
  href: string;
  label: string;
  variant: "primary" | "outline";
};

type OptionalCtaItem = {
  href?: string;
  label?: string;
  variant: "primary" | "outline";
};

function hasCta(item: OptionalCtaItem): item is CtaItem {
  return Boolean(item.label && item.href);
}

export function CtaGroup({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  tertiaryLabel,
  tertiaryHref,
  align = "center",
}: CtaGroupProps) {
  const optionalItems: OptionalCtaItem[] = [
    { label: primaryLabel, href: primaryHref, variant: "primary" },
    { label: secondaryLabel, href: secondaryHref, variant: "outline" },
    { label: tertiaryLabel, href: tertiaryHref, variant: "outline" },
  ];
  const items = optionalItems.filter(hasCta);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
        align === "center" ? "sm:justify-center" : "sm:justify-start"
      )}
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={buttonVariants({
            size: "lg",
            variant: item.variant === "outline" ? "outline" : "default",
            className: cn(
              "h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 motion-safe:hover:-translate-y-px",
              item.variant === "primary"
                ? "bg-neutral-950 text-white hover:bg-neutral-800"
                : "border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-100"
            ),
          })}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
