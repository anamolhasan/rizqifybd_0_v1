import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import OperatorOffersCatalogue from "@/components/offers/OperatorOffersCatalogue";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.offers");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <OperatorOffersCatalogue />
    </div>
  );
}
