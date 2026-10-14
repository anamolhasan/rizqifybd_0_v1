"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, RefreshCcw, Save, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleLabel } from "@/components/modules/users/user.constants";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useReferralDefaultSetting,
  useUpdateReferralDefaultSetting,
} from "@/hooks/use-settings";
import { useUsersSearch } from "@/hooks/use-users";
import { cn } from "@/lib/utils";
import type { IUser } from "@/types/user.types";

export function ReferralDefaultSetting() {
  const t = useTranslations("admin.settings.referralSettings");
  const { data: currentUser, isLoading: isRoleLoading } = useCurrentUser();

  if (isRoleLoading) {
    return <SettingsLoading />;
  }

  if (currentUser?.role !== "SUPER_ADMIN") {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("notAuthorizedTitle")}</AlertTitle>
          <AlertDescription>
            {t("notAuthorizedDescription")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <DefaultReferralManager />;
}

function SettingsLoading() {
  const t = useTranslations("admin.settings.referralSettings");
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      <Card>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardContent>
      </Card>
    </div>
  );
}

function DefaultReferralManager() {
  const t = useTranslations("admin.settings.referralSettings");
  const {
    data: setting,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useReferralDefaultSetting();
  const updateSetting = useUpdateReferralDefaultSetting();
  const te = useTranslations("enums");

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: results,
    isFetching: isSearching,
    isError: isSearchError,
  } = useUsersSearch(query);

  const candidates = (results ?? []).filter(
    (user) => user.appUser?.referralCode,
  );

  const currentCode = setting?.referralCode ?? null;
  const selectedCode = selected?.appUser?.referralCode ?? null;
  const canSave =
    Boolean(selectedCode) &&
    selectedCode !== currentCode &&
    !updateSetting.isPending;

  const handleSave = () => {
    if (!selectedCode) return;
    updateSetting.mutate(
      { referralCode: selectedCode },
      {
        onSuccess: () => {
          setSelected(null);
          setSearchInput("");
          setQuery("");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("currentDefaultReferrer")}</CardTitle>
          <CardDescription>
            {t("currentDefaultDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{t("couldNotLoad")}</AlertTitle>
              <AlertDescription>{error?.message}</AlertDescription>
              <AlertAction>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCcw
                    className={cn("size-4", isFetching && "animate-spin")}
                  />
                  {t("retry")}
                </Button>
              </AlertAction>
            </Alert>
          ) : setting?.referrer && currentCode ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{setting.referrer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {setting.referrer.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {getRoleLabel(setting.referrer.role, te)}
                </Badge>
                <Badge variant="outline">{currentCode}</Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("noDefaultConfigured")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("setDefaultValue")}</CardTitle>
          <CardDescription>
            {t("setDefaultDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-9"
            />
          </div>

          {query.length > 0 ? (
            <div className="overflow-hidden rounded-xl border">
              {isSearching && candidates.length === 0 ? (
                <div className="space-y-2 p-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : isSearchError ? (
                <p className="p-3 text-sm text-destructive">
                  {t("searchError")}
                </p>
              ) : candidates.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">
                  {t("noCandidates")}
                </p>
              ) : (
                <ul className="divide-y">
                  {candidates.map((user) => {
                    const code = user.appUser?.referralCode ?? "";
                    const isSelected = selected?.id === user.id;
                    return (
                      <li key={user.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(user)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                            isSelected && "bg-muted",
                          )}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {user.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <Badge variant="secondary">
                              {getRoleLabel(user.role, te)}
                            </Badge>
                            <Badge variant="outline">{code}</Badge>
                            {isSelected ? (
                              <Check className="size-4 text-primary" />
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : null}

          {selected ? (
            <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{selected.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {selected.email}
                </p>
              </div>
              <Badge variant="outline">
                {selected.appUser?.referralCode}
              </Badge>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {currentCode
                ? `${t("currentDefault")}: ${currentCode}`
                : t("noDefaultYet")}
            </p>
            <Button onClick={handleSave} disabled={!canSave}>
              {updateSetting.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {t("saveDefault")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}