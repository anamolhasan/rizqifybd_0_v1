"use client";

import { History, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatBDT, formatDate, formatDateTime } from "@/lib/format";
import type { IUser } from "@/types/user.types";
import { RoleBadge } from "./RoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { VerificationBadge } from "./VerificationBadge";
import { getRoleDescription } from "./user.constants";

interface UserDetailsDrawerProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium break-words">
        {children}
      </span>
    </div>
  );
}

export function UserDetailsDrawer({
  user,
  open,
  onOpenChange,
}: UserDetailsDrawerProps) {
  const t = useTranslations("admin.users.details");
  const tc = useTranslations("common");
  const te = useTranslations("enums");
  const appUser = user?.appUser ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {user ? (
          <>
            <SheetHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  {user.image || appUser?.profilePhoto ? (
                    <AvatarImage
                      src={user.image ?? appUser?.profilePhoto ?? undefined}
                      alt={user.name}
                    />
                  ) : null}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <SheetTitle className="truncate">{user.name}</SheetTitle>
                  <SheetDescription className="truncate">
                    {user.email}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <RoleBadge role={user.role} />
                <UserStatusBadge status={user.status} />
              </div>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-6 p-4">
                <Section title={t("personalInfo")}>
                  <DetailRow label={t("email")}>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="truncate">{user.email}</span>
                      <VerificationBadge type="email" verified={user.emailVerified} />
                    </div>
                  </DetailRow>
                  <DetailRow label={t("phone")}>
                    {user.phone ?? appUser?.contactNumber ?? "—"}
                  </DetailRow>
                  <DetailRow label={t("contactNumber")}>
                    {appUser?.contactNumber ?? "—"}
                  </DetailRow>
                  <DetailRow label={t("address")}>
                    {appUser?.address ?? "—"}
                  </DetailRow>
                  <DetailRow label={t("country")}>
                    {appUser?.country ?? "—"}
                  </DetailRow>
                  <DetailRow label={t("userId")}>
                    <span className="font-mono text-xs">{user.id}</span>
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("accountVerification")}>
                  <DetailRow label={t("accountStatus")}>
                    <UserStatusBadge status={user.status} />
                  </DetailRow>
                  <DetailRow label={t("phoneVerified")}>
                    <VerificationBadge type="phone" verified={user.phoneVerified} />
                  </DetailRow>
                  <DetailRow label={t("passwordChangeRequired")}>
                    <Badge variant={user.needPasswordChange ? "secondary" : "outline"}>
                      {user.needPasswordChange ? tc("yes") : tc("no")}
                    </Badge>
                  </DetailRow>
                  <DetailRow label={t("deleted")}>
                    <Badge variant={user.isDeleted ? "destructive" : "outline"}>
                      {user.isDeleted ? tc("yes") : tc("no")}
                    </Badge>
                  </DetailRow>
                  {user.deletedAt ? (
                    <DetailRow label={t("deletedAt")}>
                      {formatDateTime(user.deletedAt)}
                    </DetailRow>
                  ) : null}
                </Section>

                <Separator />

                <Section title={t("rolePermissions")}>
                  <div className="flex items-center justify-between gap-3">
                    <RoleBadge role={user.role} />
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {getRoleDescription(user.role, te)}
                  </p>
                </Section>

                <Separator />

                <Section title={t("referralSection")}>
                  <DetailRow label={t("referralCode")}>
                    {appUser?.referralCode ? (
                      <span className="font-mono text-xs">{appUser.referralCode}</span>
                    ) : (
                      "—"
                    )}
                  </DetailRow>
                  <DetailRow label={t("referredBy")}>
                    {appUser?.referrer?.authUser?.name ?? t("directSignup")}
                  </DetailRow>
                  <DetailRow label={t("totalReferrals")}>
                    {appUser?._count?.referrals ?? 0}
                  </DetailRow>
                  <DetailRow label={t("referralIncomeEligible")}>
                    <Badge variant={appUser?.referralIncomeEligible ? "default" : "outline"}>
                      {appUser?.referralIncomeEligible
                        ? t("eligible")
                        : t("notEligible")}
                    </Badge>
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("walletEarnings")}>
                  <DetailRow label={t("balance")}>
                    {formatBDT(appUser?.balance ?? 0)}
                  </DetailRow>
                  <DetailRow label={t("totalEarned")}>
                    {formatBDT(appUser?.totalEarned ?? 0)}
                  </DetailRow>
                  <DetailRow label={t("agentFeature")}>
                    <Badge variant={appUser?.canEarn ? "default" : "outline"}>
                      {appUser?.canEarn ? t("enabled") : t("disabled")}
                    </Badge>
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("accountActivity")}>
                  <DetailRow label={t("registered")}>
                    {formatDateTime(user.createdAt)}
                  </DetailRow>
                  <DetailRow label={t("lastUpdated")}>
                    {formatDateTime(user.updatedAt)}
                  </DetailRow>
                  <DetailRow label={t("lastLogin")}>
                    {appUser?.lastLogin
                      ? formatDateTime(appUser.lastLogin)
                      : t("never")}
                  </DetailRow>
                  <DetailRow label={t("memberSince")}>
                    {formatDate(user.createdAt)}
                  </DetailRow>
                </Section>

                <Separator />

                <section className="space-y-2">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <History className="size-3.5" />
                    {t("transactionHistory")}
                  </h3>
                  <div className="flex items-start gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    <span>{t("transactionNote")}</span>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
