import type { Metadata } from "next";

import { CategoryManagement } from "@/components/modules/categories/CategoryManagement";

export const metadata: Metadata = {
  title: "Categories Management",
  description: "Manage RizqifyBD product categories.",
};

export default function CategoriesManagementPage() {
  return <CategoryManagement />;
}
