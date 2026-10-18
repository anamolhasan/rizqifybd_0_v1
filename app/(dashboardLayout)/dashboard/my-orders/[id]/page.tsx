import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { OrderResult } from "@/components/modules/orders/OrderResult";

interface OrderResultPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.orderResult");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OrderResultPage({
  params,
}: OrderResultPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <OrderResult orderId={id} />;
}
