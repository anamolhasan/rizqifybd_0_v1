import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AffiliateProgram } from "@/components/modules/affiliate/AffiliateProgram";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("affiliateApplication.title"),
    description: t("affiliateApplication.description"),
  };
}

export default function AffiliateApplicationPage() {
  return <AffiliateProgram />;
}
