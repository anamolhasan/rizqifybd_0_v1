import type { ProductType } from "./enums";
import type { IOperator } from "./operator.types";

// Domain model for the Operator Offers feature. Mirrors the backend
// OperatorOffer model (table operators_offers) and its generated enums.

export type OperatorOfferType =
  | "MB"
  | "MINUTE"
  | "SMS"
  | "BUNDLE"
  | "COMBO"
  | "OTHER";

export type OperatorOfferAmountUnit =
  | "MB"
  | "GB"
  | "MINUTE"
  | "HOUR"
  | "SMS"
  | "PCS";

export type OperatorOfferValidityUnit = "HOURS" | "DAYS" | "WEEKS" | "MONTHS";

export type OperatorOfferBadge =
  | "NEW"
  | "POPULAR"
  | "BEST_VALUE"
  | "LIMITED_TIME";

export type OperatorOfferDiscountType = "NONE" | "FIXED" | "PERCENTAGE";

export type OperatorOfferCommissionType = "FIXED" | "PERCENTAGE";

export type OperatorOfferInventoryMode = "LIMITED" | "UNLIMITED";

export type OperatorOfferStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "PAUSED"
  | "EXPIRED"
  | "OUT_OF_STOCK";

export interface IOperatorOffer {
  id: string;
  operatorId: string;
  name: string;
  description: string | null;
  offerType: OperatorOfferType;
  // Legacy classification mirrored by the backend for backward compatibility.
  type: ProductType;
  amount: number | null;
  amountUnit: OperatorOfferAmountUnit | null;
  validityValue: number | null;
  validityUnit: OperatorOfferValidityUnit | null;
  regularPrice: number;
  price: number;
  discountType: OperatorOfferDiscountType;
  discountValue: number;
  companyPurchasePrice: number;
  resellerCommissionType: OperatorOfferCommissionType;
  resellerCommissionValue: number;
  agentCommissionType: OperatorOfferCommissionType;
  agentCommissionValue: number;
  commissionRate: number;
  referralCommissionRate: number;
  inventoryMode: OperatorOfferInventoryMode;
  stockQuantity: number | null;
  badges: OperatorOfferBadge[];
  startsAt: string;
  endsAt: string;
  status: OperatorOfferStatus;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  operator?: IOperator | null;
}

export interface ICreateOperatorOfferPayload {
  operatorId: string;
  name: string;
  description?: string;
  offerType?: OperatorOfferType;
  amount?: number;
  amountUnit?: OperatorOfferAmountUnit;
  validityValue?: number;
  validityUnit?: OperatorOfferValidityUnit;
  regularPrice: number;
  discountType?: OperatorOfferDiscountType;
  discountValue?: number;
  companyPurchasePrice?: number;
  resellerCommissionType?: OperatorOfferCommissionType;
  resellerCommissionValue?: number;
  agentCommissionType?: OperatorOfferCommissionType;
  agentCommissionValue?: number;
  inventoryMode?: OperatorOfferInventoryMode;
  stockQuantity?: number;
  badges?: OperatorOfferBadge[];
  startsAt: string;
  endsAt: string;
  status?: OperatorOfferStatus;
  isActive?: boolean;
}

export type IUpdateOperatorOfferPayload = Partial<ICreateOperatorOfferPayload>;

export interface IOperatorOfferListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  operatorId?: string;
  offerType?: OperatorOfferType;
  type?: ProductType;
  status?: OperatorOfferStatus;
  isActive?: boolean;
  isDeleted?: boolean;
}
