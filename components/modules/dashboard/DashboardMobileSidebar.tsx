"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { BrandLogo } from "@/components/auth/BrandLogo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/use-auth";
import { getDashboardHome, getDashboardNavItems } from "@/lib/dashboardNav";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/enums";

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
        <BrandLogo href={dashboardHome} />
      </div>

      <SheetTitle className="sr-only">{t("nav.mobileNavigation")}</SheetTitle>

      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.titleKey ? (
                <h4 className="mb-2 px-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  {t(section.titleKey)}
                </h4>
              ) : null}

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = getIconComponent(item.icon);
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{t(item.titleKey)}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionIndex < navSections.length - 1 ? (
                <Separator className="my-4" />
              ) : null}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {displayName}
            </p>
            {currentUser?.role ? (
              <p className="truncate text-xs text-muted-foreground capitalize">
                {currentUser.role.toLowerCase().replace("_", " ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}