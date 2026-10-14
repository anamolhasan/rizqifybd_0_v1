import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { CategoryManagement } from "@/components/modules/categories/CategoryManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminCategories.title"),
    description: t("adminCategories.description"),
  };
}

export default function CategoriesManagementPage() {
  return <CategoryManagement />;
}
