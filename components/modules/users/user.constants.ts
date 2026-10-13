import {
  ALL_ROLES,
  canChangeRole,
  canManageTarget,
  CREATABLE_ROLES_BY_ROLE,
} from "@/types/enums";
import type { Role, UserStatus } from "@/types/enums";

// Staff roles exposed in the staff-creation UI. The backend also permits
// EMPLOYEE for Super Admin/Admin actors. Role enforcement always happens
// server-side (see rizqifybd-server user.service.ts).
export const STAFF_CREATABLE_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORTER",
];

// Every role the backend actually supports. AGENT is intentionally absent:
// an approved agent keeps Role.USER and is granted the reseller feature set
// through AgentApplication status + IAppUser.canEarn, never a Role.
export const SUPPORTED_ROLES: Role[] = ALL_ROLES;

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPPORTER: "Supporter",
  EMPLOYEE: "Employee",
  USER: "Customer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Full, unrestricted access including role and staff management.",
  ADMIN: "Manages staff, catalogues and day-to-day administration.",
  MODERATOR: "Reviews and moderates submissions; cannot manage staff roles.",
  SUPPORTER: "Handles customer support and withdrawal assistance.",
  EMPLOYEE: "Internal staff operator with limited administrative scope.",
  USER: "Customer account. Agents keep this role with the reseller flag.",
};

export const STAFF_ROLE_LABELS: Record<Role, string> = ROLE_LABELS;

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  SLEEPING: "Sleeping",
  INACTIVE: "Inactive",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
  BLOCKED: "Blocked",
  VERIFIED: "Verified",
  DELETED: "Deleted",
};

// Distinct, semantic, theme-aware treatments for every supported role. Kept as
// full class strings so Tailwind can see them at build time.
export const ROLE_BADGE_CLASSES: Record<Role, string> = {
  SUPER_ADMIN:
    "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/15 dark:text-violet-300",
  ADMIN:
    "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/15 dark:text-blue-300",
  MODERATOR:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300",
  SUPPORTER:
    "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:border-teal-400/30 dark:bg-teal-400/15 dark:text-teal-300",
  EMPLOYEE:
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/15 dark:text-cyan-300",
  USER: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:border-slate-400/30 dark:bg-slate-400/15 dark:text-slate-300",
};

export const USER_STATUS_BADGE_CLASSES: Record<UserStatus, string> = {
  ACTIVE:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  VERIFIED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300",
  SLEEPING:
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-300",
  INACTIVE:
    "border-zinc-500/30 bg-zinc-500/10 text-slate-600 dark:border-zinc-400/30 dark:bg-zinc-400/15 dark:text-slate-300",
  SUSPENDED:
    "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:border-orange-400/30 dark:bg-orange-400/15 dark:text-orange-300",
  BLOCKED:
    "border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-400/30 dark:bg-red-400/15 dark:text-red-300",
  DELETED:
    "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/15 dark:text-rose-300",
};

// Dot colors used inside the premium status pill.
export const USER_STATUS_DOT_CLASSES: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-500",
  VERIFIED: "bg-emerald-500",
  PENDING: "bg-amber-500",
  SLEEPING: "bg-violet-500",
  INACTIVE: "bg-slate-400",
  SUSPENDED: "bg-orange-500",
  BLOCKED: "bg-red-500",
  DELETED: "bg-rose-500",
};

export function canCreateStaffAccounts(actorRole: Role | undefined | null): boolean {
  return actorRole === "SUPER_ADMIN" || actorRole === "ADMIN";
}

// Mirrors the backend MANAGEABLE_ROLES_BY_ROLE rules: who may view/edit/change
// status for a target role. ADMIN can never manage ADMIN or SUPER_ADMIN.
export function canManageUser(
  actorRole: Role | undefined | null,
  targetRole: Role,
): boolean {
  if (!actorRole) return false;
  return canManageTarget(actorRole, targetRole);
}

// Mirrors the backend soft-delete/restore rules: only a SUPER_ADMIN may delete
// or restore a SUPER_ADMIN; otherwise the regular management scope applies.
export function canDeleteUser(
  actorRole: Role | undefined | null,
  targetRole: Role,
): boolean {
  if (!actorRole) return false;
  if (targetRole === "SUPER_ADMIN") return actorRole === "SUPER_ADMIN";
  return canManageTarget(actorRole, targetRole);
}

export function getCreatableStaffRoles(
  actorRole: Role | undefined | null,
): Role[] {
  if (!actorRole) return [];
  return [
    ...CREATABLE_ROLES_BY_ROLE[actorRole],
  ].filter((role) => STAFF_CREATABLE_ROLES.includes(role));
}

// Roles the actor may assign to a specific target, mirroring the backend's
// canChangeRole rules (no privilege escalation, ADMIN cannot touch ADMIN/
// SUPER_ADMIN, only SUPER_ADMIN may grant/revoke SUPER_ADMIN).
export function getAssignableRoles(
  actorRole: Role | undefined | null,
  targetRole: Role,
): Role[] {
  if (!actorRole) return [];
  return SUPPORTED_ROLES.filter((role) =>
    canChangeRole(actorRole, targetRole, role),
  );
}

export type UserStatusAction =
  | "ACTIVATE"
  | "DEACTIVATE"
  | "SUSPEND"
  | "UNSUSPEND"
  | "BLOCK"
  | "UNBLOCK";

export const USER_STATUS_ACTION_LABELS: Record<UserStatusAction, string> = {
  ACTIVATE: "Activate",
  DEACTIVATE: "Deactivate",
  SUSPEND: "Suspend",
  UNSUSPEND: "Unsuspend",
  BLOCK: "Block",
  UNBLOCK: "Unblock",
};

export const USER_STATUS_ACTION_TARGETS: Record<
  UserStatusAction,
  Exclude<UserStatus, "DELETED">
> = {
  ACTIVATE: "ACTIVE",
  DEACTIVATE: "INACTIVE",
  SUSPEND: "SUSPENDED",
  UNSUSPEND: "ACTIVE",
  BLOCK: "BLOCKED",
  UNBLOCK: "ACTIVE",
};

// Valid transitions from each status. DELETED accounts are managed through the
// restore flow instead of a status transition.
const STATUS_ACTIONS: Record<UserStatus, UserStatusAction[]> = {
  ACTIVE: ["DEACTIVATE", "SUSPEND", "BLOCK"],
  VERIFIED: ["DEACTIVATE", "SUSPEND", "BLOCK"],
  PENDING: ["ACTIVATE", "SUSPEND", "BLOCK"],
  SLEEPING: ["ACTIVATE", "SUSPEND", "BLOCK"],
  INACTIVE: ["ACTIVATE", "SUSPEND", "BLOCK"],
  SUSPENDED: ["UNSUSPEND", "BLOCK"],
  BLOCKED: ["UNBLOCK"],
  DELETED: [],
};

export function getStatusActions(status: UserStatus): UserStatusAction[] {
  return STATUS_ACTIONS[status] ?? [];
}
