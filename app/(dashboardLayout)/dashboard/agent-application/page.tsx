import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AgentProgram } from "@/components/modules/agent/AgentProgram";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("agentApplication.title"),
    description: t("agentApplication.description"),
  };
}

export default function AgentApplicationPage() {
  return <AgentProgram />;
}
