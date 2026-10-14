import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminWallet.title"),
    description: t("adminWallet.description"),
  };
}

export default async function WalletManagementPage() {
  const t = await getTranslations("admin");
  return <div>{t("placeholders.wallet")}</div>;
}
