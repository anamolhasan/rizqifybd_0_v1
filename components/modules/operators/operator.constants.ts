export const OPERATOR_STATUS_FILTERS = ["ALL", "ACTIVE", "INACTIVE"] as const;

export type OperatorStatusFilter = (typeof OPERATOR_STATUS_FILTERS)[number];

// Backward-compatible label accessor. New code should call
// `useTranslations("enums")` and read `operatorStatus.<filter>` directly.
export function getOperatorStatusLabel(
  t: (key: string) => string,
  status: OperatorStatusFilter,
): string {
  return t(`operatorStatus.${status}`);
}