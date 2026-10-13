"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Headphones,
  Key,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Phone,
  Tag,
  User,
} from "lucide-react";

import { BrandLogo } from "@/components/auth/BrandLogo";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategories } from "@/hooks/use-categories";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { isStaffRole, type Role } from "@/types/enums";
import { cn } from "@/lib/utils";

import {
  PUBLIC_NAV_LINKS,
  SERVICES_ROUTE,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from "./nav-config";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  const { data: categoriesData } = useCategories();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const categories = categoriesData?.data ?? [];
  const role = user?.role as Role | undefined;
  const dashboardHref = getDefaultDashboardRoute(role);
  const dashboardLabel = isStaffRole(role)
    ? t("nav.adminDashboard")
    : t("nav.dashboard");

  function isActive(href: string, match: "exact" | "prefix") {
    if (match === "exact") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={t("nav.openMenu")}
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-sm gap-0 p-0">
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-3 pr-12">
          <SheetTitle className="sr-only">
            {t("nav.mobileNavigation")}
          </SheetTitle>
          <BrandLogo href="/" />
          <ThemeSwitcher />
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-3">
            <nav aria-label={t("nav.mobileNavigation")} className="space-y-0.5">
              {PUBLIC_NAV_LINKS.map((link) => {
                const active = isActive(link.href, link.match);
                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </SheetClose>
                );
              })}

              <button
                type="button"
                onClick={() => setCategoriesOpen((value) => !value)}
                aria-expanded={categoriesOpen}
                aria-controls="mobile-categories"
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <Tag className="size-4" />
                  {t("nav.categories")}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    categoriesOpen && "rotate-180",
                  )}
                />
              </button>

              {categoriesOpen ? (
                <div id="mobile-categories" className="space-y-0.5 py-1 pl-6">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SheetClose asChild key={category.id}>
                        <Link
                          href={SERVICES_ROUTE}
                          className="block truncate rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {category.title}
                        </Link>
                      </SheetClose>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      {t("nav.categoriesUnavailable")}
                    </p>
                  )}
                  <SheetClose asChild>
                    <Link
                      href={SERVICES_ROUTE}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
                    >
                      {t("nav.allServices")}
                    </Link>
                  </SheetClose>
                </div>
              ) : null}
            </nav>

            <Separator className="my-3" />

            <div className="space-y-1 px-1 text-xs text-muted-foreground">
              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:text-foreground"
              >
                <Phone className="size-3.5 text-primary" />
                {SUPPORT_PHONE}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5 text-primary" />
                {SUPPORT_EMAIL}
              </a>
            </div>          </div>
        </ScrollArea>

        <div className="border-t border-border p-3">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-1 py-1">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-slate-950">
                  {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.name ?? t("common.defaultUser")}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-0.5">
                <SheetClose asChild>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LayoutDashboard className="size-4" />
                    {dashboardLabel}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/my-profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <User className="size-4" />
                    {t("common.profile")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/change-password"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Key className="size-4" />
                    {t("common.changePassword")}
                  </Link>
                </SheetClose>
                <button
                  type="button"
                  disabled={logout.isPending}
                  onClick={() => {
                    logout.mutate();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                >
                  {logout.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  {logout.isPending ? t("common.signingOut") : t("common.signOut")}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <SheetClose asChild>
                <Button asChild variant="outline">
                  <Link href="/login">{t("common.signIn")}</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/sign-up">{t("common.signUp")}</Link>
                </Button>
              </SheetClose>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <Headphones className="size-3.5 text-primary" />
            {t("nav.customerSupport")}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
