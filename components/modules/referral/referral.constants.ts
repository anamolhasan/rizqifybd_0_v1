import type { ReferralPromotionMethod } from "@/types/referral.types";

export const REFERRAL_PROMOTION_METHOD_VALUES = [
  "SOCIAL_MEDIA",
  "MESSAGING_APPS",
  "FRIENDS_FAMILY",
  "COMMUNITY_GROUP",
  "OTHER",
] as const satisfies readonly ReferralPromotionMethod[];

// Keys into the shared `enums` namespace (enum values are translated for
// display only; the underlying values are left untouched).
export const REFERRAL_PROMOTION_METHOD_LABEL_KEYS: Record<
  ReferralPromotionMethod,
  string
> = {
  SOCIAL_MEDIA: "promotionMethod.socialMedia",
  MESSAGING_APPS: "promotionMethod.messagingApps",
  FRIENDS_FAMILY: "promotionMethod.friendsFamily",
  COMMUNITY_GROUP: "promotionMethod.communityGroup",
  OTHER: "promotionMethod.other",
};