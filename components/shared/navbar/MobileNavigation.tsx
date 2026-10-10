"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { ModeToggle } from "@/components/theme/ModeToggle";
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

  const { data: categoriesData } = useCategories();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const categories = categoriesData?.data ?? [];
  const role = user?.role as Role | undefined;
  const dashboardHref = getDefaultDashboardRoute(role);
  const dashboardLabel = isStaffRole(role) ? "অ্যাডমিন ড্যাশবোর্ড" : "ড্যাশবোর্ড";

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
          aria-label="নেভিগেশন মেনু খুলুন"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-sm gap-0 p-0">
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-3 pr-12">
          <SheetTitle asChild>
            <BrandLogo href="/" />
          </SheetTitle>
          <ModeToggle />
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-3">
            <nav aria-label="মোবাইল নেভিগেশন" className="space-y-0.5">
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
                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {link.label}
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
                  ক্যাটাগরি
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
                      ক্যাটাগরি তালিকা বর্তমানে উপলব্ধ নয়।
                    </p>
                  )}
                  <SheetClose asChild>
                    <Link
                      href={SERVICES_ROUTE}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-muted dark:text-sky-400"
                    >
                      সব সেবা দেখুন
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
                <Phone className="size-3.5 text-sky-500" />
                {SUPPORT_PHONE}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5 text-sky-500" />
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-border p-3">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-1 py-1">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-slate-950">
                  {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.name ?? "RizqifyBD ব্যবহারকারী"}
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
                    আমার প্রোফাইল
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/change-password"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Key className="size-4" />
                    পাসওয়ার্ড পরিবর্তন
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
                  {logout.isPending ? "সাইন আউট হচ্ছে..." : "লগ আউট"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <SheetClose asChild>
                <Button asChild variant="outline">
                  <Link href="/login">লগ ইন</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
                  <Link href="/sign-up">সাইন আপ</Link>
                </Button>
              </SheetClose>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <Headphones className="size-3.5 text-sky-500" />
            গ্রাহক সহায়তা
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
