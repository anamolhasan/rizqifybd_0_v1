import type {
  ICreateOperatorOfferPayload,
  OperatorOfferAmountUnit,
  OperatorOfferBadge,
  OperatorOfferCommissionType,
  OperatorOfferDiscountType,
  OperatorOfferInventoryMode,
  OperatorOfferStatus,
  OperatorOfferType,
  OperatorOfferValidityUnit,
} from "@/types/operator-offer.types";
import { AMOUNT_UNITS_BY_OFFER_TYPE } from "@/components/modules/operator-offers/add-operator-offer.constants";

export interface OperatorOfferPriceBreakdown {
  discountAmount: number;
  sellingPrice: number;
}

export interface OperatorOfferProfitScenario {
  resellerCommissionAmount: number;
  agentCommissionAmount: number;
  estimatedProfit: number;
  isNegative: boolean;
}

export interface OperatorOfferProfitBreakdown {
  resellerSale: OperatorOfferProfitScenario;
  agentSale: OperatorOfferProfitScenario;
  directSale: OperatorOfferProfitScenario;
}

export interface OperatorOfferCalculationInput {
  regularPrice: number;
  discountType: OperatorOfferDiscountType;
  discountValue: number;
  companyPurchaseCost: number;
  resellerCommissionType: OperatorOfferCommissionType;
  resellerCommissionValue: number;
  agentCommissionType: OperatorOfferCommissionType;
  agentCommissionValue: number;
}

export const ZERO_PROFIT_SCENARIO: OperatorOfferProfitScenario = {
  resellerCommissionAmount: 0,
  agentCommissionAmount: 0,
  estimatedProfit: 0,
  isNegative: false,
};

export const ZERO_PROFIT_BREAKDOWN: OperatorOfferProfitBreakdown = {
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
  discountType: OperatorOfferDiscountType,
  discountValue: number,
): OperatorOfferPriceBreakdown {
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

export function resolveCommissionAmount(
  sellingPrice: number,
  type: OperatorOfferCommissionType,
  value: number,
): number {
  const amount = clampNonNegative(value);
  if (type === "PERCENTAGE") {
    const pct = amount > 100 ? 100 : amount;
    return roundToCents((clampNonNegative(sellingPrice) * pct) / 100);
  }
  return roundToCents(amount);
}

export function calculateProfitBreakdown(
  input: OperatorOfferCalculationInput,
): OperatorOfferProfitBreakdown {
  const { sellingPrice } = calculateSellingPrice(
    input.regularPrice,
    input.discountType,
    input.discountValue,
  );

  const cost = clampNonNegative(input.companyPurchaseCost);
  const resellerComm = resolveCommissionAmount(
    sellingPrice,
    input.resellerCommissionType,
    input.resellerCommissionValue,
  );
  const agentComm = resolveCommissionAmount(
    sellingPrice,
    input.agentCommissionType,
    input.agentCommissionValue,
  );

  // Treat reseller and agent sales as mutually exclusive commission scenarios.
  // Estimated platform profit = (Selling Price - Company Purchase Cost - Applicable Commission)
  const buildScenario = (applicableCommission: number): OperatorOfferProfitScenario => {
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

export interface OperatorOfferPayloadInput {
  title: string;
  description?: string;
  operatorIds: string[];
  offerType: OperatorOfferType;
  amount: number;
  amountUnit: OperatorOfferAmountUnit;
  validityValue: number;
  validityUnit: OperatorOfferValidityUnit;
  regularPrice: number;
  discountType: OperatorOfferDiscountType;
  discountValue: number;
  companyPurchaseCost: number;
  resellerCommissionType: OperatorOfferCommissionType;
  resellerCommissionValue: number;
  agentCommissionType: OperatorOfferCommissionType;
  agentCommissionValue: number;
  inventoryMode: OperatorOfferInventoryMode;
  stockQuantity?: number;
  badges: OperatorOfferBadge[];
  startsAt: string;
  endsAt: string;
  status: OperatorOfferStatus;
}

// Convert the form's local wall-clock string (yyyy-MM-ddTHH:mm) into an absolute
// ISO-8601 instant so the backend stores a consistent UTC timestamp.
function localDateTimeToIso(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

// Map the rich authoring form onto the backend's OperatorOffer contract. The
// selling price, commission rate and profits are deliberately NOT sent: the
// server recomputes them authoritatively from this raw configuration.
export function buildCreateOperatorOfferPayload(
  values: OperatorOfferPayloadInput,
): ICreateOperatorOfferPayload {
  const payload: ICreateOperatorOfferPayload = {
    operatorId: values.operatorIds[0] ?? "",
    name: values.title.trim(),
    offerType: values.offerType,
    amount: values.amount,
    amountUnit: values.amountUnit,
    validityValue: values.validityValue,
    validityUnit: values.validityUnit,
    regularPrice: values.regularPrice,
    discountType: values.discountType,
    discountValue: values.discountValue,
    companyPurchasePrice: values.companyPurchaseCost,
    resellerCommissionType: values.resellerCommissionType,
    resellerCommissionValue: values.resellerCommissionValue,
    agentCommissionType: values.agentCommissionType,
    agentCommissionValue: values.agentCommissionValue,
    inventoryMode: values.inventoryMode,
    badges: values.badges,
    startsAt: localDateTimeToIso(values.startsAt),
    endsAt: localDateTimeToIso(values.endsAt),
    status: values.status,
  };

  if (values.inventoryMode === "LIMITED") {
    payload.stockQuantity = values.stockQuantity ?? 0;
  }

  if (values.description?.trim()) {
    payload.description = values.description.trim();
  }

  return payload;
}

// Map the richer OperatorOfferType back to an appropriate amount unit for display
// defaults, mirroring the label conventions used in the form.
export function getDefaultAmountUnitForType(type: OperatorOfferType): OperatorOfferAmountUnit {
  const units = AMOUNT_UNITS_BY_OFFER_TYPE[type];
  return units[0];
}

// Default validity unit and value for quick setup.
export function getDefaultValidity(type: OperatorOfferType): {
  validityValue: number;
  validityUnit: OperatorOfferValidityUnit;
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
