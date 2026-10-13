import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ReferralProgram } from "@/components/modules/referral/ReferralProgram";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("referral.title"),
    description: t("referral.description"),
  };
}

export default function ReferralPage() {
  return <ReferralProgram />;
}
