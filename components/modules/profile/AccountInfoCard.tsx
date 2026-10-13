import { useTranslations } from "next-intl";

import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import type { AuthUser } from "@/lib/auth-api";
import {
  getProfileRoleLabel,
  getProfileStatusLabel,
} from "./profile.constants";

interface AccountInfoCardProps {
  user: AuthUser;
  className?: string;
}

function BooleanBadge({ value }: { value?: boolean }) {
  const t = useTranslations("common");
  return value ? (
    <Badge variant="outline" className="text-success">
      {t("yes")}
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      {t("no")}
    </Badge>
  );
}

function InfoLine({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium">
        {children}
      </span>
    </div>
  );
}

export function AccountInfoCard({ user, className }: AccountInfoCardProps) {
  const t = useTranslations("profile");
  const te = useTranslations("enums");

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>{t("accountInformation")}</CardTitle>
        <CardDescription>{t("accountInformationDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          <InfoLine label={t("userId")}>
            <span className="block max-w-[13rem] truncate font-mono text-xs text-muted-foreground">
              {user.id}
            </span>
          </InfoLine>
          <InfoLine label={t("role")}>{getProfileRoleLabel(user.role, te)}</InfoLine>
          <InfoLine label={t("status")}>
            <StatusBadgeCell
              status={user.status ?? ""}
              label={getProfileStatusLabel(user.status, te)}
            />
          </InfoLine>
          <InfoLine label={t("emailVerified")}>
            <BooleanBadge value={user.emailVerified} />
          </InfoLine>
          <InfoLine label={t("phoneVerified")}>
            <BooleanBadge value={user.phoneVerified} />
          </InfoLine>
          <InfoLine label={t("passwordChangeRequired")}>
            <BooleanBadge value={user.needPasswordChange} />
          </InfoLine>
          <InfoLine label={t("memberSince")}>
            <span className="text-muted-foreground">
              {formatDateTime(user.createdAt)}
            </span>
          </InfoLine>
          <InfoLine label={t("lastUpdated")}>
            <span className="text-muted-foreground">
              {formatDateTime(user.updatedAt)}
            </span>
          </InfoLine>
        </div>
      </CardContent>
    </Card>
  );
}
