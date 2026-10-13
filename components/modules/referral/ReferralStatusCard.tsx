import {
  BadgeCheck,
  Clock,
  Gift,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Users,
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
import { formatDate, formatNumber } from "@/lib/format";
import type { IReferralMe } from "@/types/referral.types";
import type { ReferralApplicationStatus } from "@/types/enums";

type StatusBadgeVariant = "default" | "secondary" | "outline" | "destructive";

const STATUS_CONFIG: Record<
  ReferralApplicationStatus,
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

interface ReferralStatusCardProps {
  me: IReferralMe;
}

export function ReferralStatusCard({ me }: ReferralStatusCardProps) {
  const t = useTranslations("referral.status");
  const application = me.application;

  if (!application) {
    return null;
  }

  const config = STATUS_CONFIG[application.status];
  const StatusIcon = config.icon;
  const statusKey = application.status.toLowerCase();
  const label = t(`labels.${statusKey}`);
  const description = t(`descriptions.${statusKey}`);
  const { eligibility } = me;

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

            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                {t("performance")}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <StatTile
                  icon={Users}
                  label={t("activeReferrals")}
                  value={formatNumber(eligibility.activeReferredCount)}
                />
                <StatTile
                  icon={TrendingUp}
                  label={t("eligibleIncome")}
                  value={eligibility.eligible ? t("active") : t("inactive")}
                />
                <StatTile
                  icon={Gift}
                  label={t("totalReferrals")}
                  value={formatNumber(me.referrals.length)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/[0.05] px-4 py-3">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                {me.referralIncomeEligible ? t("activeNote") : t("inactiveNote")}
              </p>
            </div>

            {me.referrals.length > 0 ? (
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground">
                  {t("referralsList")}
                </h3>
                <ul className="mt-3 divide-y divide-primary/10 rounded-2xl border border-primary/10 bg-white/50">
                  {me.referrals.map((referral) => (
                    <li
                      key={referral.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {referral.authUser.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {referral.authUser.email}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(referral.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}

        {application.status !== "APPROVED" ? (
          <div className="flex items-start gap-2 rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
            <RefreshCcw className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
              {t("singleApplication")}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/50 px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-primary" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-2 text-lg font-extrabold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
