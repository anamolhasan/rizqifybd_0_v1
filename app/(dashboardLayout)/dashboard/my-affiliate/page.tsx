import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { AffiliateDashboard } from "@/components/modules/affiliate/AffiliateDashboard";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { loadPageData } from "@/lib/api/page-data";
import { LOGIN_ROUTE } from "@/lib/constants";
import { affiliateService } from "@/services/services";
import type {
  IAffiliateConversion,
  IAffiliateDashboard,
  IAffiliateLink,
  IEarningView,
} from "@/types/program.types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("affiliateDashboard.title"),
    description: t("affiliateDashboard.description"),
  };
}

export default async function AffiliateDashboardPage() {
  const t = await getTranslations("affiliate.dashboard");

  const dashboardState = await loadPageData<IAffiliateDashboard>(
    affiliateService.getDashboard(),
  );

  // 401: the session is gone. Send the visitor through login rather than failing.
  if (dashboardState.status === "unauthorized") {
    redirect(LOGIN_ROUTE);
  }

  // 500 (or any other failure) on the dashboard itself: report it instead of
  // letting the exception take down the route.
  if (dashboardState.status !== "ok") {
    return (
      <div className="space-y-6">
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
        <PageErrorState
          title={t("loadErrorTitle")}
          description={t("loadErrorBody")}
        />
      </div>
    );
  }

  // The links/conversions/earnings endpoints are approved-affiliate-only and
  // answer 403 until the application is approved. That is an expected state, so
  // the lists come back empty; a backend failure there is not fatal either and
  // keeps the dashboard (application status, wallet) usable.
  const [linksState, conversionsState, earningsState] = await Promise.all([
    loadPageData<IAffiliateLink[]>(affiliateService.getMyLinks({ limit: 10 })),
    loadPageData<IAffiliateConversion[]>(
      affiliateService.getMyConversions({ limit: 10 }),
    ),
    loadPageData<IEarningView[]>(affiliateService.getMyEarnings({ limit: 10 })),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <AffiliateDashboard
        dashboard={dashboardState.data}
        links={linksState.status === "ok" ? linksState.data : []}
        conversions={conversionsState.status === "ok" ? conversionsState.data : []}
        earnings={earningsState.status === "ok" ? earningsState.data : []}
      />
    </div>
  );
}
