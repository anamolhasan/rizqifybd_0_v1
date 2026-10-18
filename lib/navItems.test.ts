import { describe, expect, it } from "vitest";

import { ALL_ROLES } from "@/types/enums";

import { canAccessRouteOwner, getRouteOwner } from "./authUtils";
import { getDashboardPageTitle } from "./dashboardNav";
import { getIconComponent } from "./iconMapper";
import { getCommonNavItems, getStaffNavItems } from "./navItems";
import type { NavItem, NavSection } from "@/types/dashboard.types";
import type { Role } from "@/types/enums";

function collectHrefs(
  sections: ReturnType<typeof getStaffNavItems>,
): string[] {
  return sections.flatMap((section) =>
    section.items.flatMap((item) => [
      item.href,
      ...(item.children?.map((child) => child.href) ?? []),
    ]),
  );
}

function flattenItems(sections: NavSection[]): NavItem[] {
  return sections.flatMap((section) =>
    section.items.flatMap((item) => [
      item,
      ...(item.children ? flattenItems([{ items: item.children }]) : []),
    ]),
  );
}

const OPERATORS_HREF = "/admin/dashboard/operators-management";

// Expected operator submenu for a role that can see every operator route.
const ALL_OPERATOR_CHILD_HREFS = [
  OPERATORS_HREF,
  `${OPERATORS_HREF}?action=new`,
  "/admin/dashboard/operator-offers",
  "/admin/dashboard/orders-management",
];

function operatorGroup(role: Role | undefined) {
  for (const section of getStaffNavItems(role)) {
    for (const item of section.items) {
      if (item.href === OPERATORS_HREF) return item;
    }
  }
  return null;
}

function operatorChildHrefs(role: Role | undefined): string[] {
  return operatorGroup(role)?.children?.map((child) => child.href) ?? [];
}

describe("operator navigation group", () => {
  it("groups the four operator routes for a content admin", () => {
    expect(operatorChildHrefs("ADMIN")).toEqual(ALL_OPERATOR_CHILD_HREFS);
  });

  it("keeps ORDER_STAFF_ROLES visibility for Operator Orders only", () => {
    for (const role of ["MODERATOR", "SUPPORTER", "EMPLOYEE"] as Role[]) {
      expect(operatorChildHrefs(role)).toEqual([
        "/admin/dashboard/orders-management",
      ]);
    }
  });

  it("hides the group while the session role is unresolved", () => {
    expect(operatorGroup(undefined)).toBeNull();
  });
});

describe("nested page titles", () => {
  const sections = getStaffNavItems("ADMIN");

  it.each([
    [OPERATORS_HREF, "adminNav.operatorManagement"],
    ["/admin/dashboard/operator-offers", "adminNav.telecomOffers"],
    ["/admin/dashboard/orders-management", "adminNav.operatorOrders"],
    ["/admin/dashboard", "adminNav.overview"],
  ])("resolves %s to %s", (pathname, titleKey) => {
    expect(getDashboardPageTitle(pathname, sections)).toBe(titleKey);
  });
});

