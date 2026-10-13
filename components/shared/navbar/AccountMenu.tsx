"use client";

import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getIconComponent } from "@/lib/iconMapper";
import { getCommonNavItems } from "@/lib/navItems";
import { isStaffRole, type Role } from "@/types/enums";

export function AccountMenu() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden h-9 w-20 animate-pulse rounded-lg bg-muted md:block" />
        <span className="size-9 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={t("common.signIn")}
        >
          <Link href="/login">
            <UserRound />
          </Link>
        </Button>
        <Button asChild variant="outline" className="hidden md:inline-flex">
          <Link href="/login">{t("common.signIn")}</Link>
        </Button>
        <Button
          asChild
          className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex"
        >
          <Link href="/sign-up">{t("common.signUp")}</Link>
        </Button>
      </div>
    );
  }

  const role = user.role as Role;
  const dashboardHref = getDefaultDashboardRoute(role);
  const dashboardLabel = isStaffRole(role)
    ? t("nav.adminDashboard")
    : t("nav.dashboard");
  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();
  // Shared navigation shown to every authenticated user, regardless of role.
  const commonSections = getCommonNavItems();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 gap-1.5 rounded-full px-1.5 md:px-2"
          aria-label={t("common.accountMenu")}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-slate-950">
            {initial}
          </span>
          <span className="hidden max-w-28 truncate text-sm font-medium md:block">
            {user.name ?? t("common.defaultAccount")}
          </span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <p className="truncate text-sm font-medium">
              {user.name ?? t("common.defaultUser")}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-primary capitalize">
              {role.toLowerCase().replace(/_/g, " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="flex w-full items-center gap-2">
            <LayoutDashboard />
            {dashboardLabel}
          </Link>
        </DropdownMenuItem>

        {commonSections.map((section, index) => (
          <DropdownMenuGroup key={section.titleKey ?? `common-${index}`}>
            <DropdownMenuSeparator />
            {section.titleKey ? (
              <DropdownMenuLabel>{t(section.titleKey)}</DropdownMenuLabel>
            ) : null}
            {section.items.map((item) => {
              const Icon = getIconComponent(item.icon);
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-2"
                  >
                    <Icon />
                    {t(item.titleKey)}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        ))}

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between gap-2 px-1.5 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {t("theme.label")}
          </span>
          <ThemeSwitcher />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
          {logout.isPending ? t("common.signingOut") : t("common.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
