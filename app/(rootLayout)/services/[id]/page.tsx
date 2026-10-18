import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import OperatorOfferDetails from "@/components/offers/OperatorOfferDetails";

interface OfferDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OfferDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("metadata.offers");

  // Fallback title; the details component will also show the specific offer name.
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OfferDetailsPage({ params }: OfferDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <OperatorOfferDetails offerId={id} />;
}
