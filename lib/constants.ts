export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api/v1";

export const SERVER_ORIGIN =
  process.env.API_PROXY_TARGET?.replace(/\/$/, "") ?? "http://localhost:5000";

export const SERVER_API_BASE_URL = `${SERVER_ORIGIN}${API_BASE_URL}`;

export const SERVER_AUTH_BASE_URL = `${SERVER_ORIGIN}/api/auth`;

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const SESSION_TOKEN_COOKIE = "better-auth.session_token";

export const AUTH_COOKIE_NAMES = [
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
] as const;

export const DASHBOARD_STAFF_HOME = "/admin/dashboard";
export const DASHBOARD_CUSTOMER_HOME = "/dashboard";
export const LOGIN_ROUTE = "/login";

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_SORT_ORDER = "asc" as const;