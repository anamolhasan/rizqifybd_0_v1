import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { ReferralDefaultSetting } from "@/components/modules/settings/ReferralDefaultSetting";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("adminSettings.title"),
    description: t("adminSettings.description"),
  };
}

export default function SettingsPage() {
  return <ReferralDefaultSetting />;
}