import { getCurrentAuthUser } from "@/auth";
import { NavbarClient } from "@/components/layout/NavbarClient";
import { ROUTES } from "@/constants/routes";
import { isAdminUser } from "@/lib/admin";

export async function Navbar() {
  const user = await getCurrentAuthUser();
  const authenticated = Boolean(user);

  return (
    <NavbarClient
      accountHref={
        authenticated
          ? ROUTES.dashboard
          : ROUTES.signInWithCallback(ROUTES.dashboard)
      }
      accountLabel={authenticated ? "Dashboard" : "Sign In"}
      adminHref={isAdminUser(user) ? ROUTES.admin : undefined}
      authenticated={authenticated}
    />
  );
}
