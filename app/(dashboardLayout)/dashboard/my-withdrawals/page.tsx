import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myWithdrawals.title"),
    description: t("myWithdrawals.description"),
  };
}

export default async function MyWithdrawals() {
  const t = await getTranslations("dashboard");
  return <div>{t("placeholders.myWithdrawals")}</div>;
}
