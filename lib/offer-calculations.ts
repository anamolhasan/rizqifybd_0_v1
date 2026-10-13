import type {
  OfferAmountUnit,
  OfferDiscountType,
  OfferType,
  OfferValidityUnit,
} from "@/types/offer.types";
import {
  AMOUNT_UNITS_BY_OFFER_TYPE,
  OFFER_TYPE_TO_PRODUCT_TYPE,
} from "@/components/modules/offers/add-offer.constants";

export interface OfferPriceBreakdown {
  discountAmount: number;
  sellingPrice: number;
}

export interface OfferProfitScenario {
  resellerCommissionAmount: number;
  agentCommissionAmount: number;
  estimatedProfit: number;
  isNegative: boolean;
}

export interface OfferProfitBreakdown {
  resellerSale: OfferProfitScenario;
  agentSale: OfferProfitScenario;
  directSale: OfferProfitScenario;
}

export interface OfferCalculationInput {
  regularPrice: number;
  discountType: OfferDiscountType;
  discountValue: number;
  companyPurchaseCost: number;
  resellerCommissionAmount: number;
  agentCommissionAmount: number;
}

export const ZERO_PROFIT_SCENARIO: OfferProfitScenario = {
  resellerCommissionAmount: 0,
  agentCommissionAmount: 0,
  estimatedProfit: 0,
  isNegative: false,
};

export const ZERO_PROFIT_BREAKDOWN: OfferProfitBreakdown = {
  resellerSale: ZERO_PROFIT_SCENARIO,
  agentSale: ZERO_PROFIT_SCENARIO,
  directSale: ZERO_PROFIT_SCENARIO,
};

export function clampNonNegative(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value < 0 ? 0 : value;
}

export function roundToCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

export function calculateSellingPrice(
  regularPrice: number,
  discountType: OfferDiscountType,
  discountValue: number,
): OfferPriceBreakdown {
  const rp = clampNonNegative(regularPrice);
  const dv = clampNonNegative(discountValue);

  let discountAmount = 0;
  if (discountType === "FIXED") {
    discountAmount = dv;
  } else if (discountType === "PERCENTAGE") {
    const pct = dv > 100 ? 100 : dv;
    discountAmount = (rp * pct) / 100;
  }

  if (discountAmount > rp) {
    discountAmount = rp;
  }

  const sellingPrice = roundToCents(rp - discountAmount);
  const discountAmountRounded = roundToCents(discountAmount);

  return {
    discountAmount: discountAmountRounded,
    sellingPrice: sellingPrice < 0 ? 0 : sellingPrice,
  };
}

export function calculateProfitBreakdown(
  input: OfferCalculationInput,
): OfferProfitBreakdown {
  const { sellingPrice } = calculateSellingPrice(
    input.regularPrice,
    input.discountType,
    input.discountValue,
  );

  const cost = clampNonNegative(input.companyPurchaseCost);
  const resellerComm = clampNonNegative(input.resellerCommissionAmount);
  const agentComm = clampNonNegative(input.agentCommissionAmount);

  // Treat reseller and agent sales as mutually exclusive commission scenarios.
  // Estimated platform profit = (Selling Price - Company Purchase Cost - Applicable Commission)
  const buildScenario = (applicableCommission: number): OfferProfitScenario => {
    const profit = roundToCents(sellingPrice - cost - applicableCommission);
    return {
      resellerCommissionAmount: roundToCents(resellerComm),
      agentCommissionAmount: roundToCents(agentComm),
      estimatedProfit: profit,
      isNegative: profit < 0,
    };
  };

  return {
    resellerSale: buildScenario(resellerComm),
    agentSale: buildScenario(agentComm),
    directSale: buildScenario(0),
  };
}

// Convert a reseller commission amount (BDT) to a commission rate percentage
// based on the selling price. The backend stores commissionRate as a percent of
// the order total. When sellingPrice is <= 0, the rate is clamped to 0 to avoid
// producing invalid data for submission.
export function commissionAmountToRatePercent(
  sellingPrice: number,
  commissionAmount: number,
): number {
  const sp = clampNonNegative(sellingPrice);
  const ca = clampNonNegative(commissionAmount);

  if (sp <= 0 || ca <= 0) return 0;

  const pct = (ca / sp) * 100;
  if (!Number.isFinite(pct) || pct < 0) return 0;
  // Cap at 100 to match backend validation (commissionRate max 100).
  const capped = pct > 100 ? 100 : pct;
  return roundToCents(capped);
}

export function buildCreateOfferPayloadSubset(values: {
  name: string;
  operatorId: string;
  offerType: OfferType;
  price: number;
  resellerCommissionAmount: number;
  isActive: boolean;
  description?: string;
}) {
  const { sellingPrice } = calculateSellingPrice(values.price, "FIXED", 0);
  const sp = sellingPrice > 0 ? sellingPrice : clampNonNegative(values.price);
  const commissionRatePct = commissionAmountToRatePercent(
    sp,
    values.resellerCommissionAmount,
  );

  return {
    name: values.name.trim(),
    operatorId: values.operatorId,
    type: OFFER_TYPE_TO_PRODUCT_TYPE[values.offerType],
    price: roundToCents(sp),
    commissionRate: roundToCents(commissionRatePct),
    referralCommissionRate: 0,
    isActive: values.isActive,
    ...(values.description?.trim()
      ? { description: values.description.trim() }
      : {}),
  };
}

// Map the richer OfferType back to an appropriate amount unit for display
// defaults, mirroring the label conventions used in the form.
export function getDefaultAmountUnitForType(type: OfferType): OfferAmountUnit {
  const units = AMOUNT_UNITS_BY_OFFER_TYPE[type];
  return units[0];
}

// Default validity unit and value for quick setup.
export function getDefaultValidity(type: OfferType): {
  validityValue: number;
  validityUnit: OfferValidityUnit;
} {
  // Sensible defaults by type to reduce form friction without inventing data.
  switch (type) {
    case "MINUTE":
      return { validityValue: 30, validityUnit: "DAYS" };
    case "SMS":
      return { validityValue: 7, validityUnit: "DAYS" };
    case "MB":
      return { validityValue: 30, validityUnit: "DAYS" };
    case "BUNDLE":
    case "COMBO":
      return { validityValue: 30, validityUnit: "DAYS" };
    default:
      return { validityValue: 30, validityUnit: "DAYS" };
  }
}
