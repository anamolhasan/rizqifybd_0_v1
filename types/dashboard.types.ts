export interface NavItem {
  title: string;
  href: string;
  icon: string;
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