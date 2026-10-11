import Link from "next/link";
import { ArrowRight, Plus, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { ReferralPartnerBadge } from "@/components/modules/referral/ReferralPartnerBadge";
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

const VARIANTS: Record<DashboardOverviewVariant, OverviewConfig> = {
  staff: {
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
  },
  customer: {
    heading: "Dashboard Overview",
    description:
      "Your RizqifyBD account at a glance. Live details arrive with the data layer.",
    action: { label: "New Order", href: "/dashboard/new-order" },
    stats: [
      {
        title: "Wallet Balance",
        iconName: "wallet",
        description: "Your available wallet balance.",
      },
      {
        title: "Total Earned",
        iconName: "award",
        description: "Income earned so far.",
      },
      {
        title: "Total Orders",
        iconName: "orders",
        description: "Recharge and bill orders placed.",
      },
      {
        title: "My Referrals",
        iconName: "referrals",
        description: "People referred by you.",
      },
    ],
    modules: [
      { title: "New Order", description: "Recharge or pay a bill", iconName: "add" },
      { title: "My Orders", description: "Track your order history", iconName: "orders" },
      { title: "My Wallet", description: "Balance and transactions", iconName: "wallet" },
      {
        title: "My Withdrawals",
        description: "Request and track payouts",
        iconName: "withdrawals",
      },
      {
        title: "My Referral",
        description: "Referral link and income",
        iconName: "referrals",
      },
    ],
  },
};

const ACTION_ICON: Record<DashboardOverviewVariant, LucideIcon> = {
  staff: ArrowRight,
  customer: Plus,
};

interface DashboardOverviewProps {
  variant: DashboardOverviewVariant;
}

export function DashboardOverview({ variant }: DashboardOverviewProps) {
  const config = VARIANTS[variant];
  const ActionIcon = ACTION_ICON[variant];

  return (
    <div className="space-y-6">
      <PageHeader title={config.heading} description={config.description}>
        {variant === "customer" ? <ReferralPartnerBadge /> : null}
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
        <OverviewActivityPanel className="lg:col-span-2" />
        <OverviewModuleAccessPanel modules={config.modules} />
      </div>
    </div>
  );
}