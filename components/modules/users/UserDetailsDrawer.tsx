"use client";

import { History, Info } from "lucide-react";

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
import { ROLE_DESCRIPTIONS } from "./user.constants";

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
                <Section title="Personal information">
                  <DetailRow label="Email">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="truncate">{user.email}</span>
                      <VerificationBadge type="email" verified={user.emailVerified} />
                    </div>
                  </DetailRow>
                  <DetailRow label="Phone">
                    {user.phone ?? appUser?.contactNumber ?? "—"}
                  </DetailRow>
                  <DetailRow label="Contact number">
                    {appUser?.contactNumber ?? "—"}
                  </DetailRow>
                  <DetailRow label="Address">{appUser?.address ?? "—"}</DetailRow>
                  <DetailRow label="Country">{appUser?.country ?? "—"}</DetailRow>
                  <DetailRow label="User ID">
                    <span className="font-mono text-xs">{user.id}</span>
                  </DetailRow>
                </Section>

                <Separator />

                <Section title="Account & verification">
                  <DetailRow label="Account status">
                    <UserStatusBadge status={user.status} />
                  </DetailRow>
                  <DetailRow label="Phone verified">
                    <VerificationBadge type="phone" verified={user.phoneVerified} />
                  </DetailRow>
                  <DetailRow label="Password change required">
                    <Badge variant={user.needPasswordChange ? "secondary" : "outline"}>
                      {user.needPasswordChange ? "Yes" : "No"}
                    </Badge>
                  </DetailRow>
                  <DetailRow label="Deleted">
                    <Badge variant={user.isDeleted ? "destructive" : "outline"}>
                      {user.isDeleted ? "Yes" : "No"}
                    </Badge>
                  </DetailRow>
                  {user.deletedAt ? (
                    <DetailRow label="Deleted at">
                      {formatDateTime(user.deletedAt)}
                    </DetailRow>
                  ) : null}
                </Section>

                <Separator />

                <Section title="Role & permissions">
                  <div className="flex items-center justify-between gap-3">
                    <RoleBadge role={user.role} />
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {ROLE_DESCRIPTIONS[user.role]}
                  </p>
                </Section>

                <Separator />

                <Section title="Referral information">
                  <DetailRow label="Referral code">
                    {appUser?.referralCode ? (
                      <span className="font-mono text-xs">{appUser.referralCode}</span>
                    ) : (
                      "—"
                    )}
                  </DetailRow>
                  <DetailRow label="Referred by">
                    {appUser?.referrer?.authUser?.name ?? "Direct signup"}
                  </DetailRow>
                  <DetailRow label="Total referrals">
                    {appUser?._count?.referrals ?? 0}
                  </DetailRow>
                  <DetailRow label="Referral income eligible">
                    <Badge variant={appUser?.referralIncomeEligible ? "default" : "outline"}>
                      {appUser?.referralIncomeEligible ? "Eligible" : "Not eligible"}
                    </Badge>
                  </DetailRow>
                </Section>

                <Separator />

                <Section title="Wallet & earnings">
                  <DetailRow label="Balance">
                    {formatBDT(appUser?.balance ?? 0)}
                  </DetailRow>
                  <DetailRow label="Total earned">
                    {formatBDT(appUser?.totalEarned ?? 0)}
                  </DetailRow>
                  <DetailRow label="Agent / reseller feature">
                    <Badge variant={appUser?.canEarn ? "default" : "outline"}>
                      {appUser?.canEarn ? "Enabled" : "Disabled"}
                    </Badge>
                  </DetailRow>
                </Section>

                <Separator />

                <Section title="Account activity">
                  <DetailRow label="Registered">
                    {formatDateTime(user.createdAt)}
                  </DetailRow>
                  <DetailRow label="Last updated">
                    {formatDateTime(user.updatedAt)}
                  </DetailRow>
                  <DetailRow label="Last login">
                    {appUser?.lastLogin ? formatDateTime(appUser.lastLogin) : "Never"}
                  </DetailRow>
                  <DetailRow label="Member since">
                    {formatDate(user.createdAt)}
                  </DetailRow>
                </Section>

                <Separator />

                <section className="space-y-2">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <History className="size-3.5" />
                    Transaction history
                  </h3>
                  <div className="flex items-start gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      The backend does not yet expose an admin endpoint for another
                      user&apos;s wallet transactions, so this section is
                      intentionally omitted rather than faked.
                    </span>
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
