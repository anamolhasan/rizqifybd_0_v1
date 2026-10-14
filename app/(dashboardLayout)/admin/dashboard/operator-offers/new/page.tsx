import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { AddOperatorOfferForm } from "@/components/modules/operator-offers/AddOperatorOfferForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminAddOperatorOffer.title"),
    description: t("adminAddOperatorOffer.description"),
  };
}

export default function AddOperatorOfferPage() {
  return <AddOperatorOfferForm />;
}
