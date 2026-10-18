"use client";

import { ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
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
import { formatBDT, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api.types";
import type { EarningStatusName, IEarningView } from "@/types/program.types";

export interface EarningsHistoryLabels {
  date: string;
  amount: string;
  status: string;
  description: string;
  reference: string;
  statusLabels: Record<EarningStatusName, string>;
}

interface EarningsHistoryPanelProps {
  earnings: IEarningView[];
  meta?: PaginationMeta | null;
  /** Panel heading (translated by the caller). */
  title: string;
  emptyTitle: string;
  emptyBody: string;
  /** When false the status column/badges are hidden (single-status views). */
  showStatusBadges?: boolean;
  labels: EarningsHistoryLabels;
}

// Distinct, non-interchangeable colours so pending money is never mistaken for
// spendable (available) money.
const STATUS_STYLES: Record<EarningStatusName, string> = {
  PENDING:
    "border-amber-500/30 bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  AVAILABLE:
    "border-emerald-500/30 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  REVERSED:
    "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

function referenceOf(earning: IEarningView): string | null {
  return earning.orderId ?? earning.productOrderId ?? null;
}

function StatusBadge({
  status,
  labels,
}: {
  status: EarningStatusName;
  labels: EarningsHistoryLabels;
}) {
  return (
    <Badge variant="outline" className={cn("border", STATUS_STYLES[status])}>
      {labels.statusLabels[status]}
    </Badge>
  );
}

export function EarningsHistoryPanel({
  earnings,
  // `meta` is accepted for parity with the paginated endpoints; the panel
  // renders the page it is given and leaves pagination chrome to the caller.
  meta: _meta,
  title,
  emptyTitle,
  emptyBody,
  showStatusBadges = true,
  labels,
}: EarningsHistoryPanelProps) {
  void _meta;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {earnings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ReceiptText className="size-5" />
            </span>
            <p className="mt-4 text-sm font-semibold">{emptyTitle}</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {emptyBody}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{labels.date}</TableHead>
                    <TableHead>{labels.amount}</TableHead>
                    {showStatusBadges ? (
                      <TableHead>{labels.status}</TableHead>
                    ) : null}
                    <TableHead>{labels.description}</TableHead>
                    <TableHead>{labels.reference}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((earning) => {
                    const reference = referenceOf(earning);
                    return (
                      <TableRow key={earning.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(earning.createdAt)}
                        </TableCell>
                        <TableCell className="font-semibold tabular-nums">
                          {formatBDT(earning.amount)}
                        </TableCell>
                        {showStatusBadges ? (
                          <TableCell>
                            <StatusBadge
                              status={earning.status}
                              labels={labels}
                            />
                          </TableCell>
                        ) : null}
                        <TableCell className="max-w-[16rem] truncate text-muted-foreground">
                          {earning.description ?? "—"}
                        </TableCell>
                        <TableCell
                          className="max-w-[12rem] truncate font-mono text-xs text-muted-foreground"
                          title={reference ?? undefined}
                        >
                          {reference ?? "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: stacked cards */}
            <ul className="space-y-3 md:hidden">
              {earnings.map((earning) => {
                const reference = referenceOf(earning);
                return (
                  <li
                    key={earning.id}
                    className="rounded-xl border border-border/60 bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold tabular-nums">
                        {formatBDT(earning.amount)}
                      </span>
                      {showStatusBadges ? (
                        <StatusBadge status={earning.status} labels={labels} />
                      ) : null}
                    </div>
                    {earning.description ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {earning.description}
                      </p>
                    ) : null}
                    <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between gap-2">
                        <dt>{labels.date}</dt>
                        <dd>{formatDate(earning.createdAt)}</dd>
                      </div>
                      {reference ? (
                        <div className="flex items-center justify-between gap-2">
                          <dt>{labels.reference}</dt>
                          <dd
                            className="max-w-[60%] truncate font-mono"
                            title={reference}
                          >
                            {reference}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
