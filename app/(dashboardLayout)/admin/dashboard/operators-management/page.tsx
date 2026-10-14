import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { OperatorManagement } from "@/components/modules/operators/OperatorManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminOperators.title"),
    description: t("adminOperators.description"),
  };
}

export default function OperatorsManagementPage() {
  return <OperatorManagement />;
}
