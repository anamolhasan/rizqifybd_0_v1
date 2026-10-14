import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { OperatorOfferManagement } from "@/components/modules/operator-offers/OperatorOfferManagement";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminOperatorOffers.title"),
    description: t("adminOperatorOffers.description"),
  };
}

export default function OperatorOffersManagementPage() {
  return <OperatorOfferManagement />;
}
