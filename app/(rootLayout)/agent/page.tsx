import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AgentProgram } from "@/components/modules/agent/AgentProgram";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.agentApplication");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AgentProgrammePage() {
  return <AgentProgram />;
}
