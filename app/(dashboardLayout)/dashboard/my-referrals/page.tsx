import { ReferralPartnerDashboard } from "@/components/modules/referral/ReferralPartnerDashboard";
import { ReferralProgram } from "@/components/modules/referral/ReferralProgram";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServerApiError } from "@/lib/api/server-fetch";
import { referralService } from "@/services/services";
import type { IPartnerReferralDashboard } from "@/types/referral.types";

export const metadata = {
  title: "My Referral",
};

export default async function MyReferralsPage() {
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
        title="My Referral"
        description="Your referral partner dashboard — share your link and track your referrals."
      />
      <ReferralPartnerDashboard data={dashboard} />
    </div>
  );
}
