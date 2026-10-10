import { Role, isStaffRole } from "@/types/enums";

import {
  DASHBOARD_CUSTOMER_HOME,
  DASHBOARD_STAFF_HOME,
  LOGIN_ROUTE,
} from "./constants";

export type RouteOwner = "STAFF" | "CUSTOMER" | "COMMON";

const IS_AUTH_ROUTES = new Set([
  LOGIN_ROUTE,
  "/sign-up",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

const STAFF_PROTECTED_PATTERNS: RegExp[] = [/^\/admin\/dashboard/];

const CUSTOMER_PROTECTED_PATTERNS: RegExp[] = [/^\/dashboard/];

const COMMON_PROTECTED_ROUTES = new Set(["/my-profile", "/change-password"]);

export function isAuthRoute(pathname: string): boolean {
  return IS_AUTH_ROUTES.has(pathname);
}

export function isPublicRoute(pathname: string): boolean {
  return pathname === "/" || IS_AUTH_ROUTES.has(pathname);
}

export function getRouteOwner(pathname: string): RouteOwner | null {
  if (COMMON_PROTECTED_ROUTES.has(pathname)) return "COMMON";
  if (STAFF_PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return "STAFF";
  }
  if (CUSTOMER_PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return "CUSTOMER";
  }
  return null;
}

export function canAccessRouteOwner(
  role: Role | undefined,
  owner: RouteOwner | null,
): boolean {
  if (owner === null) return true;
  if (owner === "COMMON") return Boolean(role);
  if (owner === "STAFF") return isStaffRole(role);
  return role !== undefined && (role === "USER" || role === "AGENT");
}

export function getDefaultDashboardRoute(role: Role | undefined): string {
  return isStaffRole(role) ? DASHBOARD_STAFF_HOME : DASHBOARD_CUSTOMER_HOME;
}

export function getLoginRedirect(role: Role | undefined): string {
  return getDefaultDashboardRoute(role);
}