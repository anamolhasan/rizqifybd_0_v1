import { BadgeCheck, Clock, Gift, Sparkles, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatBDT, formatDate, formatNumber } from "@/lib/format";
import type { IReferralMilestone } from "@/types/program.types";

interface ReferralMilestoneCardProps {
  milestone: IReferralMilestone;
}

export async function ReferralMilestoneCard({
  milestone,
}: ReferralMilestoneCardProps) {
  const t = await getTranslations("referral.milestone");

  const progressValue =
    milestone.requiredReferralCount > 0
      ? Math.min(
          100,
          Math.round(
            (milestone.activeReferralCount / milestone.requiredReferralCount) *
              100,
          ),
        )
      : 0;

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-400/10 blur-3xl"
      />
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Gift className="size-4 text-primary" />
            {t("title")}
          </CardTitle>
          {milestone.qualified ? (
            <Badge className="h-auto gap-1.5 border border-emerald-500/30 bg-emerald-100 px-3 py-1 text-emerald-800">
              <BadgeCheck className="size-3.5" />
              {t("qualified")}
            </Badge>
          ) : (
            <Badge variant="outline" className="h-auto gap-1.5 px-3 py-1">
              <Clock className="size-3.5" />
              {t("notQualified")}
            </Badge>
          )}
        </div>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">{t("progress")}</p>
            <p className="text-xs text-muted-foreground">
              {t("progressCount", {
                current: formatNumber(milestone.activeReferralCount),
                target: formatNumber(milestone.requiredReferralCount),
              })}
            </p>
          </div>
          <Progress value={progressValue} />
        </div>

        {milestone.configured ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <Sparkles className="size-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {t("amount")}
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {formatBDT(milestone.amount)}{" "}
                <span className="text-xs font-medium text-muted-foreground">
                  {milestone.currency}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("notConfiguredTitle")}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t("notConfiguredBody")}
              </p>
            </div>
          </div>
        )}

        {milestone.awarded ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.05] px-4 py-3">
            <Badge variant="default" className="gap-1.5">
              <BadgeCheck className="size-3.5" />
              {t("awarded")}
            </Badge>
            {milestone.awardedAt ? (
              <p className="text-xs text-muted-foreground">
                {t("awardedOn")}: {formatDate(milestone.awardedAt)}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
