import { getRouteOwner } from "@/lib/authUtils";
import {
  DASHBOARD_CUSTOMER_HOME,
  DASHBOARD_STAFF_HOME,
} from "@/lib/constants";
import { getCustomerNavItems, getStaffNavItems } from "@/lib/navItems";
import type { NavSection } from "@/types/dashboard.types";
import type { Role } from "@/types/enums";

const DEFAULT_STAFF_ROLE: Role = "ADMIN";
const DEFAULT_CUSTOMER_ROLE: Role = "USER";

export interface DashboardSession {
  name: string;
  email: string;
  role: Role;
  image: string | null;
}

const STAFF_SESSION: DashboardSession = {
  name: "Admin User",
  email: "admin@rizqifybd.com",
  role: "ADMIN",
  image: null,
};

const CUSTOMER_SESSION: DashboardSession = {
  name: "RizqifyBD User",
  email: "user@rizqifybd.com",
  role: "USER",
  image: null,
};

function isStaffDashboard(pathname: string): boolean {
  return getRouteOwner(pathname) === "STAFF";
}

export function getDashboardHome(pathname: string): string {
  return isStaffDashboard(pathname)
    ? DASHBOARD_STAFF_HOME
    : DASHBOARD_CUSTOMER_HOME;
}

export function getDashboardSession(pathname: string): DashboardSession {
  return isStaffDashboard(pathname) ? STAFF_SESSION : CUSTOMER_SESSION;
}

export function getDashboardNavItems(pathname: string): NavSection[] {
  if (isStaffDashboard(pathname)) {
    return getStaffNavItems(DEFAULT_STAFF_ROLE);
  }
  return getCustomerNavItems(DEFAULT_CUSTOMER_ROLE);
}

export function getDashboardPageTitle(
  pathname: string,
  sections: NavSection[],
): string {
  for (const section of sections) {
    const item = section.items.find((entry) => entry.href === pathname);
    if (item) return item.title;
  }
  return "Dashboard";
}