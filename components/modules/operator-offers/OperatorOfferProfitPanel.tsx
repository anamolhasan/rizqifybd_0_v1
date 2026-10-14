"use client";

import { TrendingDown } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OperatorOfferProfitBreakdown } from "@/lib/operator-offer-calculations";
import { useTranslations } from "next-intl";

interface OperatorOfferProfitPanelProps {
  sellingPrice: number;
  companyPurchaseCost: number;
  breakdown: OperatorOfferProfitBreakdown;
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
  const t = useTranslations("admin.operatorOfferProfit");
  return (
    <div className="rounded-lg border border-border/70 p-2.5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="mt-1.5 space-y-1 text-sm">
        {commissionLabel ? (
          <SummaryRow label={commissionLabel} value={formatBDT(commissionAmount)} />
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">{t("estProfit")}</span>
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

export function OperatorOfferProfitPanel({
  sellingPrice,
  companyPurchaseCost,
  breakdown,
}: OperatorOfferProfitPanelProps) {
  const t = useTranslations("admin.operatorOfferProfit");
  const hasNegativeProfit =
    breakdown.directSale.isNegative ||
    breakdown.resellerSale.isNegative ||
    breakdown.agentSale.isNegative;

  return (
    <div className="space-y-4">
      <dl className="space-y-2 text-sm">
        <SummaryRow label={t("sellingPrice")} value={formatBDT(sellingPrice)} />
        <SummaryRow label={t("companyCost")} value={formatBDT(companyPurchaseCost)} />
      </dl>

      <Separator />

      <div className="space-y-2">
        <ScenarioRow
          label={t("directSale")}
          profit={breakdown.directSale.estimatedProfit}
          isNegative={breakdown.directSale.isNegative}
          commissionLabel=""
          commissionAmount={0}
        />
        <ScenarioRow
          label={t("resellerSale")}
          profit={breakdown.resellerSale.estimatedProfit}
          isNegative={breakdown.resellerSale.isNegative}
          commissionLabel={t("resellerCommission")}
          commissionAmount={breakdown.resellerSale.resellerCommissionAmount}
        />
        <ScenarioRow
          label={t("agentSale")}
          profit={breakdown.agentSale.estimatedProfit}
          isNegative={breakdown.agentSale.isNegative}
          commissionLabel={t("agentCommission")}
          commissionAmount={breakdown.agentSale.agentCommissionAmount}
        />
      </div>

      {hasNegativeProfit ? (
        <Alert variant="destructive">
          <TrendingDown />
          <AlertTitle>{t("negativeProfitTitle")}</AlertTitle>
          <AlertDescription>{t("negativeProfitDescription")}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}