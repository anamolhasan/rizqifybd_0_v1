import type { Role } from "./enums";

export interface NavItem {
  /** next-intl message key resolved at render time (e.g. "dashboardNav.myWallet"). */
  titleKey: string;
  href: string;
  icon: string;
  /**
   * Roles allowed to see this item. When omitted the item is available to every
   * authenticated user in the relevant dashboard (common navigation).
   */
  includedRoles?: Role[];
  /**
   * Optional nested items rendered as an indented submenu below this item.
   * Each child keeps its own `includedRoles`; the parent stays visible while
   * at least one child is visible.
   */
  children?: NavItem[];
}

export interface NavSection {
  /** Optional next-intl message key for the section heading. */
  titleKey?: string;
  items: NavItem[];
}

export interface DashboardStat {
  title: string;
  value: string | number;
  iconName: string;
  description?: string;
}