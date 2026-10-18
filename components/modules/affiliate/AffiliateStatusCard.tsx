import {
  BadgeCheck,
  Clock,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format";
import type { AffiliateApplicationStatus } from "@/types/enums";
import type { IAffiliateStatus } from "@/types/affiliateApplication.types";

type StatusBadgeVariant = "default" | "secondary" | "outline" | "destructive";

const STATUS_CONFIG: Record<
  AffiliateApplicationStatus,
  {
    variant: StatusBadgeVariant;
    icon: typeof Clock;
  }
> = {
  PENDING: {
    variant: "outline",
    icon: Clock,
  },
  APPROVED: {
    variant: "default",
    icon: BadgeCheck,
  },
  REJECTED: {
    variant: "destructive",
    icon: XCircle,
  },
};

interface AffiliateStatusCardProps {
  status: IAffiliateStatus;
}

export function AffiliateStatusCard({ status }: AffiliateStatusCardProps) {
  const t = useTranslations("affiliate.status");
  const application = status.application;

  if (!application) {
    return null;
  }

  const config = STATUS_CONFIG[application.status];
  const StatusIcon = config.icon;
  const statusKey = application.status.toLowerCase();
  const label = t(`labels.${statusKey}`);
  const description = t(`descriptions.${statusKey}`);

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl"
      />

      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold tracking-tight">
            {t("title")}
          </CardTitle>
          <Badge variant={config.variant} className="h-auto gap-1.5 px-3 py-1">
            <StatusIcon className="size-3.5" />
            {label}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("appliedOn")}
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {formatDate(application.appliedAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("lastUpdated")}
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {formatDate(application.updatedAt)}
            </p>
          </div>
        </div>

        {application.status === "REJECTED" && application.rejectionReason ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-xs font-semibold text-destructive">
              {t("rejectionReason")}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {application.rejectionReason}
            </p>
          </div>
        ) : null}

        {application.status === "APPROVED" ? (
          <>
            <Separator />
            <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/[0.05] px-4 py-3">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                {t("approvedNote")}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-2 rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
            <RefreshCcw className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
              {t("singleApplication")}
            </p>
          </div>
        )}

        {application.status === "PENDING" ? (
          <div className="flex items-start gap-2 rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
              {t("pendingNote")}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
