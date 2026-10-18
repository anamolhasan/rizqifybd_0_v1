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

// Routes every authenticated account may reach, whatever its role. The backend
// exposes these endpoints to any signed-in user (`checkAuth()` with no role
// restriction): every role can apply for every programme, place orders, keep a
// wallet and withdraw what it earns. The frontend guard must therefore not be
// stricter than the API, otherwise the shared navigation would advertise pages
// the middleware immediately bounces the user away from.
//
// The public programme pages (`/agent`, `/affiliate`, `/referral`) are
// deliberately absent here: they live in the public segment and must stay
// reachable without a session.
const COMMON_PROTECTED_PATTERNS: RegExp[] = [
  /^\/my-profile$/,
  /^\/change-password$/,
  /^\/dashboard\/my-referrals$/,
  /^\/dashboard\/agent$/,
  /^\/dashboard\/agent-application$/,
  /^\/dashboard\/affiliate$/,
  /^\/dashboard\/affiliate-application$/,
  // The order detail view shares its parent's ownership.
  /^\/dashboard\/my-orders(?:\/|$)/,
  /^\/dashboard\/new-orders$/,
  /^\/dashboard\/my-wallet$/,
  /^\/dashboard\/my-withdrawals$/,
];

export function isAuthRoute(pathname: string): boolean {
  return IS_AUTH_ROUTES.has(pathname);
}

export function isPublicRoute(pathname: string): boolean {
  return pathname === "/" || IS_AUTH_ROUTES.has(pathname);
}

export function getRouteOwner(pathname: string): RouteOwner | null {
  // COMMON is checked first so a shared route under `/dashboard` is not captured
  // by the broader customer pattern below.
  if (COMMON_PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return "COMMON";
  }
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
  return role === "USER";
}

export function getDefaultDashboardRoute(role: Role | undefined): string {
  return isStaffRole(role) ? DASHBOARD_STAFF_HOME : DASHBOARD_CUSTOMER_HOME;
}

export function getLoginRedirect(role: Role | undefined): string {
  return getDefaultDashboardRoute(role);
}