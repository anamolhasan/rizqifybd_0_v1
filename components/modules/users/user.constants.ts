import { CREATABLE_ROLES_BY_ROLE } from "@/types/enums";
import type { Role } from "@/types/enums";

// Staff roles exposed in this UI. The backend also permits EMPLOYEE for
// Super Admin/Admin actors, but this interface intentionally offers only the
// roles listed in the requirement. Role enforcement always happens server-side.
export const STAFF_CREATABLE_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORTER",
];

export const STAFF_ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPPORTER: "Supporter",
  EMPLOYEE: "Employee",
  AGENT: "Agent",
  USER: "Customer",
};

export function canCreateStaffAccounts(
  actorRole: Role | undefined | null,
): boolean {
  return actorRole === "SUPER_ADMIN" || actorRole === "ADMIN";
}

// Intersects what the backend would allow for this actor (CREATABLE_ROLES_BY_ROLE)
// with the roles this interface supports. Used for the role dropdown only; the
// backend remains the source of truth.
export function getCreatableStaffRoles(
  actorRole: Role | undefined | null,
): Role[] {
  if (!canCreateStaffAccounts(actorRole)) return [];
  const allowed = CREATABLE_ROLES_BY_ROLE[actorRole as Role] ?? [];
  return STAFF_CREATABLE_ROLES.filter((role) => allowed.includes(role));
}