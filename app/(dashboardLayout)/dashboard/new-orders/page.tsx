import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import OperatorOffersCatalogue from "@/components/offers/OperatorOffersCatalogue";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("newOrders.title"),
    description: t("newOrders.description"),
  };
}

export default function NewOrdersPage() {
  return <OperatorOffersCatalogue />;
}
