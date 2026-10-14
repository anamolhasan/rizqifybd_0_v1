import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { DashboardOverview } from "@/components/modules/dashboard/DashboardOverview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminDashboard.title"),
    description: t("adminDashboard.description"),
  };
}

export default function AdminDashboardPage() {
  return <DashboardOverview variant="staff" />;
}