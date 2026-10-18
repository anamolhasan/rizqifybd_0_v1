"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Handshake, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { useMyAffiliateApplication } from "@/hooks/use-affiliate-application";

export function AffiliateBadge() {
  const { data: me, isLoading } = useMyAffiliateApplication();
  const t = useTranslations("affiliate.badge");

  if (isLoading || !me) {
    return null;
  }

  const status = me.application?.status;

  if (!status) {
    return (
      <Link href="/dashboard/affiliate-application" aria-label={t("applyAria")}>
        <Badge
          variant="outline"
          className="h-auto gap-1.5 border-violet-500/30 px-3 py-1 text-violet-700 transition-colors hover:bg-violet-500/10"
        >
          <Handshake className="size-3.5" />
          {t("become")}
        </Badge>
      </Link>
    );
  }

  if (status === "PENDING") {
    return (
      <Link
        href="/dashboard/affiliate-application"
        aria-label={t("viewAria")}
      >
        <Badge
          variant="outline"
          className="h-auto gap-1.5 px-3 py-1 text-muted-foreground transition-colors hover:bg-muted/60"
        >
          <Clock className="size-3.5" />
          {t("pending")}
        </Badge>
      </Link>
    );
  }

  if (status === "APPROVED") {
    return (
      <Link
        href="/dashboard/affiliate-application"
        aria-label={t("approvedAria")}
      >
        <Badge className="h-auto gap-1.5 border border-violet-500/30 bg-gradient-to-r from-violet-500/15 via-violet-400/15 to-fuchsia-500/15 px-3 py-1 text-violet-700 shadow-sm transition-colors hover:from-violet-500/25 hover:to-fuchsia-500/25">
          <BadgeCheck className="size-3.5" />
          {t("approved")}
        </Badge>
      </Link>
    );
  }

  return (
    <Link href="/dashboard/affiliate-application" aria-label={t("viewAria")}>
      <Badge variant="destructive" className="h-auto gap-1.5 px-3 py-1">
        <XCircle className="size-3.5" />
        {t("rejected")}
      </Badge>
    </Link>
  );
}
