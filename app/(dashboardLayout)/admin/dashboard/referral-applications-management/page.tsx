import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { ReferralApplicationsManagement } from "@/components/modules/referral-applications/ReferralApplicationsManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminReferralApplications.title"),
    description: t("adminReferralApplications.description"),
  };
}

export default function ReferralApplicationsManagementPage() {
  return <ReferralApplicationsManagement />;
}
