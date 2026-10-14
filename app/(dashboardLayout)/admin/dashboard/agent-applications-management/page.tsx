import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminAgentApplications.title"),
    description: t("adminAgentApplications.description"),
  };
}

export default async function AgentApplicationsManagementPage() {
  const t = await getTranslations("admin");
  return <div>{t("placeholders.agentApplications")}</div>;
}
