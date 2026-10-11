import type { ReferralApplicationStatus } from "@/types/enums";
import type { ReferralPromotionMethod } from "@/types/referral.types";

export const REFERRAL_STATUS_LABELS: Record<
  ReferralApplicationStatus,
  string
> = {
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
