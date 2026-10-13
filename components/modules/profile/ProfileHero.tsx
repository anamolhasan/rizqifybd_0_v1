import { BadgeCheck, CalendarDays, Clock, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { AgentBadge } from "@/components/modules/agent/AgentBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatRelativeTime } from "@/lib/format";
import type { AuthUser } from "@/lib/auth-api";
import {
  getProfileInitials,
  getProfileRoleLabel,
  getProfileStatusLabel,
} from "./profile.constants";

interface ProfileHeroProps {
  user: AuthUser;
}

export function ProfileHero({ user }: ProfileHeroProps) {
  const t = useTranslations("profile");
  const te = useTranslations("enums");
  const locale = useLocale();
  const photo = user.appUser?.profilePhoto ?? user.image ?? null;
  const initials = getProfileInitials(user.name, user.email);
  const lastLogin = user.appUser?.lastLogin;

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/25 via-success/15 to-accent/40 sm:h-28" />
      <CardContent className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar className="size-20 ring-4 ring-card sm:size-24">
            {photo ? <AvatarImage src={photo} alt={user.name} /> : null}
            <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {user.name}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="secondary">
                {getProfileRoleLabel(user.role, te)}
              </Badge>
              <StatusBadgeCell
                status={user.status ?? ""}
                label={getProfileStatusLabel(user.status, te)}
              />
              {user.emailVerified ? (
                <Badge
                  variant="outline"
                  className="gap-1 text-success"
                >
                  <BadgeCheck className="size-3" />
                  {t("verified")}
                </Badge>
              ) : null}
              {user.role === "USER" ? <AgentBadge /> : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground sm:justify-end">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            <span>{t("joined", { date: formatDate(user.createdAt) })}</span>
          </div>
          {lastLogin ? (
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>
                {t("lastLogin", {
                  time: formatRelativeTime(lastLogin, locale),
                })}
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
