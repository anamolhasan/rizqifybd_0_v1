import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myWallet.title"),
    description: t("myWallet.description"),
  };
}

export default async function MyWalletPage() {
  const t = await getTranslations("dashboard");
  return <div>{t("placeholders.myWallet")}</div>;
}
