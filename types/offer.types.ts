import type { ProductType } from "./enums";
import type { IProduct } from "./product.types";

export type IOffer = IProduct;

// Domain model for the richer "Add Offer" authoring flow. These describe the
// intended offer shape; only the subset supported by the current product API is
// persisted today (see lib/offer-calculations.ts `buildCreateOfferPayload`).
export type OfferType = "MB" | "MINUTE" | "SMS" | "BUNDLE" | "COMBO";

export type OfferAmountUnit = "MB" | "GB" | "MINUTE" | "HOUR" | "SMS" | "PCS";

export type OfferValidityUnit = "HOURS" | "DAYS" | "WEEKS" | "MONTHS";

export type OfferBadge = "NEW" | "POPULAR" | "BEST_VALUE" | "LIMITED_TIME";

export type OfferDiscountType = "FIXED" | "PERCENTAGE";

export type OfferStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "PAUSED"
  | "EXPIRED"
  | "OUT_OF_STOCK";

export interface IOfferListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  operatorId?: string;
  type?: ProductType;
  isActive?: boolean;
  isDeleted?: boolean;
}
