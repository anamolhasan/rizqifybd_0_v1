import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PaymentCancel } from "@/components/modules/payment/PaymentCancel";

interface PaymentCancelPageProps {
  searchParams: Promise<{ order_id?: string | string[] }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.paymentCancel");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const params = await searchParams;
  const rawOrderId = params.order_id;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  return <PaymentCancel orderId={orderId ?? null} />;
}
