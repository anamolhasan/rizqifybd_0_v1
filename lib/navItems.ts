import {
  AGENT_APPLICATION_ACTORS,
  CONTENT_ADMIN_ROLES,
  FINANCE_ROLES,
  ROLE_MANAGEMENT_ACTORS,
  WITHDRAWAL_STAFF_ROLES,
} from "@/types/enums";
import type { Role } from "@/types/enums";
import type { NavSection } from "@/types/dashboard.types";

const COMMON_NAV_ITEMS: NavSection[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { title: "My Profile", href: "/my-profile", icon: "user" },
      { title: "Change Password", href: "/change-password", icon: "lock" },
    ],
  },
];

const STAFF_NAV_SECTIONS: Array<NavSection & { includedRoles?: Role[] }> = [
  {
    items: [
      { title: "Overview", href: "/admin/dashboard", icon: "dashboard" },
      { title: "Home", href: "/", icon: "home" },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Category Managements",
        href: "/admin/dashboard/categories-management",
        icon: "offers",
      },
      {
        title: "Offers Managements",
        href: "/admin/dashboard/offers-management",
        icon: "offers",
      },
      {
        title: "Orders",
        href: "/admin/dashboard/orders-management",
        icon: "orders",
      },
      {
        title: "Withdrawals",
        href: "/admin/dashboard/withdrawals-management",
        icon: "withdrawals",
        includedRoles: WITHDRAWAL_STAFF_ROLES,
      },
    ] as Array<NavSection["items"][number] & { includedRoles?: Role[] }>,
  },
  {
    title: "Administration",
    items: [
      { title: "Users", href: "/admin/dashboard/users-management", icon: "users", includedRoles: ROLE_MANAGEMENT_ACTORS },
      { title: "Products", href: "/admin/dashboard/products-management", icon: "products", includedRoles: CONTENT_ADMIN_ROLES },
      { title: "Operators", href: "/admin/dashboard/operators-management", icon: "operators", includedRoles: CONTENT_ADMIN_ROLES },
      { title: "Wallets", href: "/admin/dashboard/wallet-management", icon: "wallet", includedRoles: FINANCE_ROLES },
      { title: "Referral Applications", href: "/admin/dashboard/referral-applications-management", icon: "referrals", includedRoles: FINANCE_ROLES },
      { title: "Agent Applications", href: "/admin/dashboard/agent-applications-management", icon: "agents", includedRoles: AGENT_APPLICATION_ACTORS },
    ] as Array<NavSection["items"][number] & { includedRoles?: Role[] }>,
  },
];

const CUSTOMER_NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { title: "My Orders", href: "/dashboard/my-orders", icon: "orders" },
      { title: "New Order", href: "/dashboard/new-order", icon: "add" },
      { title: "My Wallet", href: "/dashboard/my-wallet", icon: "wallet" },
      {
        title: "My Withdrawals",
        href: "/dashboard/my-withdrawals",
        icon: "withdrawals",
      },
      { title: "My Referral", href: "/dashboard/my-referrals", icon: "referrals" },
      {
        title: "Agent Application",
        href: "/dashboard/agent-application",
        icon: "agents",
        includedRoles: ["USER"],
      },
    ] as Array<NavSection["items"][number] & { includedRoles?: Role[] }>,
  },
];

function filterByRole(
  sections: NavSection[],
  role: Role,
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const includedRoles = (item as { includedRoles?: Role[] }).includedRoles;
        return !includedRoles || includedRoles.includes(role);
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export function getStaffNavItems(role: Role): NavSection[] {
  return [...filterByRole(STAFF_NAV_SECTIONS, role), ...COMMON_NAV_ITEMS];
}

export function getCustomerNavItems(role: Role): NavSection[] {
  return [...filterByRole(CUSTOMER_NAV_SECTIONS, role), ...COMMON_NAV_ITEMS];
}