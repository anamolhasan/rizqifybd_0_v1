"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Sparkles, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { useMyAgentApplication } from "@/hooks/use-agent-application";

export function AgentBadge() {
  const { data: me, isLoading } = useMyAgentApplication();
  const t = useTranslations("agent.badge");

  if (isLoading || !me) {
    return null;
  }

  const status = me.application?.status;

  if (!status) {
    return (
      <Link href="/dashboard/agent-application" aria-label={t("applyAria")}>
        <Badge
          variant="outline"
          className="h-auto gap-1.5 border-sky-500/30 px-3 py-1 text-sky-700 transition-colors hover:bg-sky-500/10"
        >
          <Sparkles className="size-3.5" />
          {t("become")}
        </Badge>
      </Link>
    );
  }

  if (status === "PENDING") {
    return (
      <Link
        href="/dashboard/agent-application"
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
        href="/dashboard/agent-application"
        aria-label={t("approvedAria")}
      >
        <Badge className="h-auto gap-1.5 border border-sky-500/30 bg-gradient-to-r from-sky-500/15 via-sky-400/15 to-indigo-500/15 px-3 py-1 text-sky-700 shadow-sm transition-colors hover:from-sky-500/25 hover:to-indigo-500/25">
          <BadgeCheck className="size-3.5" />
          {t("approved")}
        </Badge>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/agent-application"
      aria-label={t("viewAria")}
    >
      <Badge variant="destructive" className="h-auto gap-1.5 px-3 py-1">
        <XCircle className="size-3.5" />
        {t("rejected")}
      </Badge>
    </Link>
  );
}
