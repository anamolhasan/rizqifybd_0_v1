import type { ReferralApplicationStatus } from "@/types/enums";
import type { ReferralPromotionMethod } from "@/types/referral.types";

const STATUS_KEY_MAP: Record<ReferralApplicationStatus, string> = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const METHOD_KEY_MAP: Record<ReferralPromotionMethod, string> = {
  SOCIAL_MEDIA: "socialMedia",
  MESSAGING_APPS: "messagingApps",
  FRIENDS_FAMILY: "friendsFamily",
  COMMUNITY_GROUP: "communityGroup",
  OTHER: "other",
};

// Backward-compatible label accessors. New code should call
// `useTranslations("enums")` and read `applicationStatus.<status>` /
// `promotionMethod.<method>` directly.
export function getReferralApplicationStatusLabel(
  t: (key: string) => string,
  status: ReferralApplicationStatus,
): string {
  return t(`applicationStatus.${STATUS_KEY_MAP[status]}`);
}

export function getReferralPromotionMethodLabel(
  t: (key: string) => string,
  method: ReferralPromotionMethod,
): string {
  return t(`promotionMethod.${METHOD_KEY_MAP[method]}`);
}

export const REFERRAL_STATUS_LABELS: Record<ReferralApplicationStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const PROMOTION_METHOD_LABELS: Record<ReferralPromotionMethod, string> = {
  SOCIAL_MEDIA: "Social Media",
  MESSAGING_APPS: "Messaging Apps",
  FRIENDS_FAMILY: "Friends & Family",
  COMMUNITY_GROUP: "Community Group",
  OTHER: "Other",
};

export const REFERRAL_STATUS_FILTER_OPTIONS: Array<{
  value: ReferralApplicationStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];