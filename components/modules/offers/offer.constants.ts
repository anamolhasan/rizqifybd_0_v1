import type { ProductType } from "@/types/enums";

export const OFFER_TYPE_VALUES = [
  "RECHARGE",
  "BUNDLE",
  "MINUTE",
  "INTERNET",
  "OTHER",
] as const;

export const OFFER_TYPE_LABELS: Record<ProductType, string> = {
  RECHARGE: "Recharge",
  BUNDLE: "Bundle",
  MINUTE: "Minute",
  INTERNET: "Internet",
  OTHER: "Other",
};
