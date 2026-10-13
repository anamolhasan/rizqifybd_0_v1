import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { DashboardOverview } from "@/components/modules/dashboard/DashboardOverview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("dashboard.title"),
    description: t("dashboard.description"),
  };
}

export default function DashboardPage() {
  return <DashboardOverview variant="customer" />;
}