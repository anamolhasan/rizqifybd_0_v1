import { getRouteOwner } from "@/lib/authUtils";
import {
  DASHBOARD_CUSTOMER_HOME,
  DASHBOARD_STAFF_HOME,
} from "@/lib/constants";
import {
  getCommonNavItems,
  getCustomerNavItems,
  getStaffNavItems,
} from "@/lib/navItems";
import { isStaffRole } from "@/types/enums";
import type { NavSection } from "@/types/dashboard.types";
import type { Role } from "@/types/enums";

export type DashboardAudience = "staff" | "customer";

function isStaffDashboard(pathname: string): boolean {
  return getRouteOwner(pathname) === "STAFF";
}

export function getDashboardHome(pathname: string): string {
  return isStaffDashboard(pathname)
    ? DASHBOARD_STAFF_HOME
    : DASHBOARD_CUSTOMER_HOME;
}

// The authenticated session role is the source of truth. While the session is
// still loading (role undefined) fall back to the current route's owner. On
// shared routes (e.g. /my-profile) the audience is unknown until the session
// resolves, so `null` is returned and only common navigation is shown.
export function resolveDashboardAudience(
  role: Role | undefined | null,
  pathname: string,
): DashboardAudience | null {
  if (isStaffRole(role)) return "staff";
  if (role) return "customer";

  const owner = getRouteOwner(pathname);
  if (owner === "STAFF") return "staff";
  if (owner === "CUSTOMER") return "customer";
  return null;
}

export function getDashboardNavItems(
  role: Role | undefined | null,
  pathname: string,
): NavSection[] {
  const audience = resolveDashboardAudience(role, pathname);
  if (audience === "staff") return getStaffNavItems(role);
  if (audience === "customer") return getCustomerNavItems();
  return getCommonNavItems();
}

// Returns the next-intl message key for the current page, resolved by the
// consuming component (e.g. "nav.dashboard" or "adminNav.overview").
export function getDashboardPageTitle(
  pathname: string,
  sections: NavSection[],
): string {
  for (const section of sections) {
    const item = section.items.find((entry) => entry.href === pathname);
    if (item) return item.titleKey;
  }
  return "nav.dashboard";
}
