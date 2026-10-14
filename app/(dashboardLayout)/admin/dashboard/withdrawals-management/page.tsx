import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminWithdrawals.title"),
    description: t("adminWithdrawals.description"),
  };
}

export default async function WithdrawalsManagementPage() {
  const t = await getTranslations("admin");
  return <div>{t("placeholders.withdrawals")}</div>;
}
