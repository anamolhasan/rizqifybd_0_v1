import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { RoleAccessManagement } from "@/components/modules/role-access/RoleAccessManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminRoleAccess.title"),
    description: t("adminRoleAccess.description"),
  };
}

export default function RoleAccessManagementPage() {
  return <RoleAccessManagement />;
}
