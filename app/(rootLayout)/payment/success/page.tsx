import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PaymentSuccess } from "@/components/modules/payment/PaymentSuccess";

interface PaymentSuccessPageProps {
  searchParams: Promise<{ session_id?: string | string[] }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.paymentSuccess");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const rawSessionId = params.session_id;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  return <PaymentSuccess sessionId={sessionId ?? null} />;
}
