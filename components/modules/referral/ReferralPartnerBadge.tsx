"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Sparkles, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useMyReferral } from "@/hooks/use-referral";

export function ReferralPartnerBadge() {
  const { data: me, isLoading } = useMyReferral();

  if (isLoading || !me) {
    return null;
  }

  const status = me.application?.status;

  if (!status) {
    return (
      <Link href="/referral" aria-label="Join the referral program">
        <Badge
          variant="outline"
          className="h-auto gap-1.5 border-emerald-500/30 px-3 py-1 text-emerald-700 transition-colors hover:bg-emerald-500/10"
        >
          <Sparkles className="size-3.5" />
          Become a Referral Partner
        </Badge>
      </Link>
    );
  }

  if (status === "PENDING") {
    return (
      <Link href="/referral" aria-label="View referral application status">
        <Badge
          variant="outline"
          className="h-auto gap-1.5 px-3 py-1 text-muted-foreground transition-colors hover:bg-muted/60"
        >
          <Clock className="size-3.5" />
          Referral Pending
        </Badge>
      </Link>
    );
  }

  if (status === "APPROVED") {
    return (
      <Link
        href="/dashboard/my-referrals"
        aria-label="Open the referral partner dashboard"
      >
        <Badge className="h-auto gap-1.5 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-400/15 to-teal-500/15 px-3 py-1 text-emerald-700 shadow-sm transition-colors hover:from-emerald-500/25 hover:to-teal-500/25">
          <BadgeCheck className="size-3.5" />
          Referral Partner
        </Badge>
      </Link>
    );
  }

  return (
    <Link href="/referral" aria-label="View referral application status">
      <Badge variant="destructive" className="h-auto gap-1.5 px-3 py-1">
        <XCircle className="size-3.5" />
        Referral Rejected
      </Badge>
    </Link>
  );
}
