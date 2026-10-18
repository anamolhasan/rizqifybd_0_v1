import Link from "next/link";
import { ArrowRight, Plus, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { ReferralPartnerBadge } from "@/components/modules/referral/ReferralPartnerBadge";
import { AgentBadge } from "@/components/modules/agent/AgentBadge";
import { AffiliateBadge } from "@/components/modules/affiliate/AffiliateBadge";
import { ReferralLinkCard } from "@/components/modules/referral/ReferralLinkCard";
import { OverviewActivityPanel } from "./OverviewActivityPanel";
import {
  OverviewModuleAccessPanel,
  type OverviewModule,
} from "./OverviewModuleAccessPanel";

export type DashboardOverviewVariant = "staff" | "customer";

interface OverviewStat {
  title: string;
  iconName: string;
  description: string;
}

interface OverviewConfig {
  heading: string;
  description: string;
  action: { label: string; href: string };
  stats: OverviewStat[];
  modules: OverviewModule[];
}

type Translator = (key: string) => string;

function buildStaffConfig(t: Translator): OverviewConfig {
  return {
    heading: t("heading"),
    description: t("description"),
    action: {
      label: t("action"),
      href: "/admin/dashboard/orders-management",
    },
    stats: [
      {
        title: t("stats.users.title"),
        iconName: "users",
        description: t("stats.users.description"),
      },
      {
        title: t("stats.orders.title"),
        iconName: "orders",
        description: t("stats.orders.description"),
      },
      {
        title: t("stats.products.title"),
        iconName: "products",
        description: t("stats.products.description"),
      },
      {
        title: t("stats.withdrawals.title"),
        iconName: "withdrawals",
        description: t("stats.withdrawals.description"),
      },
    ],
    modules: [
      {
        title: t("modules.users.title"),
        description: t("modules.users.description"),
        iconName: "users",
      },
      {
        title: t("modules.orders.title"),
        description: t("modules.orders.description"),
        iconName: "orders",
      },
      {
        title: t("modules.products.title"),
        description: t("modules.products.description"),
        iconName: "products",
      },
      {
        title: t("modules.operators.title"),
        description: t("modules.operators.description"),
        iconName: "operators",
      },
      {
        title: t("modules.withdrawals.title"),
        description: t("modules.withdrawals.description"),
        iconName: "withdrawals",
      },
      {
        title: t("modules.referrals.title"),
        description: t("modules.referrals.description"),
        iconName: "referrals",
      },
    ],
  };
}

const ACTION_ICON: Record<DashboardOverviewVariant, LucideIcon> = {
  staff: ArrowRight,
  customer: Plus,
};

interface DashboardOverviewProps {
  variant: DashboardOverviewVariant;
}

export async function DashboardOverview({ variant }: DashboardOverviewProps) {
  const t = await getTranslations("dashboard");
  const ta = await getTranslations("admin.dashboard");
  const tc = await getTranslations("common");
  const ActionIcon = ACTION_ICON[variant];
  const isCustomer = variant === "customer";

  const customerConfig: OverviewConfig = {
    heading: t("overview.customer.heading"),
    description: t("overview.customer.description"),
    action: {
      label: t("overview.customer.action"),
      href: "/dashboard/new-order",
    },
    stats: [
      {
        title: t("overview.customer.stats.wallet.title"),
        iconName: "wallet",
        description: t("overview.customer.stats.wallet.description"),
      },
      {
        title: t("overview.customer.stats.earned.title"),
        iconName: "award",
        description: t("overview.customer.stats.earned.description"),
      },
      {
        title: t("overview.customer.stats.orders.title"),
        iconName: "orders",
        description: t("overview.customer.stats.orders.description"),
      },
      {
        title: t("overview.customer.stats.referrals.title"),
        iconName: "referrals",
        description: t("overview.customer.stats.referrals.description"),
      },
    ],
    modules: [
      {
        title: t("overview.customer.modules.newOrder.title"),
        description: t("overview.customer.modules.newOrder.description"),
        iconName: "add",
      },
      {
        title: t("overview.customer.modules.orders.title"),
        description: t("overview.customer.modules.orders.description"),
        iconName: "orders",
      },
      {
        title: t("overview.customer.modules.wallet.title"),
        description: t("overview.customer.modules.wallet.description"),
        iconName: "wallet",
      },
      {
        title: t("overview.customer.modules.withdrawals.title"),
        description: t("overview.customer.modules.withdrawals.description"),
        iconName: "withdrawals",
      },
      {
        title: t("overview.customer.modules.referrals.title"),
        description: t("overview.customer.modules.referrals.description"),
        iconName: "referrals",
      },
    ],
  };

  const config = isCustomer ? customerConfig : buildStaffConfig(ta);
  const activityTitle = isCustomer
    ? t("overview.activity.title")
    : ta("activity.title");
  const activityDescription = isCustomer
    ? t("overview.activity.description")
    : ta("activity.description");
  const modulesPanelTitle = isCustomer
    ? t("overview.modulesPanel.title")
    : ta("modulesPanel.title");
  const modulesPanelDescription = isCustomer
    ? t("overview.modulesPanel.description")
    : ta("modulesPanel.description");

  return (
    <div className="space-y-6">
      <PageHeader title={config.heading} description={config.description}>
        {isCustomer ? (
          <>
            <ReferralPartnerBadge />
            <AgentBadge />
            <AffiliateBadge />
          </>
        ) : null}
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary">
          <Link href={config.action.href}>
            <ActionIcon />
            {config.action.label}
          </Link>
        </Button>
      </PageHeader>

      <ReferralLinkCard />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {config.stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value="—"
            iconName={stat.iconName}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <OverviewActivityPanel
          className="lg:col-span-2"
          title={activityTitle}
          description={activityDescription}
        />
        <OverviewModuleAccessPanel
          modules={config.modules}
          title={modulesPanelTitle}
          description={modulesPanelDescription}
          soonLabel={tc("soon")}
        />
      </div>
    </div>
  );
}
