export const OPERATOR_STATUS_FILTERS = ["ALL", "ACTIVE", "INACTIVE"] as const;

export type OperatorStatusFilter = (typeof OPERATOR_STATUS_FILTERS)[number];

export const OPERATOR_STATUS_LABELS: Record<OperatorStatusFilter, string> = {
  ALL: "All statuses",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};
