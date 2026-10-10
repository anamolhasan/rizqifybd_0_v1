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
  Landmark,
  LayoutDashboard,
  Lock,
  Package,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
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
  | "refresh";

export function getIconComponent(
  name: string,
): LucideIcon {
  return iconMap[name] ?? Activity;
}

export type { LucideIcon };