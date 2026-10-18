import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AgentApplicationsManagement } from "@/components/modules/agent-applications/AgentApplicationsManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminAgentApplications.title"),
    description: t("adminAgentApplications.description"),
  };
}

export default function AgentApplicationsManagementPage() {
  return <AgentApplicationsManagement />;
}
