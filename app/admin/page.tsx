import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminOverviewData } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Tesla Clone",
  description:
    "Internal operations dashboard for orders, payments, demo drives, and vehicles.",
};

export default async function AdminPage() {
  const overview = await getAdminOverviewData();

  return <AdminShell overview={overview} />;
}
