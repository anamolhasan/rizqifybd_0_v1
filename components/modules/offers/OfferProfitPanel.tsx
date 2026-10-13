"use client";

import { TrendingDown } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OfferProfitBreakdown } from "@/lib/offer-calculations";

interface OfferProfitPanelProps {
  sellingPrice: number;
  companyPurchaseCost: number;
  breakdown: OfferProfitBreakdown;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function ScenarioRow({
  label,
  profit,
  isNegative,
  commissionLabel,
  commissionAmount,
}: {
  label: string;
  profit: number;
  isNegative: boolean;
  commissionLabel: string;
  commissionAmount: number;
}) {
  return (
    <div className="rounded-lg border border-border/70 p-2.5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="mt-1.5 space-y-1 text-sm">
        {commissionLabel ? (
          <SummaryRow label={commissionLabel} value={formatBDT(commissionAmount)} />
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Est. profit</span>
          <span
            className={cn(
              "font-semibold tabular-nums",
              isNegative
                ? "text-destructive"
                : "text-emerald-600 dark:text-emerald-400",
            )}
          >
            {formatBDT(profit)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OfferProfitPanel({
  sellingPrice,
  companyPurchaseCost,
  breakdown,
}: OfferProfitPanelProps) {
  const hasNegativeProfit =
    breakdown.directSale.isNegative ||
    breakdown.resellerSale.isNegative ||
    breakdown.agentSale.isNegative;

  return (
    <div className="space-y-4">
      <dl className="space-y-2 text-sm">
        <SummaryRow label="Selling price" value={formatBDT(sellingPrice)} />
        <SummaryRow label="Company cost" value={formatBDT(companyPurchaseCost)} />
      </dl>

      <Separator />

      <div className="space-y-2">
        <ScenarioRow
          label="Direct sale"
          profit={breakdown.directSale.estimatedProfit}
          isNegative={breakdown.directSale.isNegative}
          commissionLabel=""
          commissionAmount={0}
        />
        <ScenarioRow
          label="Reseller sale"
          profit={breakdown.resellerSale.estimatedProfit}
          isNegative={breakdown.resellerSale.isNegative}
          commissionLabel="Reseller commission"
          commissionAmount={breakdown.resellerSale.resellerCommissionAmount}
        />
        <ScenarioRow
          label="Agent sale"
          profit={breakdown.agentSale.estimatedProfit}
          isNegative={breakdown.agentSale.isNegative}
          commissionLabel="Agent commission"
          commissionAmount={breakdown.agentSale.agentCommissionAmount}
        />
      </div>

      {hasNegativeProfit ? (
        <Alert variant="destructive">
          <TrendingDown />
          <AlertTitle>Negative profit</AlertTitle>
          <AlertDescription>
            One or more scenarios would sell below company cost. Review the price
            and commissions before publishing.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
