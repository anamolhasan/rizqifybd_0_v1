import type { ProductType } from "@/types/enums";
import type {
  OfferAmountUnit,
  OfferBadge,
  OfferDiscountType,
  OfferStatus,
  OfferType,
  OfferValidityUnit,
} from "@/types/offer.types";

// Option values are declared `as const` so they can be passed straight into
// `z.enum(...)` while still producing the domain unions from types/offer.types.

export const OFFER_TYPES = ["MB", "MINUTE", "SMS", "BUNDLE", "COMBO"] as const;

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  MB: "Mobile Internet (MB)",
  MINUTE: "Talktime (Minute)",
  SMS: "SMS Pack",
  BUNDLE: "Bundle",
  COMBO: "Combo",
};

// The current product API models a single ProductType. Richer offer types are
// mapped to the closest supported value until the backend is extended.
export const OFFER_TYPE_TO_PRODUCT_TYPE: Record<OfferType, ProductType> = {
  MB: "INTERNET",
  MINUTE: "MINUTE",
  SMS: "OTHER",
  BUNDLE: "BUNDLE",
  COMBO: "BUNDLE",
};

export const AMOUNT_UNITS = [
  "MB",
  "GB",
  "MINUTE",
  "HOUR",
  "SMS",
  "PCS",
] as const;

export const AMOUNT_UNIT_LABELS: Record<OfferAmountUnit, string> = {
  MB: "MB",
  GB: "GB",
  MINUTE: "Minutes",
  HOUR: "Hours",
  SMS: "SMS",
  PCS: "Pieces",
};

export const AMOUNT_UNITS_BY_OFFER_TYPE: Record<OfferType, OfferAmountUnit[]> = {
  MB: ["MB", "GB"],
  MINUTE: ["MINUTE", "HOUR"],
  SMS: ["SMS"],
  BUNDLE: ["MB", "GB", "MINUTE", "SMS"],
  COMBO: ["MB", "GB", "MINUTE", "SMS", "PCS"],
};

export const VALIDITY_UNITS = ["HOURS", "DAYS", "WEEKS", "MONTHS"] as const;

export const VALIDITY_UNIT_LABELS: Record<OfferValidityUnit, string> = {
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

export const OFFER_BADGE_LABELS: Record<OfferBadge, string> = {
  NEW: "New",
  POPULAR: "Popular",
  BEST_VALUE: "Best Value",
  LIMITED_TIME: "Limited Time",
};

export const DISCOUNT_TYPES = ["FIXED", "PERCENTAGE"] as const;

export const DISCOUNT_TYPE_LABELS: Record<OfferDiscountType, string> = {
  FIXED: "Fixed amount (৳)",
  PERCENTAGE: "Percentage (%)",
};

export const OFFER_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "PAUSED",
  "EXPIRED",
  "OUT_OF_STOCK",
] as const;

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  PAUSED: "Paused",
  EXPIRED: "Expired",
  OUT_OF_STOCK: "Out of stock",
};