describe("affiliate navigation", () => {
  it("shows the affiliate programme entry to every authenticated role", () => {
    // The programme page carries the application form, and the shared list is
    // merged into the staff navigation too, so any signed-in role can reach it
    // (the API allows every role to apply).
    expect(collectHrefs(getCommonNavItems())).toContain("/affiliate");
    expect(collectHrefs(getStaffNavItems("ADMIN"))).toContain("/affiliate");
  });

  it("shows affiliate applications management to admins", () => {
    expect(collectHrefs(getStaffNavItems("ADMIN"))).toContain(
      "/admin/dashboard/affiliate-applications-management",
    );
  });

  it("hides affiliate applications management from non-admin staff", () => {
    expect(collectHrefs(getStaffNavItems("SUPPORTER"))).not.toContain(
      "/admin/dashboard/affiliate-applications-management",
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Shared navigation targets
// ─────────────────────────────────────────────────────────────────────────────
// The common navigation is shown to every authenticated account, so every route
// it links to must be one every role is actually allowed to reach. A link that
// the middleware immediately redirects away from is a navigation bug.
describe("shared navigation targets", () => {
  const hrefs = collectHrefs(getCommonNavItems());
  const items = flattenItems(getCommonNavItems());

  function hrefFor(titleKey: string): string | undefined {
    return items.find((item) => item.titleKey === titleKey)?.href;
  }

  it("points each programme entry at the right kind of route", () => {
    // "My … Dashboard" entries must open the authenticated dashboard, never the
    // same-named public programme page (that is what made the labels misleading).
    expect(hrefFor("dashboardNav.myAgentDashboard")).toBe("/dashboard/agent");
    expect(hrefFor("dashboardNav.myAffiliateDashboard")).toBe(
      "/dashboard/affiliate",
    );
    expect(hrefFor("dashboardNav.myReferralDashboard")).toBe(
      "/dashboard/my-referrals",
    );

    // "Join …" entries open the programme page, which carries the application form
    // and stays reachable without a session.
    expect(hrefFor("dashboardNav.joinAgent")).toBe("/agent");
    expect(hrefFor("dashboardNav.joinAffiliate")).toBe("/affiliate");
    expect(hrefFor("dashboardNav.joinReferral")).toBe("/referral");
  });

  it("keeps the programme pages public and the dashboards session-only", () => {
    for (const href of ["/agent", "/affiliate", "/referral"]) {
      expect(getRouteOwner(href)).toBeNull();
      expect(canAccessRouteOwner(undefined, getRouteOwner(href))).toBe(true);
    }

    for (const href of [
      "/dashboard/agent",
      "/dashboard/affiliate",
      "/dashboard/my-referrals",
    ]) {
      expect(getRouteOwner(href)).toBe("COMMON");
      expect(canAccessRouteOwner(undefined, getRouteOwner(href))).toBe(false);
    }
  });

  it("keeps the application routes open to every role", () => {
    // The apply call-to-action lives on the programme pages and programme
    // dashboards (AgentProgram / AffiliateProgram / AgentBadge / AffiliateBadge),
    // so both routes must stay reachable for every signed-in role.
    expect(getRouteOwner("/dashboard/agent-application")).toBe("COMMON");
    expect(getRouteOwner("/dashboard/affiliate-application")).toBe("COMMON");
  });

  it("only exposes routes every authenticated role may reach", () => {
    for (const href of hrefs) {
      const owner = getRouteOwner(href.split("?")[0]);

      for (const role of ALL_ROLES) {
        expect(
          canAccessRouteOwner(role, owner),
          `${href} is unreachable for ${role}`,
        ).toBe(true);
      }
    }
  });

  it("requires a session for every protected shared target", () => {
    for (const href of hrefs) {
      const pathname = href.split("?")[0];
      const owner = getRouteOwner(pathname);

      // Only a genuinely public route may be reachable while logged out.
      expect(
        canAccessRouteOwner(undefined, owner),
        `${pathname} unexpectedly needs no session`,
      ).toBe(owner === null);
    }
  });

  it("is merged into the staff navigation unchanged", () => {
    for (const href of hrefs) {
      expect(collectHrefs(getStaffNavItems("SUPER_ADMIN"))).toContain(href);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Icon names
// ─────────────────────────────────────────────────────────────────────────────
describe("navigation icons", () => {
  const items = [
    ...flattenItems(getCommonNavItems()),
    ...flattenItems(getStaffNavItems("SUPER_ADMIN")),
  ];

  it("uses canonical lowercase icon names", () => {
    for (const item of items) {
      expect(item.icon, `${item.titleKey} uses "${item.icon}"`).toBe(
        item.icon.toLowerCase(),
      );
    }
  });

  it("resolves every navigation icon to a real icon", () => {
    // `getIconComponent` falls back to Activity for an unknown name, so a mapped
    // icon must differ from that fallback.
    const fallback = getIconComponent("__missing__");

    for (const item of items) {
      expect(getIconComponent(item.icon), `${item.icon} is not mapped`).not.toBe(
        fallback,
      );
    }
  });
});
