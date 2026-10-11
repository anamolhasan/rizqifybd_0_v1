import type { Role, UserStatus } from "@/types/enums";

export const PROFILE_ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPPORTER: "Supporter",
  EMPLOYEE: "Employee",
  AGENT: "Agent",
  USER: "Customer",
};

export const PROFILE_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  SLEEPING: "Sleeping",
  INACTIVE: "Inactive",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
  BLOCKED: "Blocked",
  VERIFIED: "Verified",
  DELETED: "Deleted",
};

export function getProfileRoleLabel(role: string | null | undefined): string {
  if (!role) return "Unknown";
  return (
    PROFILE_ROLE_LABELS[role as Role] ??
    role
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function getProfileStatusLabel(
  status: string | null | undefined,
): string {
  if (!status) return "Unknown";
  return (
    PROFILE_STATUS_LABELS[status as UserStatus] ??
    status.charAt(0) + status.slice(1).toLowerCase()
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
