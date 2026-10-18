import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { OrderManagement } from "@/components/modules/orders/OrderManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminOrders.title"),
    description: t("adminOrders.description"),
  };
}

export default function OrderManagementPage() {
  return <OrderManagement />;
}
