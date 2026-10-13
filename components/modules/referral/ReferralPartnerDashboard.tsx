"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  Copy,
  Link2,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatNumber } from "@/lib/format";
import { buildReferralLink } from "@/lib/referralLink";
import type { IPartnerReferralDashboard } from "@/types/referral.types";

interface ReferralPartnerDashboardProps {
  data: IPartnerReferralDashboard;
}

export function ReferralPartnerDashboard({
  data,
}: ReferralPartnerDashboardProps) {
  const t = useTranslations("referral.dashboard");
  const tl = useTranslations("referral.link");
  const tb = useTranslations("referral.badge");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const referralLink = buildReferralLink(data.referralCode);

  const progressValue =
    data.targetActiveReferrals > 0
      ? Math.min(
          100,
          Math.round(
            (data.activeReferredCount / data.targetActiveReferrals) * 100,
          ),
        )
      : 0;
  const remaining = Math.max(
    0,
    data.targetActiveReferrals - data.activeReferredCount,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success(tl("toastCopied"));
    } catch {
      toast.error(tl("toastCopyFailed"));
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: tl("shareTitle"),
        text: tl("shareText"),
        url: referralLink,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error(tl("toastShareFailed"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/4 ring-0 backdrop-blur-xl sm:rounded-3xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-400/10 blur-3xl"
        />
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg font-bold tracking-tight">
              {tl("title")}
            </CardTitle>
            <Badge className="h-auto gap-1.5 border border-emerald-500/30 bg-emerald-100 px-3 py-1 text-emerald-800">
              <BadgeCheck className="size-3.5" />
              {tb("approved")}
            </Badge>
          </div>
          <CardDescription>{t("linkDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              readOnly
              value={referralLink}
              aria-label={tl("linkAria")}
              className="h-11 rounded-xl bg-white/70 font-medium"
              onFocus={(event) => event.currentTarget.select()}
            />
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                onClick={handleCopy}
                className="h-11 rounded-xl"
              >
                {copied ? (
                  <>
                    <Check />
                    {tl("copied")}
                  </>
                ) : (
                  <>
                    <Copy />
                    {tl("copy")}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleShare}
                className="h-11 rounded-xl"
              >
                <Share2 />
                {tl("share")}
              </Button>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link2 className="size-3.5" />
            {tl("codeLabel")}
            <span className="font-semibold text-foreground">
              {data.referralCode}
            </span>
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title={t("totalReferred")}
          value={formatNumber(data.totalReferredCount)}
          iconName="users"
          description={t("totalReferredDescription")}
        />
        <StatsCard
          title={t("activeReferred")}
          value={formatNumber(data.activeReferredCount)}
          iconName="award"
          description={t("activeReferredDescription")}
        />
        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm font-semibold">
              {t("progressTitle")}
            </CardTitle>
            <CardDescription>
              {remaining > 0
                ? t("progressNeeded", {
                    count: remaining,
                    target: formatNumber(data.targetActiveReferrals),
                  })
                : t("progressMet")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={progressValue} />
            <p className="text-xs text-muted-foreground">
              {t("progressCount", {
                current: formatNumber(data.activeReferredCount),
                target: formatNumber(data.targetActiveReferrals),
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("referredAccounts")}</CardTitle>
          <CardDescription>
            {t("referredAccountsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.referrals.length === 0 ? (
            <EmptyReferredAccounts />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border">
              {data.referrals.map((referral) => (
                <li
                  key={referral.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {referral.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {referral.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(referral.joinedAt)}
                    </span>
                    <Badge
                      variant={referral.isActive ? "default" : "outline"}
                      className="gap-1.5"
                    >
                      {referral.isActive ? (
                        <BadgeCheck className="size-3.5" />
                      ) : (
                        <UserPlus className="size-3.5" />
                      )}
                      {referral.isActive
                        ? t("accountActive")
                        : t("accountPending")}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyReferredAccounts() {
  const t = useTranslations("referral.dashboard");
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <Users className="size-5" />
      </span>
      <p className="mt-4 text-sm font-semibold">{t("emptyTitle")}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {t("emptyBody")}
      </p>
    </div>
  );
}
