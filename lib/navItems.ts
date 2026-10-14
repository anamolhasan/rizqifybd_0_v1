import {
  AGENT_APPLICATION_ACTORS,
  CONTENT_ADMIN_ROLES,
  FINANCE_ROLES,
  ORDER_STAFF_ROLES,
  ROLE_MANAGEMENT_ACTORS,
  WITHDRAWAL_STAFF_ROLES,
} from "@/types/enums";
import type { Role } from "@/types/enums";
import type { NavSection } from "@/types/dashboard.types";

// Navigation shared by every authenticated user, regardless of role. Items here
// must point at routes every signed-in user is allowed to reach. Titles are
// next-intl message keys resolved at render time so labels follow the locale.
const COMMON_NAV_SECTIONS: NavSection[] = [
  {
    titleKey: "dashboardNav.sections.account",
    items: [
      {
        titleKey: "dashboardNav.joinAgent",
        href: "/dashboard/agent-application",
        icon: "agents",
      },
      {
        titleKey: "dashboardNav.joinReferral",
        href: "/referral",
        icon: "referrals",
      },
      {
        titleKey: "dashboardNav.myReferrals",
        href: "/dashboard/my-referrals",
        icon: "referrals",
      },
      {
        titleKey: "common.profile",
        href: "/my-profile",
        icon: "user",
      },
      {
        titleKey: "common.changePassword",
        href: "/change-password",
        icon: "lock",
      },
      {
        titleKey: "dashboardNav.myOrders",
        href: "/dashboard/my-orders",
        icon: "orders",
      },
      {
        titleKey: "dashboardNav.newOrder",
        href: "/dashboard/new-orders",
        icon: "add",
      },
      {
        titleKey: "dashboardNav.myWallet",
        href: "/dashboard/my-wallet",
        icon: "wallet",
      },
      {
        titleKey: "dashboardNav.myWithdrawals",
        href: "/dashboard/my-withdrawals",
        icon: "withdrawals",
      },
    ],
  },
];

// Staff (admin panel) navigation. An item without `includedRoles` is visible to
// every staff role; otherwise only the listed roles see it. Role lists mirror the
// backend RBAC used by each module's route (see rizqifybd-server).
const STAFF_NAV_SECTIONS: NavSection[] = [
  {
    titleKey: "adminNav.sections.dashboard",
    items: [
      {
        titleKey: "adminNav.overview",
        href: "/admin/dashboard",
        icon: "dashboard",
      },
      {
        titleKey: "nav.home",
        href: "/",
        icon: "house",
      },
    ],
  },
  {
    titleKey: "adminNav.sections.management",
    items: [
      {
        titleKey: "adminNav.categoriesManagement",
        href: "/admin/dashboard/categories-management",
        icon: "offers",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
      {
        titleKey: "adminNav.ordersManagement",
        href: "/admin/dashboard/orders-management",
        icon: "orders",
        includedRoles: ORDER_STAFF_ROLES,
      },
      {
        titleKey: "adminNav.withdrawalsManagement",
        href: "/admin/dashboard/withdrawals-management",
        icon: "withdrawals",
        includedRoles: WITHDRAWAL_STAFF_ROLES,
      },
    ],
  },
  {
    titleKey: "adminNav.sections.telecom",
    items: [
      {
        titleKey: "adminNav.operators",
        href: "/admin/dashboard/operators-management",
        icon: "operators",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
      {
        titleKey: "adminNav.telecomOffers",
        href: "/admin/dashboard/operator-offers",
        icon: "offers",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
    ],
  },
  {
    titleKey: "adminNav.sections.administration",
    items: [
      {
        titleKey: "adminNav.userManagement",
        href: "/admin/dashboard/users-management",
        icon: "users",
        includedRoles: ROLE_MANAGEMENT_ACTORS,
      },
      {
        titleKey: "adminNav.roleAccess",
        href: "/admin/dashboard/users-management/role-access",
        icon: "shield",
        includedRoles: ["SUPER_ADMIN"],
      },
      {
        titleKey: "adminNav.walletsManagement",
        href: "/admin/dashboard/wallet-management",
        icon: "wallet",
        includedRoles: FINANCE_ROLES,
      },
      {
        titleKey: "adminNav.referralApplications",
        href: "/admin/dashboard/referral-applications-management",
        icon: "referrals",
        includedRoles: FINANCE_ROLES,
      },
      {
        titleKey: "adminNav.agentApplications",
        href: "/admin/dashboard/agent-applications-management",
        icon: "agents",
        includedRoles: AGENT_APPLICATION_ACTORS,
      },
      {
        titleKey: "adminNav.settings",
        href: "/admin/dashboard/settings",
        icon: "settings",
        includedRoles: ["SUPER_ADMIN"],
      },
    ],
  },
];

// Customer navigation. Every authenticated user sees every item here regardless
// of role, Agent status or Referral status, so no role filtering is applied.
const CUSTOMER_NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { titleKey: "nav.dashboard", href: "/dashboard", icon: "dashboard" },
      {
        titleKey: "nav.home",
        href: "/",
        icon: "House",
      },
    ],
  },
];

// Keeps items the role is allowed to see, then drops sections that become empty.
function filterSectionsByRole(
  sections: NavSection[],
  role: Role | undefined | null,
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !item.includedRoles ||
          (role ? item.includedRoles.includes(role) : false),
      ),
    }))
    .filter((section) => section.items.length > 0);
}

// Common navigation is intentionally unfiltered: every authenticated user sees
// every item regardless of role, Agent status or Referral status.
export function getCommonNavItems(): NavSection[] {
  return COMMON_NAV_SECTIONS;
}

// Staff navigation keeps its role-based filtering; common items are always added.
export function getStaffNavItems(role: Role | undefined | null): NavSection[] {
  return [
    ...filterSectionsByRole(STAFF_NAV_SECTIONS, role),
    ...COMMON_NAV_SECTIONS,
  ];
}

// Customer navigation items are visible to every authenticated user, so no
// role-based filtering is applied; common items are always added.
export function getCustomerNavItems(): NavSection[] {
  return [...CUSTOMER_NAV_SECTIONS, ...COMMON_NAV_SECTIONS];
}
