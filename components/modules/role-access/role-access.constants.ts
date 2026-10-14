import type { Role } from "@/types/enums";

// The Role Access matrix is keyed by "subjects". Six of them are the actual
// Role enum values. AGENT is intentionally modelled as an extra audience: in
// this codebase an approved agent keeps Role.USER and is granted the reseller
// feature set through AppUser.canEarn, so AGENT is not a real Role and must
// never be treated as a staff role.
export type RoleAccessSubject = Role | "AGENT";

export const ROLE_ACCESS_SUBJECTS: RoleAccessSubject[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORTER",
  "EMPLOYEE",
  "AGENT",
  "USER",
];

export type RoleAccessGroup =
  | "userManagement"
  | "roleAccess"
  | "catalog"
  | "operations"
  | "finance"
  | "audit";

export const ROLE_ACCESS_GROUPS: RoleAccessGroup[] = [
  "userManagement",
  "roleAccess",
  "catalog",
  "operations",
  "finance",
  "audit",
];

export interface RoleAccessPermission {
  /** Canonical permission identifier, e.g. "users.read". */
  id: string;
  /** Translation slug under admin.roleAccess.permissions. */
  key: string;
  group: RoleAccessGroup;
  /** When true, a restriction description exists and is shown for LIMITED. */
  restriction?: true;
}

// Proposed permission identifiers. These mirror the operations the backend
// already gates today and are the identifiers a later step will persist and
// enforce. They are display-only in this step.
export const ROLE_ACCESS_PERMISSIONS: RoleAccessPermission[] = [
  { id: "users.read", key: "usersRead", group: "userManagement" },
  {
    id: "users.update",
    key: "usersUpdate",
    group: "userManagement",
    restriction: true,
  },
  {
    id: "users.block",
    key: "usersBlock",
    group: "userManagement",
    restriction: true,
  },
  {
    id: "users.delete",
    key: "usersDelete",
    group: "userManagement",
    restriction: true,
  },
  {
    id: "roles.manage",
    key: "rolesManage",
    group: "roleAccess",
    restriction: true,
  },
  {
    id: "role_permissions.manage",
    key: "rolePermissionsManage",
    group: "roleAccess",
  },
  { id: "offers.manage", key: "offersManage", group: "catalog" },
  { id: "orders.manage", key: "ordersManage", group: "operations" },
  { id: "wallet.read", key: "walletRead", group: "finance" },
  { id: "wallet.adjust", key: "walletAdjust", group: "finance" },
  {
    id: "withdrawals.review",
    key: "withdrawalsReview",
    group: "finance",
    restriction: true,
  },
  {
    id: "commissions.manage",
    key: "commissionsManage",
    group: "finance",
    restriction: true,
  },
  { id: "audit_logs.read", key: "auditLogsRead", group: "audit" },
];

export type PermissionState = "ALLOWED" | "LIMITED" | "DENIED";

const allowed = (): PermissionState => "ALLOWED";
const limited = (): PermissionState => "LIMITED";
const denied = (): PermissionState => "DENIED";

// Proposed target policy. Derived from the existing backend RBAC rules
// (rizqifybd-server/src/app/constants/rbac.constant.ts) and the business
// requirements. Restricted states are surfaced with an explanation in the UI.
export const ROLE_PERMISSION_MATRIX: Record<
  RoleAccessSubject,
  Record<string, PermissionState>
> = {
  SUPER_ADMIN: {
    "users.read": allowed(),
    "users.update": allowed(),
    "users.block": allowed(),
    "users.delete": allowed(),
    "roles.manage": allowed(),
    "role_permissions.manage": allowed(),
    "offers.manage": allowed(),
    "orders.manage": allowed(),
    "wallet.read": allowed(),
    "wallet.adjust": allowed(),
    "withdrawals.review": allowed(),
    "commissions.manage": allowed(),
    "audit_logs.read": allowed(),
  },
  ADMIN: {
    "users.read": allowed(),
    "users.update": allowed(),
    "users.block": allowed(),
    "users.delete": limited(),
    "roles.manage": limited(),
    "role_permissions.manage": denied(),
    "offers.manage": allowed(),
    "orders.manage": allowed(),
    "wallet.read": allowed(),
    "wallet.adjust": allowed(),
    "withdrawals.review": allowed(),
    "commissions.manage": limited(),
    "audit_logs.read": denied(),
  },
  MODERATOR: {
    "users.read": allowed(),
    "users.update": denied(),
    "users.block": allowed(),
    "users.delete": denied(),
    "roles.manage": denied(),
    "role_permissions.manage": denied(),
    "offers.manage": denied(),
    "orders.manage": allowed(),
    "wallet.read": denied(),
    "wallet.adjust": denied(),
    "withdrawals.review": denied(),
    "commissions.manage": denied(),
    "audit_logs.read": denied(),
  },
  SUPPORTER: {
    "users.read": allowed(),
    "users.update": denied(),
    "users.block": limited(),
    "users.delete": denied(),
    "roles.manage": denied(),
    "role_permissions.manage": denied(),
    "offers.manage": denied(),
    "orders.manage": limited(),
    "wallet.read": limited(),
    "wallet.adjust": denied(),
    "withdrawals.review": limited(),
    "commissions.manage": denied(),
    "audit_logs.read": denied(),
  },
  EMPLOYEE: {
    "users.read": limited(),
    "users.update": denied(),
    "users.block": denied(),
    "users.delete": denied(),
    "roles.manage": denied(),
    "role_permissions.manage": denied(),
    "offers.manage": denied(),
    "orders.manage": limited(),
    "wallet.read": limited(),
    "wallet.adjust": denied(),
    "withdrawals.review": limited(),
    "commissions.manage": denied(),
    "audit_logs.read": denied(),
  },
  AGENT: {
    "users.read": denied(),
    "users.update": denied(),
    "users.block": denied(),
    "users.delete": denied(),
    "roles.manage": denied(),
    "role_permissions.manage": denied(),
    "offers.manage": denied(),
    "orders.manage": limited(),
    "wallet.read": limited(),
    "wallet.adjust": denied(),
    "withdrawals.review": denied(),
    "commissions.manage": limited(),
    "audit_logs.read": denied(),
  },
  USER: {
    "users.read": denied(),
    "users.update": denied(),
    "users.block": denied(),
    "users.delete": denied(),
    "roles.manage": denied(),
    "role_permissions.manage": denied(),
    "offers.manage": denied(),
    "orders.manage": limited(),
    "wallet.read": limited(),
    "wallet.adjust": denied(),
    "withdrawals.review": denied(),
    "commissions.manage": denied(),
    "audit_logs.read": denied(),
  },
};

// Default-deny: an unresolved subject/permission pair is treated as denied,
// mirroring the intended server-side behaviour.
export function getPermissionState(
  subject: RoleAccessSubject,
  permissionId: string,
): PermissionState {
  return ROLE_PERMISSION_MATRIX[subject]?.[permissionId] ?? "DENIED";
}

export function isRoleAccessSubject(value: string): value is RoleAccessSubject {
  return (ROLE_ACCESS_SUBJECTS as string[]).includes(value);
}
