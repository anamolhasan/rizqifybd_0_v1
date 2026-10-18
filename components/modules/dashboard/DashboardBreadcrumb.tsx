"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCurrentUser } from "@/hooks/use-auth";
import {
  getDashboardHome,
  getDashboardNavItems,
  getDashboardPageTitle,
} from "@/lib/dashboardNav";
import type { Role } from "@/types/enums";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations();
  const { data: currentUser } = useCurrentUser();

  const role = currentUser?.role as Role | undefined;
  const navSections = getDashboardNavItems(role, pathname);
  const pageTitleKey = getDashboardPageTitle(pathname, navSections);
  const homeHref = getDashboardHome(pathname);
  // Routes without a dedicated nav entry fall back to the dashboard title; show
  // a single crumb instead of a duplicated "Dashboard / Dashboard".
  const showCurrentPage = pageTitleKey !== "nav.dashboard";

  return (
    <nav aria-label={t("nav.breadcrumb")} className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        <li className="min-w-0">
          {showCurrentPage ? (
            <Link
              href={homeHref}
              className="truncate text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <span className="truncate font-medium text-foreground">
              {t("nav.dashboard")}
            </span>
          )}
        </li>
        {showCurrentPage ? (
          <>
            <li aria-hidden="true" className="shrink-0 text-muted-foreground/60">
              <ChevronRight className="size-3.5" />
            </li>
            <li className="min-w-0 truncate font-medium text-foreground">
              {t(pageTitleKey)}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
