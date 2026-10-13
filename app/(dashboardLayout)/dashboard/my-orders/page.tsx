import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myOrders.title"),
    description: t("myOrders.description"),
  };
}

export default async function MyOrders() {
  const t = await getTranslations("dashboard");
  return <div>{t("placeholders.myOrders")}</div>;
}
