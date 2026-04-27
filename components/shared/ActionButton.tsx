import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import type { CtaButton } from "@/types";

type ActionButtonProps = {
  action: CtaButton;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function ActionButton({
  action,
  className,
  size = "default",
  variant = "default",
}: ActionButtonProps) {
  if (action.href) {
    return (
      <ButtonLink
        href={action.href}
        size={size}
        variant={variant}
        className={className}
      >
        {action.label}
      </ButtonLink>
    );
  }

  return (
    <Button type="button" size={size} variant={variant} className={className}>
      {action.label}
    </Button>
  );
}
