import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildCookieHeader, refreshTokensOnServer, type RefreshedTokens } from "@/lib/auth-server";
import {
  canAccessRouteOwner,
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isPublicRoute,
} from "@/lib/authUtils";
import {
  ACCESS_TOKEN_COOKIE,
  LOGIN_ROUTE,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
} from "@/lib/constants";
import { verifyAccessToken } from "@/lib/jwt";
import { getAccessTokenSecret } from "@/lib/proxy-env";
import { isTokenExpiringSoon } from "@/lib/tokenUtils";
import type { Role } from "@/types/enums";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};

function buildLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL(LOGIN_ROUTE, request.url);
  loginUrl.searchParams.set(
    "redirect",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

function attachRefreshedTokens(
  response: NextResponse,
  tokens: RefreshedTokens | null,
): NextResponse {
  if (!tokens) return response;

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  response.cookies.set(SESSION_TOKEN_COOKIE, tokens.sessionToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  return response;
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const owner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    let role: Role | undefined;
    let refreshedTokens: RefreshedTokens | null = null;

    if (accessToken) {
      const verified = verifyAccessToken(accessToken, getAccessTokenSecret());

      if (verified.success) {
        role = verified.data.role;

        if (refreshToken && isTokenExpiringSoon(accessToken)) {
          refreshedTokens = await refreshTokensOnServer(
            buildCookieHeader(request.cookies.getAll()),
          );
          if (refreshedTokens) {
            role = refreshedTokens.role as Role;
          }
        }
      } else if (refreshToken) {
        refreshedTokens = await refreshTokensOnServer(
          buildCookieHeader(request.cookies.getAll()),
        );
        if (refreshedTokens) {
          role = refreshedTokens.role as Role;
        }
      }
    }

    // Logged-in users should not access auth pages.
    if (isAuth && role) {
      return attachRefreshedTokens(
        NextResponse.redirect(new URL(getDefaultDashboardRoute(role), request.url)),
        refreshedTokens,
      );
    }

    // Public routes and auth pages (for logged-out users).
    if (isPublicRoute(pathname) || owner === null) {
      return attachRefreshedTokens(NextResponse.next(), refreshedTokens);
    }

    // Protected route without a valid session -> send to login.
    if (!role) {
      return buildLoginRedirect(request);
    }

    // Role mismatch -> send to the user's own dashboard.
    if (!canAccessRouteOwner(role, owner)) {
      return attachRefreshedTokens(
        NextResponse.redirect(new URL(getDefaultDashboardRoute(role), request.url)),
        refreshedTokens,
      );
    }

    return attachRefreshedTokens(NextResponse.next(), refreshedTokens);
  } catch (error) {
    console.error("Error in proxy:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};