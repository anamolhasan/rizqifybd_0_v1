import type { AffiliateApplicationStatus } from "@/types/enums";

const STATUS_KEY_MAP: Record<AffiliateApplicationStatus, string> = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

// Keys into the shared `enums` namespace (enum values are translated for
// display only; the underlying values are left untouched).
export function getAffiliateApplicationStatusLabel(
  t: (key: string) => string,
  status: AffiliateApplicationStatus,
): string {
  return t(`applicationStatus.${STATUS_KEY_MAP[status]}`);
}

export const AFFILIATE_STATUS_FILTER_OPTIONS: Array<{
  value: AffiliateApplicationStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];
