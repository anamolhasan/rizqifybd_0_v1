import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AffiliateApplicationsManagement } from "@/components/modules/affiliate-applications/AffiliateApplicationsManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminAffiliateApplications.title"),
    description: t("adminAffiliateApplications.description"),
  };
}

export default function AffiliateApplicationsManagementPage() {
  return <AffiliateApplicationsManagement />;
}
