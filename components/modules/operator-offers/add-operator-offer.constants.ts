import type {
  OperatorOfferAmountUnit,
  OperatorOfferBadge,
  OperatorOfferCommissionType,
  OperatorOfferDiscountType,
  OperatorOfferInventoryMode,
  OperatorOfferStatus,
  OperatorOfferType,
  OperatorOfferValidityUnit,
} from "@/types/operator-offer.types";

// Option values are declared `as const` so they can be passed straight into
// `z.enum(...)` while still producing the domain unions from
// types/operator-offer.types.

export const OFFER_TYPES = [
  "MB",
  "MINUTE",
  "SMS",
  "BUNDLE",
  "COMBO",
  "OTHER",
] as const;

export const OFFER_TYPE_LABELS: Record<OperatorOfferType, string> = {
  MB: "Mobile Internet (MB / Data)",
  MINUTE: "Talktime (Minute)",
  SMS: "SMS Pack",
  BUNDLE: "Bundle",
  COMBO: "Combo",
  OTHER: "Other",
};

export const AMOUNT_UNITS = [
  "MB",
  "GB",
  "MINUTE",
  "HOUR",
  "SMS",
  "PCS",
] as const;

export const AMOUNT_UNIT_LABELS: Record<OperatorOfferAmountUnit, string> = {
  MB: "MB",
  GB: "GB",
  MINUTE: "Minutes",
  HOUR: "Hours",
  SMS: "SMS",
  PCS: "Pieces",
};

export const AMOUNT_UNITS_BY_OFFER_TYPE: Record<OperatorOfferType, OperatorOfferAmountUnit[]> = {
  MB: ["MB", "GB"],
  MINUTE: ["MINUTE", "HOUR"],
  SMS: ["SMS"],
  BUNDLE: ["MB", "GB", "MINUTE", "SMS"],
  COMBO: ["MB", "GB", "MINUTE", "SMS", "PCS"],
  OTHER: ["PCS"],
};

export const VALIDITY_UNITS = ["HOURS", "DAYS", "WEEKS", "MONTHS"] as const;

export const VALIDITY_UNIT_LABELS: Record<OperatorOfferValidityUnit, string> = {
  HOURS: "Hours",
  DAYS: "Days",
  WEEKS: "Weeks",
  MONTHS: "Months",
};

export const OFFER_BADGES = [
  "NEW",
  "POPULAR",
  "BEST_VALUE",
  "LIMITED_TIME",
] as const;

export const OFFER_BADGE_LABELS: Record<OperatorOfferBadge, string> = {
  NEW: "New",
  POPULAR: "Popular",
  BEST_VALUE: "Best Value",
  LIMITED_TIME: "Limited Time",
};

export const DISCOUNT_TYPES = ["NONE", "FIXED", "PERCENTAGE"] as const;

export const DISCOUNT_TYPE_LABELS: Record<OperatorOfferDiscountType, string> = {
  NONE: "No discount",
  FIXED: "Fixed amount (৳)",
  PERCENTAGE: "Percentage (%)",
};

export const COMMISSION_TYPES = ["FIXED", "PERCENTAGE"] as const;

export const COMMISSION_TYPE_LABELS: Record<OperatorOfferCommissionType, string> = {
  FIXED: "Fixed amount (৳)",
  PERCENTAGE: "Percentage (%)",
};

export const INVENTORY_MODES = ["LIMITED", "UNLIMITED"] as const;

export const INVENTORY_MODE_LABELS: Record<OperatorOfferInventoryMode, string> = {
  LIMITED: "Limited stock",
  UNLIMITED: "Unlimited stock",
};

export const OFFER_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "PAUSED",
  "EXPIRED",
  "OUT_OF_STOCK",
] as const;

export const OFFER_STATUS_LABELS: Record<OperatorOfferStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  PAUSED: "Paused",
  EXPIRED: "Expired",
  OUT_OF_STOCK: "Out of stock",
};
