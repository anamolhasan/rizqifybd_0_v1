import type { AgentApplicationStatus } from "@/types/enums";

const STATUS_KEY_MAP: Record<AgentApplicationStatus, string> = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

// Keys into the shared `enums` namespace (enum values are translated for
// display only; the underlying values are left untouched).
export function getAgentApplicationStatusLabel(
  t: (key: string) => string,
  status: AgentApplicationStatus,
): string {
  return t(`applicationStatus.${STATUS_KEY_MAP[status]}`);
}

export const AGENT_STATUS_FILTER_OPTIONS: Array<{
  value: AgentApplicationStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];
