import {
  BadgeCheck,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth-api";

interface ProfileDetailsCardProps {
  user: AuthUser;
  className?: string;
}

interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  verified?: boolean;
}

function DetailItem({ icon: Icon, label, value, verified }: DetailItemProps) {
  const t = useTranslations("common");
  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border/60">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              "truncate text-sm font-medium",
              !hasValue && "text-muted-foreground italic",
            )}
          >
            {hasValue ? value : t("notProvided")}
          </p>
          {verified && hasValue ? (
            <BadgeCheck className="size-4 shrink-0 text-success" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProfileDetailsCard({
  user,
  className,
}: ProfileDetailsCardProps) {
  const t = useTranslations("profile");
  const appUser = user.appUser;

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>{t("personalInformation")}</CardTitle>
        <CardDescription>{t("personalInformationDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <DetailItem icon={UserRound} label={t("fullName")} value={user.name} />
        <DetailItem
          icon={Mail}
          label={t("emailAddress")}
          value={user.email}
          verified={user.emailVerified}
        />
        <DetailItem
          icon={Smartphone}
          label={t("mobileNumber")}
          value={user.phone}
          verified={user.phoneVerified}
        />
        <DetailItem
          icon={Phone}
          label={t("contactNumber")}
          value={appUser?.contactNumber}
        />
        <DetailItem icon={MapPin} label={t("address")} value={appUser?.address} />
        <DetailItem icon={Globe2} label={t("country")} value={appUser?.country} />
      </CardContent>
    </Card>
  );
}
