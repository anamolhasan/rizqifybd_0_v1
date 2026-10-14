import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminOrders.title"),
    description: t("adminOrders.description"),
  };
}

export default async function OrderManagementPage() {
  const t = await getTranslations("admin");
  return <div>{t("placeholders.orders")}</div>;
}
