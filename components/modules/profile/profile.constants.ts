import type { Role, UserStatus } from "@/types/enums";

/**
 * Keys into the shared `enums` namespace. Kept as keys so the actual labels can
 * be resolved in the active language at render time.
 */
export const PROFILE_ROLE_LABEL_KEYS: Record<Role, string> = {
  SUPER_ADMIN: "role.superAdmin",
  ADMIN: "role.admin",
  MODERATOR: "role.moderator",
  SUPPORTER: "role.supporter",
  EMPLOYEE: "role.employee",
  USER: "role.customer",
};

export const PROFILE_STATUS_LABEL_KEYS: Record<UserStatus, string> = {
  ACTIVE: "userStatus.active",
  SLEEPING: "userStatus.sleeping",
  INACTIVE: "userStatus.inactive",
  PENDING: "userStatus.pending",
  SUSPENDED: "userStatus.suspended",
  BLOCKED: "userStatus.blocked",
  VERIFIED: "userStatus.verified",
  DELETED: "userStatus.deleted",
};

export type EnumTranslator = (key: string) => string;

export function getProfileRoleLabel(
  role: string | null | undefined,
  t: EnumTranslator,
): string {
  if (!role) return t("unknown");
  return (
    PROFILE_ROLE_LABEL_KEYS[role as Role] !== undefined
      ? t(PROFILE_ROLE_LABEL_KEYS[role as Role])
      : role
          .toLowerCase()
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
  );
}

export function getProfileStatusLabel(
  status: string | null | undefined,
  t: EnumTranslator,
): string {
  if (!status) return t("unknown");
  return (
    PROFILE_STATUS_LABEL_KEYS[status as UserStatus] !== undefined
      ? t(PROFILE_STATUS_LABEL_KEYS[status as UserStatus])
      : status.charAt(0) + status.slice(1).toLowerCase()
  );
}

export function getProfileInitials(
  name: string | null | undefined,
  email?: string | null,
): string {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";

  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }

  return source.charAt(0).toUpperCase();
}