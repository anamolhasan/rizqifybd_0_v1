import type { Role } from "./enums";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  /**
   * Roles allowed to see this item. When omitted the item is available to every
   * authenticated user in the relevant dashboard (common navigation).
   */
  includedRoles?: Role[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface DashboardStat {
  title: string;
  value: string | number;
  iconName: string;
  description?: string;
}