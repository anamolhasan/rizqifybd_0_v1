import Link from "next/link";
import { ArrowRight, Plus, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { ReferralPartnerBadge } from "@/components/modules/referral/ReferralPartnerBadge";
import { AgentBadge } from "@/components/modules/agent/AgentBadge";
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

const STAFF_CONFIG: OverviewConfig = {
  heading: "Admin Overview",
  description:
    "A snapshot of the RizqifyBD platform. Live metrics arrive with the data layer.",
  action: {
    label: "Manage Orders",
    href: "/admin/dashboard/orders-management",
  },
  stats: [
    {
      title: "Total Users",
      iconName: "users",
      description: "Registered users across all roles.",
    },
    {
      title: "Total Orders",
      iconName: "orders",
      description: "Recharge and bill orders placed.",
    },
    {
      title: "Total Products",
      iconName: "products",
      description: "Active products and bundles.",
    },
    {
      title: "Total Withdrawals",
      iconName: "withdrawals",
      description: "Withdrawal requests submitted.",
    },
  ],
  modules: [
    { title: "Users", description: "Roles, status and access", iconName: "users" },
    { title: "Orders", description: "Recharges and bill payments", iconName: "orders" },
    {
      title: "Products",
      description: "Recharge and bundle catalogue",
      iconName: "products",
    },
    { title: "Operators", description: "Mobile operator setup", iconName: "operators" },
    {
      title: "Withdrawals",
      description: "Review and payout requests",
      iconName: "withdrawals",
    },
    {
      title: "Referrals",
      description: "Referral applications and income",
      iconName: "referrals",
    },
  ],
};

const ACTION_ICON: Record<DashboardOverviewVariant, LucideIcon> = {
  staff: ArrowRight,
  customer: Plus,
};

interface DashboardOverviewProps {
  variant: DashboardOverviewVariant;
}

export async function DashboardOverview({ variant }: DashboardOverviewProps) {
  const t = await getTranslations("dashboard");
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

  const config = isCustomer ? customerConfig : STAFF_CONFIG;

  return (
    <div className="space-y-6">
      <PageHeader title={config.heading} description={config.description}>
        {isCustomer ? (
          <>
            <ReferralPartnerBadge />
            <AgentBadge />
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
          title={isCustomer ? t("overview.activity.title") : undefined}
          description={isCustomer ? t("overview.activity.description") : undefined}
        />
        <OverviewModuleAccessPanel
          modules={config.modules}
          title={isCustomer ? t("overview.modulesPanel.title") : undefined}
          description={isCustomer ? t("overview.modulesPanel.description") : undefined}
          soonLabel={isCustomer ? t("overview.soon") : undefined}
        />
      </div>
    </div>
  );
}
