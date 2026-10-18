import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  Coins,
  ShoppingCart,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EarningsHistoryPanel } from "@/components/modules/programs/EarningsHistoryPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT, formatDate, formatNumber } from "@/lib/format";
import type { IAgentDashboard, IAgentSale, IEarningView } from "@/types/program.types";

interface AgentDashboardProps {
  dashboard: IAgentDashboard;
  sales: IAgentSale[];
  // The caller already fetches the agent's earnings; the panel is rendered here
  // so the whole programme section stays together.
  earnings: IEarningView[];
}

const STATUS_VARIANTS = {
  PENDING: { variant: "outline" as const, Icon: Clock },
  APPROVED: { variant: "default" as const, Icon: BadgeCheck },
  REJECTED: { variant: "destructive" as const, Icon: XCircle },
};

export async function AgentDashboard({
  dashboard,
  sales,
  earnings,
}: AgentDashboardProps) {
  const t = await getTranslations("agent.dashboard");
  const ts = await getTranslations("agent.status");
  const te = await getTranslations("enums");

  const status = dashboard.application.status;
  const statusConfig = status
    ? STATUS_VARIANTS[status as keyof typeof STATUS_VARIANTS]
    : null;

  return (
    <div className="space-y-6">
      <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl"
        />
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg font-bold tracking-tight">
              {t("statusTitle")}
            </CardTitle>
            {statusConfig && status ? (
              <Badge
                variant={statusConfig.variant}
                className="h-auto gap-1.5 px-3 py-1"
              >
                <statusConfig.Icon className="size-3.5" />
                {ts(`labels.${status.toLowerCase()}`)}
              </Badge>
            ) : null}
          </div>
          {status ? (
            <CardDescription>
              {ts(`descriptions.${status.toLowerCase()}`)}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-5">
          {dashboard.application.appliedAt ? (
            <div className="rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">
                {t("appliedOn")}
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatDate(dashboard.application.appliedAt)}
              </p>
            </div>
          ) : null}

          {status === "REJECTED" && dashboard.application.rejectionReason ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-xs font-semibold text-destructive">
                {t("rejectionReason")}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {dashboard.application.rejectionReason}
              </p>
            </div>
          ) : null}

          {dashboard.approved && dashboard.canEarn ? (
            <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/[0.05] px-4 py-3">
              <BadgeCheck className="size-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                {ts("canEarn")}
              </p>
            </div>
          ) : null}

          {!dashboard.approved ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                {t("notApprovedNotice")}
              </p>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/dashboard/agent-application">{t("applyCta")}</Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {dashboard.approved ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title={t("completedSales")}
          value={formatNumber(dashboard.sales.completedOrders)}
          iconName="orders"
        />
        <StatsCard
          title={t("totalSales")}
          value={formatBDT(dashboard.sales.totalSales)}
          iconName="trending-up"
        />
        <StatsCard
          title={t("totalCommission")}
          value={formatBDT(dashboard.sales.totalCommission)}
          iconName="award"
        />
        <StatsCard
          title={t("walletBalance")}
          value={formatBDT(dashboard.wallet.balance)}
          iconName="wallet"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("earningsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile
              icon={Clock}
              label={t("pending")}
              value={formatBDT(dashboard.earnings.pending)}
            />
            <StatTile
              icon={Coins}
              label={t("available")}
              value={formatBDT(dashboard.earnings.available)}
            />
            <StatTile
              icon={XCircle}
              label={t("reversed")}
              value={formatBDT(dashboard.earnings.reversed)}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/[0.05] px-4 py-3">
            <Wallet className="size-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t("totalEarned")}:{" "}
              <span className="font-semibold text-foreground">
                {formatBDT(dashboard.wallet.totalEarned)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentSalesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title={t("noSalesTitle")}
              body={t("noSalesBody")}
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("salesColumns.order")}</TableHead>
                      <TableHead>{t("salesColumns.targetNumber")}</TableHead>
                      <TableHead>{t("salesColumns.quantity")}</TableHead>
                      <TableHead>{t("salesColumns.total")}</TableHead>
                      <TableHead>{t("salesColumns.commission")}</TableHead>
                      <TableHead>{t("salesColumns.completedOn")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.orderId}>
                        <TableCell
                          className="max-w-[10rem] truncate font-mono text-xs text-muted-foreground"
                          title={sale.orderId}
                        >
                          {sale.orderId}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sale.targetNumber ?? "—"}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {formatNumber(sale.quantity)}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {formatBDT(sale.totalAmount)}
                        </TableCell>
                        <TableCell className="font-semibold tabular-nums">
                          {formatBDT(sale.commissionAmount)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(sale.completedAt ?? sale.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <ul className="space-y-3 md:hidden">
                {sales.map((sale) => (
                  <li
                    key={sale.orderId}
                    className="rounded-xl border border-border/60 bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold tabular-nums">
                        {formatBDT(sale.totalAmount)}
                      </span>
                      <Badge variant="outline" className="gap-1">
                        <TrendingUp className="size-3" />
                        {formatBDT(sale.commissionAmount)}
                      </Badge>
                    </div>
                    <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between gap-2">
                        <dt>{t("salesColumns.order")}</dt>
                        <dd
                          className="max-w-[60%] truncate font-mono"
                          title={sale.orderId}
                        >
                          {sale.orderId}
                        </dd>
                      </div>
                      {sale.targetNumber ? (
                        <div className="flex items-center justify-between gap-2">
                          <dt>{t("salesColumns.targetNumber")}</dt>
                          <dd>{sale.targetNumber}</dd>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between gap-2">
                        <dt>{t("salesColumns.quantity")}</dt>
                        <dd>{formatNumber(sale.quantity)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt>{t("salesColumns.completedOn")}</dt>
                        <dd>{formatDate(sale.completedAt ?? sale.createdAt)}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <EarningsHistoryPanel
        earnings={earnings}
        title={t("earningsHistoryTitle")}
        emptyTitle={t("noEarningsTitle")}
        emptyBody={t("noEarningsBody")}
        labels={{
          date: t("earningsColumns.date"),
          amount: t("earningsColumns.amount"),
          status: t("earningsColumns.status"),
          description: t("earningsColumns.description"),
          reference: t("earningsColumns.reference"),
          statusLabels: {
            PENDING: te("earningStatus.PENDING"),
            AVAILABLE: te("earningStatus.AVAILABLE"),
            REVERSED: te("earningStatus.REVERSED"),
          },
        }}
      />
        </>
      ) : null}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-primary" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-2 text-lg font-extrabold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
