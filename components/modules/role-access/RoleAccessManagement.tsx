"use client";

import { AlertCircle, Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import { RoleAccessMatrix } from "./RoleAccessMatrix";

export function RoleAccessManagement() {
  const t = useTranslations("admin.roleAccess");
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <RoleAccessLoading />;
  }

  // Server-side enforcement arrives with the permission persistence step. Until
  // then this mirrors the existing SUPER_ADMIN-only Settings page: the nav hides
  // the item and this client gate hides the content. It is not a security
  // boundary on its own.
  if (currentUser?.role !== "SUPER_ADMIN") {
    return (
      <div className="space-y-6">
        <PageHeader title={t("title")} description={t("description")} />
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("notAuthorized.title")}</AlertTitle>
          <AlertDescription>{t("notAuthorized.description")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />

      <Alert>
        <Lock />
        <AlertTitle>{t("readOnly.title")}</AlertTitle>
        <AlertDescription>{t("readOnly.description")}</AlertDescription>
      </Alert>

      <RoleAccessMatrix />

      <Card>
        <CardContent className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{t("footerNote")}</span>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleAccessLoading() {
  const t = useTranslations("admin.roleAccess");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <Card>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </CardContent>
      </Card>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
