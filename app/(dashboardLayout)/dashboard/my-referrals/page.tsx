import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { EarningsHistoryPanel } from "@/components/modules/programs/EarningsHistoryPanel";
import { ReferralMilestoneCard } from "@/components/modules/referral/ReferralMilestoneCard";
import { ReferralPartnerDashboard } from "@/components/modules/referral/ReferralPartnerDashboard";
import { ReferralProgram } from "@/components/modules/referral/ReferralProgram";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { loadPageData } from "@/lib/api/page-data";
import { LOGIN_ROUTE } from "@/lib/constants";
import { referralService } from "@/services/services";
import type { IEarningView, IReferralMilestone } from "@/types/program.types";
import type { IPartnerReferralDashboard } from "@/types/referral.types";

const PANEL_CONTAINER =
  "mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myReferrals.title"),
    description: t("myReferrals.description"),
  };
}

export default async function MyReferralsPage() {
  const t = await getTranslations("referral");
  const td = await getTranslations("referral.dashboard");
  const te = await getTranslations("enums");

  // The dashboard is readable by any authenticated account and reports the
  // caller's own application status; the milestone and the earning history are
  // separate reads, so a failure in one is never reported as a failure of another.
  const [partnerState, milestoneState, earningsState] = await Promise.all([
    loadPageData<IPartnerReferralDashboard>(
      referralService.getPartnerReferral(),
    ),
    loadPageData<IReferralMilestone>(referralService.getMilestone()),
    loadPageData<IEarningView[]>(referralService.getEarnings({ limit: 10 })),
  ]);

  if (
    partnerState.status === "unauthorized" ||
    milestoneState.status === "unauthorized" ||
    earningsState.status === "unauthorized"
  ) {
    redirect(LOGIN_ROUTE);
  }

  const dashboard = partnerState.status === "ok" ? partnerState.data : null;
  const milestone = milestoneState.status === "ok" ? milestoneState.data : null;
  const earnings = earningsState.status === "ok" ? earningsState.data : [];

  // "Not an approved referral partner yet" is a normal 200 response whose
  // applicationStatus is not APPROVED — never an HTTP error.
  const isPartner = dashboard?.applicationStatus === "APPROVED";

  const errorState = (
    <PageErrorState
      title={td("loadErrorTitle")}
      description={td("loadErrorBody")}
    />
  );

  const earningsPanel = (
    <EarningsHistoryPanel
      earnings={earnings}
      title={td("earningsHistoryTitle")}
      emptyTitle={td("noEarningsTitle")}
      emptyBody={td("noEarningsBody")}
      labels={{
        date: td("earningsColumns.date"),
        amount: td("earningsColumns.amount"),
        status: td("earningsColumns.status"),
        description: td("earningsColumns.description"),
        reference: td("earningsColumns.reference"),
        statusLabels: {
          PENDING: te("earningStatus.PENDING"),
          AVAILABLE: te("earningStatus.AVAILABLE"),
          REVERSED: te("earningStatus.REVERSED"),
        },
      }}
    />
  );

  // Not an approved partner yet, or the partner dashboard could not be read (500).
  if (!dashboard || !isPartner) {
    const partnerFailed = partnerState.status === "error";
    // The milestone and earning history are separate reads: a failure there must
    // not be hidden, but it must not repeat the partner-dashboard failure either.
    const dataFailed =
      milestoneState.status === "error" || earningsState.status === "error";
    const showPanel = Boolean(milestone) || (dataFailed && !partnerFailed);

    return (
      <>
        {partnerFailed ? (
          // The application form is deliberately NOT shown here: telling an
          // existing partner to apply because the API failed would be misleading.
          <div className={PANEL_CONTAINER}>{errorState}</div>
        ) : (
          <ReferralProgram />
        )}
        {showPanel ? (
          <div className={PANEL_CONTAINER}>
            {milestone ? <ReferralMilestoneCard milestone={milestone} /> : null}
            {dataFailed && !partnerFailed ? errorState : earningsPanel}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <ReferralPartnerDashboard data={dashboard} />
      {milestone ? <ReferralMilestoneCard milestone={milestone} /> : null}
      {milestoneState.status === "error" || earningsState.status === "error"
        ? errorState
        : earningsPanel}
    </div>
  );
}
