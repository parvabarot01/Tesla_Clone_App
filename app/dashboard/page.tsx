import type { Metadata } from "next";

import { requireAuthenticatedUser } from "@/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardData } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your saved orders and demo-drive activity.",
};

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();

  const dashboardData = await getDashboardData(user.id);

  return (
    <DashboardShell
      demoDriveRequests={dashboardData.demoDriveRequests}
      orders={dashboardData.orders}
      user={user}
    />
  );
}
