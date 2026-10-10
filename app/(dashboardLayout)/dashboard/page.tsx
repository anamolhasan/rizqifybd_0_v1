import type { Metadata } from "next";

import { DashboardOverview } from "@/components/modules/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your RizqifyBD account overview.",
};

export default function DashboardPage() {
  return <DashboardOverview variant="customer" />;
}