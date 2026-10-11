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
// must point at routes every signed-in user is allowed to reach.
const COMMON_NAV_SECTIONS: NavSection[] = [
  {
    title: "ACCOUNT",
    items: [
      {
        title: "My Referral",
        href: "/dashboard/my-referrals",
        icon: "referrals",
      },
      { title: "Referral", href: "/referral", icon: "referrals" },
      { title: "My Profile", href: "/my-profile", icon: "user" },
      { title: "Change Password", href: "/change-password", icon: "lock" },
    ],
  },
];

// Staff (admin panel) navigation. An item without `includedRoles` is visible to
// every staff role; otherwise only the listed roles see it. Role lists mirror the
// backend RBAC used by each module's route (see rizqifybd-server).
const STAFF_NAV_SECTIONS: NavSection[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        title: "Overview",
        href: "/admin/dashboard",
        icon: "dashboard",
      },
      { 
        title: "Home", 
        href: "/", 
        icon: "House" 
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Categories",
        href: "/admin/dashboard/categories-management",
        icon: "offers",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
      {
        title: "Orders",
        href: "/admin/dashboard/orders-management",
        icon: "orders",
        includedRoles: ORDER_STAFF_ROLES,
      },
      {
        title: "Withdrawals",
        href: "/admin/dashboard/withdrawals-management",
        icon: "withdrawals",
        includedRoles: WITHDRAWAL_STAFF_ROLES,
      },
    ],
  },
  {
    title: "Telecom",
    items: [
      {
        title: "Operators",
        href: "/admin/dashboard/operators-management",
        icon: "operators",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
      {
        title: "Telecom Offers",
        href: "/admin/dashboard/offers-management",
        icon: "offers",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/admin/dashboard/users-management",
        icon: "users",
        includedRoles: ROLE_MANAGEMENT_ACTORS,
      },
      {
        title: "Products",
        href: "/admin/dashboard/products-management",
        icon: "products",
        includedRoles: CONTENT_ADMIN_ROLES,
      },
      {
        title: "Wallets",
        href: "/admin/dashboard/wallet-management",
        icon: "wallet",
        includedRoles: FINANCE_ROLES,
      },
      {
        title: "Referral Applications",
        href: "/admin/dashboard/referral-applications-management",
        icon: "referrals",
        includedRoles: FINANCE_ROLES,
      },
      {
        title: "Agent Applications",
        href: "/admin/dashboard/agent-applications-management",
        icon: "agents",
        includedRoles: AGENT_APPLICATION_ACTORS,
      },
      {
        title: "Settings",
        href: "/admin/dashboard/settings",
        icon: "settings",
        includedRoles: ["SUPER_ADMIN"],
      },
    ],
  },
];

// Customer navigation. An item without `includedRoles` is visible to every
// customer role; otherwise only the listed roles see it.
const CUSTOMER_NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { 
        title: "Home", 
        href: "/", 
        icon: "House" 
      },
      { title: "My Orders", href: "/dashboard/my-orders", icon: "orders" },
      { title: "New Order", href: "/dashboard/new-orders", icon: "add" },
      { title: "My Wallet", href: "/dashboard/my-wallet", icon: "wallet" },
      {
        title: "My Withdrawals",
        href: "/dashboard/my-withdrawals",
        icon: "withdrawals",
      },
      {
        title: "Agent Application",
        href: "/dashboard/agent-application",
        icon: "agents",
        includedRoles: ["USER"],
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

export function getCommonNavItems(role: Role | undefined | null): NavSection[] {
  return filterSectionsByRole(COMMON_NAV_SECTIONS, role);
}

export function getStaffNavItems(role: Role | undefined | null): NavSection[] {
  return [
    ...filterSectionsByRole(STAFF_NAV_SECTIONS, role),
    ...COMMON_NAV_SECTIONS,
  ];
}

export function getCustomerNavItems(
  role: Role | undefined | null,
): NavSection[] {
  return [
    ...filterSectionsByRole(CUSTOMER_NAV_SECTIONS, role),
    ...COMMON_NAV_SECTIONS,
  ];
}
