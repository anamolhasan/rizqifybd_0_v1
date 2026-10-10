import type { Metadata } from "next";

import { DashboardOverview } from "@/components/modules/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "RizqifyBD admin overview.",
};

export default function AdminDashboardPage() {
  return <DashboardOverview variant="staff" />;
}