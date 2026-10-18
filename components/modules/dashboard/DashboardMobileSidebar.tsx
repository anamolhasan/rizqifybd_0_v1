"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { BrandLogo } from "@/components/auth/BrandLogo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/use-auth";
import { getDashboardHome, getDashboardNavItems } from "@/lib/dashboardNav";
import type { Role } from "@/types/enums";
import { DashboardNavList } from "./DashboardNavList";

export function DashboardMobileSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { data: currentUser } = useCurrentUser();

  const role = currentUser?.role as Role | undefined;
  const navSections = getDashboardNavItems(role, pathname);
  const dashboardHome = getDashboardHome(pathname);
  const displayName = currentUser?.name ?? t("common.account");

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-6">
        <BrandLogo href={dashboardHome} tone="inverted" />
      </div>

      <SheetTitle className="sr-only">{t("nav.mobileNavigation")}</SheetTitle>

      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <DashboardNavList sections={navSections} />
      </ScrollArea>

      <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-foreground">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {displayName}
            </p>
            {currentUser?.role ? (
              <p className="truncate text-xs text-sidebar-foreground/60 capitalize">
                {currentUser.role.toLowerCase().replace("_", " ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
