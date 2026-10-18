import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { MyOrdersList } from "@/components/modules/orders/MyOrdersList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myOrders.title"),
    description: t("myOrders.description"),
  };
}

export default function MyOrders() {
  return <MyOrdersList />;
}
