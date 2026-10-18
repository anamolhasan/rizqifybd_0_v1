import { describe, expect, it } from "vitest";

import { ALL_ROLES, STAFF_ROLES } from "@/types/enums";

import {
  canAccessRouteOwner,
  getRouteOwner,
  isAuthRoute,
} from "./authUtils";

// Every route the shared (common) navigation links to. Its documented contract is
// that each one is reachable by *every* signed-in account, whatever its role —
// the backend exposes the matching endpoints with a plain `checkAuth()`.
const SHARED_ROUTES = [
  "/my-profile",
  "/change-password",
  "/dashboard/my-referrals",
  "/dashboard/agent",
  "/dashboard/agent-application",
  "/dashboard/affiliate",
  "/dashboard/affiliate-application",
  "/dashboard/my-orders",
  "/dashboard/my-orders/order-1",
  "/dashboard/new-orders",
  "/dashboard/my-wallet",
  "/dashboard/my-withdrawals",
];

describe("public programme pages", () => {
  it.each(["/agent", "/affiliate", "/referral"])(
    "leaves %s reachable without a session",
    (pathname) => {
      expect(getRouteOwner(pathname)).toBeNull();
      expect(canAccessRouteOwner(undefined, getRouteOwner(pathname))).toBe(true);
    },
  );
});

describe("shared authenticated routes", () => {
  it.each(SHARED_ROUTES)("classifies %s as COMMON", (pathname) => {
    expect(getRouteOwner(pathname)).toBe("COMMON");
  });

  it.each(SHARED_ROUTES)("allows every role to reach %s", (pathname) => {
    const owner = getRouteOwner(pathname);

    for (const role of ALL_ROLES) {
      expect(canAccessRouteOwner(role, owner)).toBe(true);
    }
  });

  it.each(SHARED_ROUTES)("still requires a session for %s", (pathname) => {
    expect(canAccessRouteOwner(undefined, getRouteOwner(pathname))).toBe(false);
  });

  it("treats the order detail view like its parent list", () => {
    expect(getRouteOwner("/dashboard/my-orders")).toBe("COMMON");
    expect(getRouteOwner("/dashboard/my-orders/abc")).toBe("COMMON");
  });
});

describe("staff RBAC is preserved", () => {
  it("keeps the whole admin panel staff-only", () => {
    expect(getRouteOwner("/admin/dashboard")).toBe("STAFF");
    expect(getRouteOwner("/admin/dashboard/users-management")).toBe("STAFF");
    expect(
      getRouteOwner("/admin/dashboard/users-management/role-access"),
    ).toBe("STAFF");

    for (const role of STAFF_ROLES) {
      expect(canAccessRouteOwner(role, "STAFF")).toBe(true);
    }

    expect(canAccessRouteOwner("USER", "STAFF")).toBe(false);
    expect(canAccessRouteOwner(undefined, "STAFF")).toBe(false);
  });

  it("keeps the customer dashboard customer-only", () => {
    expect(getRouteOwner("/dashboard")).toBe("CUSTOMER");
    expect(canAccessRouteOwner("USER", "CUSTOMER")).toBe(true);
    expect(canAccessRouteOwner("ADMIN", "CUSTOMER")).toBe(false);
    expect(canAccessRouteOwner("MODERATOR", "CUSTOMER")).toBe(false);
  });
});

describe("route ownership", () => {
  it("treats the login flow as an auth route", () => {
    expect(isAuthRoute("/login")).toBe(true);
    expect(getRouteOwner("/login")).toBeNull();
  });

  it("leaves genuinely public marketing routes unguarded", () => {
    for (const pathname of ["/", "/services", "/features", "/faq"]) {
      expect(getRouteOwner(pathname)).toBeNull();
    }
  });
});
