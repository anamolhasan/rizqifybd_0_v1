import type { ReferralPromotionMethod } from "@/types/referral.types";

export const REFERRAL_PROMOTION_METHOD_VALUES = [
  "SOCIAL_MEDIA",
  "MESSAGING_APPS",
  "FRIENDS_FAMILY",
  "COMMUNITY_GROUP",
  "OTHER",
] as const satisfies readonly ReferralPromotionMethod[];

export const REFERRAL_PROMOTION_METHOD_LABELS: Record<
  ReferralPromotionMethod,
  string
> = {
  SOCIAL_MEDIA: "সোশ্যাল মিডিয়া (ফেসবুক, ইনস্টাগ্রাম, টিকটক)",
  MESSAGING_APPS: "মেসেজিং অ্যাপ (হোয়াটসঅ্যাপ, টেলিগ্রাম)",
  FRIENDS_FAMILY: "বন্ধু ও পরিবার",
  COMMUNITY_GROUP: "কমিউনিটি গ্রুপ / ফোরাম",
  OTHER: "অন্যান্য",
};
