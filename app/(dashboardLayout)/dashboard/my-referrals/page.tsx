import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ReferralPartnerDashboard } from "@/components/modules/referral/ReferralPartnerDashboard";
import { ReferralProgram } from "@/components/modules/referral/ReferralProgram";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServerApiError } from "@/lib/api/server-fetch";
import { referralService } from "@/services/services";
import type { IPartnerReferralDashboard } from "@/types/referral.types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myReferrals.title"),
    description: t("myReferrals.description"),
  };
}

export default async function MyReferralsPage() {
  const t = await getTranslations("referral");
  let dashboard: IPartnerReferralDashboard | null = null;

  try {
    const response = await referralService.getPartnerReferral();
    dashboard = response.data;
  } catch (error) {
    if (!(error instanceof ServerApiError && error.status === 403)) {
      throw error;
    }
  }

  if (!dashboard) {
    return <ReferralProgram />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
      />
      <ReferralPartnerDashboard data={dashboard} />
    </div>
  );
}
