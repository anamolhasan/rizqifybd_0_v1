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
      toast.success("Referral link copied");
    } catch {
      toast.error("Could not copy the referral link");
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: "Join RizqifyBD",
        text: "Sign up with RizqifyBD using my referral link",
        url: referralLink,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Could not share the referral link");
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
              Your referral link
            </CardTitle>
            <Badge className="h-auto gap-1.5 border border-emerald-500/30 bg-emerald-100 px-3 py-1 text-emerald-800">
              <BadgeCheck className="size-3.5" />
              Referral Partner
            </Badge>
          </div>
          <CardDescription>
            Share this link with your network. Anyone who signs up with your
            code is attributed to you as a referral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              readOnly
              value={referralLink}
              aria-label="Referral link"
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
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy />
                    Copy link
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
                Share
              </Button>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link2 className="size-3.5" />
            Referral code:
            <span className="font-semibold text-foreground">
              {data.referralCode}
            </span>
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Total referred accounts"
          value={formatNumber(data.totalReferredCount)}
          iconName="users"
          description="Accounts that signed up with your code."
        />
        <StatsCard
          title="Active referred accounts"
          value={formatNumber(data.activeReferredCount)}
          iconName="award"
          description="At least one paid offer purchase in 6 months."
        />
        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm font-semibold">
              Progress to referral income
            </CardTitle>
            <CardDescription>
              {remaining > 0
                ? `${formatNumber(remaining)} more active referral${
                    remaining === 1 ? "" : "s"
                  } needed (target ${formatNumber(data.targetActiveReferrals)}).`
                : "You have met the active referral requirement."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={progressValue} />
            <p className="text-xs text-muted-foreground">
              {formatNumber(data.activeReferredCount)} /{" "}
              {formatNumber(data.targetActiveReferrals)} active referred
              accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referred accounts</CardTitle>
          <CardDescription>
            An account becomes active after at least one qualifying paid offer
            purchase within the previous 6 months. Phone verification is not
            required at this stage.
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
                      {referral.isActive ? "Active" : "Pending"}
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
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <Users className="size-5" />
      </span>
      <p className="mt-4 text-sm font-semibold">No referrals yet</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Share your referral link to get started. New sign-ups will appear here
        as soon as they join.
      </p>
    </div>
  );
}
