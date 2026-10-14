import { describe, expect, it } from "vitest";

import {
  buildCreateOperatorOfferPayload,
  calculateProfitBreakdown,
  calculateSellingPrice,
  clampNonNegative,
  commissionAmountToRatePercent,
  getDefaultAmountUnitForType,
  getDefaultValidity,
  resolveCommissionAmount,
  roundToCents,
} from "@/lib/operator-offer-calculations";

describe("clampNonNegative", () => {
  it("returns the value when non-negative", () => {
    expect(clampNonNegative(12.5)).toBe(12.5);
  });

  it("clamps negative values to zero", () => {
    expect(clampNonNegative(-3)).toBe(0);
  });

  it("returns zero for non-finite input", () => {
    expect(clampNonNegative(Number.NaN)).toBe(0);
    expect(clampNonNegative(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("roundToCents", () => {
  it("rounds to two decimals", () => {
    expect(roundToCents(10.005)).toBe(10.01);
    expect(roundToCents(9.994)).toBe(9.99);
  });

  it("returns zero for non-finite input", () => {
    expect(roundToCents(Number.NaN)).toBe(0);
  });
});

describe("calculateSellingPrice", () => {
  it("returns the regular price when there is no discount", () => {
    expect(calculateSellingPrice(100, "NONE", 50)).toEqual({
      discountAmount: 0,
      sellingPrice: 100,
    });
  });

  it("subtracts a fixed discount", () => {
    expect(calculateSellingPrice(100, "FIXED", 30)).toEqual({
      discountAmount: 30,
      sellingPrice: 70,
    });
  });

  it("applies a percentage discount", () => {
    expect(calculateSellingPrice(200, "PERCENTAGE", 25)).toEqual({
      discountAmount: 50,
      sellingPrice: 150,
    });
  });

  it("caps a fixed discount at the regular price", () => {
    expect(calculateSellingPrice(50, "FIXED", 80)).toEqual({
      discountAmount: 50,
      sellingPrice: 0,
    });
  });

  it("caps a percentage discount at 100%", () => {
    expect(calculateSellingPrice(80, "PERCENTAGE", 150)).toEqual({
      discountAmount: 80,
      sellingPrice: 0,
    });
  });

  it("clamps a negative regular price to zero", () => {
    expect(calculateSellingPrice(-10, "NONE", 0)).toEqual({
      discountAmount: 0,
      sellingPrice: 0,
    });
  });

  it("rounds to two decimals", () => {
    expect(calculateSellingPrice(99.99, "PERCENTAGE", 10)).toEqual({
      discountAmount: 10,
      sellingPrice: 89.99,
    });
  });
});

describe("resolveCommissionAmount", () => {
  it("returns a fixed amount unchanged", () => {
    expect(resolveCommissionAmount(200, "FIXED", 25)).toBe(25);
  });

  it("computes a percentage of the selling price", () => {
    expect(resolveCommissionAmount(200, "PERCENTAGE", 12.5)).toBe(25);
  });

  it("caps a percentage at 100%", () => {
    expect(resolveCommissionAmount(200, "PERCENTAGE", 150)).toBe(200);
  });

  it("clamps a negative value to zero", () => {
    expect(resolveCommissionAmount(200, "FIXED", -5)).toBe(0);
  });

  it("rounds the result to two decimals", () => {
    expect(resolveCommissionAmount(199.99, "PERCENTAGE", 33)).toBe(66);
  });
});

describe("calculateProfitBreakdown", () => {
  const base = {
    regularPrice: 100,
    discountType: "NONE" as const,
    discountValue: 0,
    companyPurchaseCost: 60,
    resellerCommissionType: "FIXED" as const,
    resellerCommissionValue: 10,
    agentCommissionType: "PERCENTAGE" as const,
    agentCommissionValue: 20,
  };

  it("computes reseller, agent, and direct scenarios from the selling price", () => {
    const breakdown = calculateProfitBreakdown(base);

    expect(breakdown.resellerSale.resellerCommissionAmount).toBe(10);
    expect(breakdown.agentSale.agentCommissionAmount).toBe(20);
    expect(breakdown.resellerSale.estimatedProfit).toBe(30);
    expect(breakdown.agentSale.estimatedProfit).toBe(20);
    expect(breakdown.directSale.estimatedProfit).toBe(40);
  });

  it("flags a negative profit without normalising it", () => {
    const breakdown = calculateProfitBreakdown({
      ...base,
      companyPurchaseCost: 95,
      resellerCommissionValue: 10,
    });

    expect(breakdown.resellerSale.estimatedProfit).toBe(-5);
    expect(breakdown.resellerSale.isNegative).toBe(true);
    expect(breakdown.directSale.estimatedProfit).toBe(5);
    expect(breakdown.directSale.isNegative).toBe(false);
  });

  it("computes profit on the discounted selling price", () => {
    const breakdown = calculateProfitBreakdown({
      ...base,
      discountType: "FIXED",
      discountValue: 20,
    });

    expect(breakdown.resellerSale.estimatedProfit).toBe(10);
    expect(breakdown.agentSale.estimatedProfit).toBe(4);
    expect(breakdown.directSale.estimatedProfit).toBe(20);
  });
});

describe("commissionAmountToRatePercent", () => {
  it("converts an amount to a percentage of the selling price", () => {
    expect(commissionAmountToRatePercent(200, 50)).toBe(25);
  });

  it("returns zero when the selling price is zero or negative", () => {
    expect(commissionAmountToRatePercent(0, 50)).toBe(0);
    expect(commissionAmountToRatePercent(-10, 50)).toBe(0);
  });

  it("returns zero when the commission amount is zero or negative", () => {
    expect(commissionAmountToRatePercent(200, 0)).toBe(0);
    expect(commissionAmountToRatePercent(200, -5)).toBe(0);
  });

  it("caps the rate at 100", () => {
    expect(commissionAmountToRatePercent(100, 500)).toBe(100);
  });
});

describe("buildCreateOperatorOfferPayload", () => {
  const base = {
    title: "  Data Pack  ",
    operatorIds: ["op-1"],
    offerType: "MB" as const,
    amount: 10,
    amountUnit: "GB" as const,
    validityValue: 30,
    validityUnit: "DAYS" as const,
    regularPrice: 200,
    discountType: "NONE" as const,
    discountValue: 0,
    companyPurchaseCost: 120,
    resellerCommissionType: "FIXED" as const,
    resellerCommissionValue: 50,
    agentCommissionType: "PERCENTAGE" as const,
    agentCommissionValue: 10,
    inventoryMode: "UNLIMITED" as const,
    stockQuantity: 0,
    badges: ["NEW" as const],
    startsAt: "2026-01-01T00:00",
    endsAt: "2026-02-01T23:59",
    status: "DRAFT" as const,
  };

  it("maps the rich form fields onto the backend payload", () => {
    const payload = buildCreateOperatorOfferPayload({
      ...base,
      description: "  hello  ",
    });

    expect(payload).toEqual({
      name: "Data Pack",
      operatorId: "op-1",
      offerType: "MB",
      amount: 10,
      amountUnit: "GB",
      validityValue: 30,
      validityUnit: "DAYS",
      regularPrice: 200,
      discountType: "NONE",
      discountValue: 0,
      companyPurchasePrice: 120,
      resellerCommissionType: "FIXED",
      resellerCommissionValue: 50,
      agentCommissionType: "PERCENTAGE",
      agentCommissionValue: 10,
      inventoryMode: "UNLIMITED",
      badges: ["NEW"],
      startsAt: new Date("2026-01-01T00:00").toISOString(),
      endsAt: new Date("2026-02-01T23:59").toISOString(),
      status: "DRAFT",
      description: "hello",
    });
  });

  it("includes stock quantity only for limited inventory", () => {
    const payload = buildCreateOperatorOfferPayload({
      ...base,
      inventoryMode: "LIMITED",
      stockQuantity: 25,
      description: "   ",
    });

    expect(payload.stockQuantity).toBe(25);
    expect("description" in payload).toBe(false);
  });

  it("omits stock quantity for unlimited inventory", () => {
    const payload = buildCreateOperatorOfferPayload(base);

    expect("stockQuantity" in payload).toBe(false);
  });
});

describe("defaults", () => {
  it("returns the first amount unit for an offer type", () => {
    expect(getDefaultAmountUnitForType("MB")).toBe("MB");
    expect(getDefaultAmountUnitForType("OTHER")).toBe("PCS");
  });

  it("returns a validity default", () => {
    expect(getDefaultValidity("MINUTE")).toEqual({
      validityValue: 30,
      validityUnit: "DAYS",
    });
  });
});
