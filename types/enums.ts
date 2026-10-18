export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "SUPPORTER"
  | "EMPLOYEE"
  | "USER";

export type UserStatus =
  | "ACTIVE"
  | "SLEEPING"
  | "INACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "BLOCKED"
  | "VERIFIED"
  | "DELETED";

export const ALL_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORTER",
  "EMPLOYEE",
  "USER",
];

export const STAFF_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORTER",
  "EMPLOYEE",
];

// Agent is not a role: an approved agent keeps Role.USER and is granted the
// reseller feature set through AgentApplication status + IAppUser.canEarn.
export const CUSTOMER_ROLES: Role[] = ["USER"];

export const ORDER_STAFF_ROLES: Role[] = STAFF_ROLES;

export const ROLE_MANAGEMENT_ACTORS: Role[] = ["SUPER_ADMIN", "ADMIN"];

export const AGENT_APPLICATION_ACTORS: Role[] = ["SUPER_ADMIN", "ADMIN"];

export const AFFILIATE_APPLICATION_ACTORS: Role[] = ["SUPER_ADMIN", "ADMIN"];

export const CONTENT_ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];

export const FINANCE_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];

export const WITHDRAWAL_STAFF_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPPORTER",
  "EMPLOYEE",
];

export const CREATABLE_ROLES_BY_ROLE: Record<Role, Role[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORTER", "EMPLOYEE"],
  ADMIN: ["ADMIN", "MODERATOR", "SUPPORTER", "EMPLOYEE"],
  MODERATOR: [],
  SUPPORTER: [],
  EMPLOYEE: [],
  USER: [],
};

export const MANAGEABLE_ROLES_BY_ROLE: Record<Role, Role[]> = {
  SUPER_ADMIN: ALL_ROLES,
  ADMIN: ["MODERATOR", "SUPPORTER", "EMPLOYEE", "USER"],
  MODERATOR: [],
  SUPPORTER: [],
  EMPLOYEE: [],
  USER: [],
};

export const canCreateRole = (actorRole: Role, targetRole: Role): boolean =>
  CREATABLE_ROLES_BY_ROLE[actorRole]?.includes(targetRole) ?? false;

export const canManageTarget = (actorRole: Role, targetRole: Role): boolean =>
  MANAGEABLE_ROLES_BY_ROLE[actorRole]?.includes(targetRole) ?? false;

export const canChangeRole = (
  actorRole: Role,
  targetRole: Role,
  newRole: Role,
): boolean => {
  if (targetRole === "SUPER_ADMIN" || newRole === "SUPER_ADMIN") {
    return actorRole === "SUPER_ADMIN";
  }
  return (
    canManageTarget(actorRole, targetRole) && canManageTarget(actorRole, newRole)
  );
};

export const isStaffRole = (role: Role | undefined | null): boolean => {
  return !!role && STAFF_ROLES.includes(role);
};

export const isRoleManagementActor = (
  role: Role | undefined | null,
): boolean => {
  return !!role && ROLE_MANAGEMENT_ACTORS.includes(role);
};

export const isContentAdmin = (role: Role | undefined | null): boolean => {
  return !!role && CONTENT_ADMIN_ROLES.includes(role);
};

export const isFinanceActor = (role: Role | undefined | null): boolean => {
  return !!role && FINANCE_ROLES.includes(role);
};

export const isWithdrawalStaff = (role: Role | undefined | null): boolean => {
  return !!role && WITHDRAWAL_STAFF_ROLES.includes(role);
};

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "WORKING"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "WORKING",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
];

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  OrderStatus[]
> = {
  PENDING: ["PROCESSING", "CANCELLED", "FAILED"],
  PROCESSING: ["WORKING", "CANCELLED", "FAILED"],
  WORKING: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: [],
};

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
];

export type ProductType =
  | "RECHARGE"
  | "BUNDLE"
  | "MINUTE"
  | "INTERNET"
  | "OTHER";

export const PRODUCT_TYPES: ProductType[] = [
  "RECHARGE",
  "BUNDLE",
  "MINUTE",
  "INTERNET",
  "OTHER",
];

export type WalletTransactionType = "CREDIT" | "DEBIT";

export const WALLET_TRANSACTION_TYPES: WalletTransactionType[] = [
  "CREDIT",
  "DEBIT",
];

export type WalletTransactionReason =
  | "COMMISSION"
  | "REFERRAL_INCOME"
  | "TOP_UP"
  | "ORDER_PAYMENT"
  | "WITHDRAWAL"
  | "REFUND"
  | "ADJUSTMENT";

export const WALLET_TRANSACTION_REASONS: WalletTransactionReason[] = [
  "COMMISSION",
  "REFERRAL_INCOME",
  "TOP_UP",
  "ORDER_PAYMENT",
  "WITHDRAWAL",
  "REFUND",
  "ADJUSTMENT",
];

export type ReferralApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export const REFERRAL_APPLICATION_STATUSES: ReferralApplicationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export type AgentApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export const AGENT_APPLICATION_STATUSES: AgentApplicationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export type AffiliateApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export const AFFILIATE_APPLICATION_STATUSES: AffiliateApplicationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export const WITHDRAWAL_STATUSES: WithdrawalStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "PAID",
];

export const WITHDRAWAL_STATUS_TRANSITIONS: Record<
  WithdrawalStatus,
  WithdrawalStatus[]
> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["PAID"],
  REJECTED: [],
  PAID: [],
};

export type WithdrawalMethod = "BKASH" | "NAGAD" | "ROCKET" | "BANK";

export const WITHDRAWAL_METHODS: WithdrawalMethod[] = [
  "BKASH",
  "NAGAD",
  "ROCKET",
  "BANK",
];

export const REFERRAL_REWARD_AMOUNT = 10;
export const MIN_WITHDRAWAL_AMOUNT = 100;
export const CURRENCY = "bdt";