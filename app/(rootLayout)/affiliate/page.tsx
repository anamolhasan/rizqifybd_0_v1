import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AffiliateProgram } from "@/components/modules/affiliate/AffiliateProgram";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.affiliateApplication");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AffiliateProgrammePage() {
  return <AffiliateProgram />;
}
