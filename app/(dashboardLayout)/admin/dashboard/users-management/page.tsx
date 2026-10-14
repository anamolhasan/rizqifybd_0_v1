import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { UserManagement } from "@/components/modules/users/UserManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminUsers.title"),
    description: t("adminUsers.description"),
  };
}

export default function UsersManagementPage() {
  return <UserManagement />;
}