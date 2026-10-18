import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Award,
  BadgeCheck,
  Banknote,
  ClipboardList,
  CreditCard,
  Gift,
  Handshake,
  House,
  Landmark,
  LayoutDashboard,
  Lock,
  Package,
  Plus,
  RefreshCcw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Tags,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  user: User,
  users: Users,
  lock: Lock,
  products: Package,
  operators: Smartphone,
  orders: ClipboardList,
  withdrawals: Banknote,
  wallet: Wallet,
  referrals: Gift,
  agents: BadgeCheck,
  affiliate: Handshake,
  add: Plus,
  activity: Activity,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "arrow-in": ArrowDownToLine,
  "arrow-out": ArrowUpFromLine,
  award: Award,
  credit: CreditCard,
  bank: Landmark,
  shield: ShieldCheck,
  refresh: RefreshCcw,
  settings: Settings,
  offers: Tags,
  house: House,
};

export type IconName =
  | "dashboard"
  | "user"
  | "users"
  | "lock"
  | "products"
  | "operators"
  | "orders"
  | "withdrawals"
  | "wallet"
  | "referrals"
  | "agents"
  | "affiliate"
  | "add"
  | "activity"
  | "trending-up"
  | "trending-down"
  | "arrow-in"
  | "arrow-out"
  | "award"
  | "credit"
  | "bank"
  | "shield"
  | "refresh"
  | "settings"
  | "offers"
  | "house";

export function getIconComponent(
  name: string,
): LucideIcon {
  return iconMap[name] ?? Activity;
}

export type { LucideIcon };