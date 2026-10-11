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
  return value ? (
    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400">
      Yes
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      No
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
  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Read-only account and security details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          <InfoLine label="User ID">
            <span className="block max-w-[13rem] truncate font-mono text-xs text-muted-foreground">
              {user.id}
            </span>
          </InfoLine>
          <InfoLine label="Role">{getProfileRoleLabel(user.role)}</InfoLine>
          <InfoLine label="Status">
            <StatusBadgeCell
              status={user.status ?? ""}
              label={getProfileStatusLabel(user.status)}
            />
          </InfoLine>
          <InfoLine label="Email verified">
            <BooleanBadge value={user.emailVerified} />
          </InfoLine>
          <InfoLine label="Phone verified">
            <BooleanBadge value={user.phoneVerified} />
          </InfoLine>
          <InfoLine label="Password change required">
            <BooleanBadge value={user.needPasswordChange} />
          </InfoLine>
          <InfoLine label="Member since">
            <span className="text-muted-foreground">
              {formatDateTime(user.createdAt)}
            </span>
          </InfoLine>
          <InfoLine label="Last updated">
            <span className="text-muted-foreground">
              {formatDateTime(user.updatedAt)}
            </span>
          </InfoLine>
        </div>
      </CardContent>
    </Card>
  );
}
