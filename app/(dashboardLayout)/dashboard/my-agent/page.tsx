import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { AgentDashboard } from "@/components/modules/agent/AgentDashboard";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { loadPageData } from "@/lib/api/page-data";
import { LOGIN_ROUTE } from "@/lib/constants";
import { agentService } from "@/services/services";
import type {
  IAgentDashboard,
  IAgentSale,
  IEarningView,
} from "@/types/program.types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("agentDashboard.title"),
    description: t("agentDashboard.description"),
  };
}

export default async function AgentDashboardPage() {
  const t = await getTranslations("agent.dashboard");

  const dashboardState = await loadPageData<IAgentDashboard>(
    agentService.getDashboard(),
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

  // The sales/earnings endpoints are approved-agent-only and answer 403 until the
  // application is approved. That is an expected state, so the lists come back
  // empty; a backend failure there is not fatal either and keeps the dashboard
  // (application status, wallet) usable.
  const [salesState, earningsState] = await Promise.all([
    loadPageData<IAgentSale[]>(agentService.getMySales({ limit: 10 })),
    loadPageData<IEarningView[]>(agentService.getMyEarnings({ limit: 10 })),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <AgentDashboard
        dashboard={dashboardState.data}
        sales={salesState.status === "ok" ? salesState.data : []}
        earnings={earningsState.status === "ok" ? earningsState.data : []}
      />
    </div>
  );
}
