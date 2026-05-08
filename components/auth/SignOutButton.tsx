import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  callbackUrl?: string;
  children?: ReactNode;
  className?: string;
  size?: "default" | "xs" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
};

export function SignOutButton({
  callbackUrl = ROUTES.home,
  children = "Sign Out",
  className,
  size = "lg",
  variant = "outline",
}: SignOutButtonProps) {
  return (
    <form action={ROUTES.authSignOut(callbackUrl)} method="post">
      <button
        type="submit"
        className={cn(buttonVariants({ className, size, variant }))}
      >
        {children}
      </button>
    </form>
  );
}
