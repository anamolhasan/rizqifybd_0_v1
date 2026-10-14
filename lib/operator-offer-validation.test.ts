import { describe, expect, it } from "vitest";

import {
  createOperatorOfferSchema,
  OFFER_DATETIME_FORMAT,
} from "@/lib/operator-offer-validation";

const t = (key: string) => key;
const schema = createOperatorOfferSchema(t);

type OfferInput = Record<string, unknown>;

const validInput: OfferInput = {
  title: "Monthly Data Pack",
  description: "A test offer",
  operatorIds: ["op-1"],
  offerType: "MB",
  amount: 5,
  amountUnit: "GB",
  validityValue: 30,
  validityUnit: "DAYS",
  regularPrice: 100,
  discountType: "NONE",
  discountValue: 0,
  companyPurchaseCost: 60,
  resellerCommissionType: "FIXED",
  resellerCommissionValue: 10,
  agentCommissionType: "PERCENTAGE",
  agentCommissionValue: 5,
  inventoryMode: "UNLIMITED",
  stockQuantity: undefined,
  badges: [],
  startsAt: "2025-01-01T10:00",
  endsAt: "2025-02-01T10:00",
  status: "DRAFT",
};

function input(overrides: OfferInput = {}): OfferInput {
  return { ...validInput, ...overrides };
}

function issuePaths(result: ReturnType<typeof schema.safeParse>): string[] {
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("createOperatorOfferSchema - happy path", () => {
  it("accepts a fully valid offer", () => {
    const result = schema.safeParse(input());
    expect(result.success).toBe(true);
  });

  it("accepts an unlimited offer with no stock quantity", () => {
    const result = schema.safeParse(
      input({ inventoryMode: "UNLIMITED", stockQuantity: undefined }),
    );
    expect(result.success).toBe(true);
  });

  it("accepts a limited offer with a positive integer stock", () => {
    const result = schema.safeParse(
      input({ inventoryMode: "LIMITED", stockQuantity: 25 }),
    );
    expect(result.success).toBe(true);
  });
});

describe("createOperatorOfferSchema - required and range fields", () => {
  it("requires a title", () => {
    const result = schema.safeParse(input({ title: "   " }));
    expect(issuePaths(result)).toContain("title");
  });

  it("rejects a title longer than 150 characters", () => {
    const result = schema.safeParse(input({ title: "a".repeat(151) }));
    expect(issuePaths(result)).toContain("title");
  });

  it("requires at least one operator", () => {
    const result = schema.safeParse(input({ operatorIds: [] }));
    expect(issuePaths(result)).toContain("operatorIds");
  });

  it("rejects a non-positive amount", () => {
    const result = schema.safeParse(input({ amount: 0 }));
    expect(issuePaths(result)).toContain("amount");
  });

  it("rejects a fractional amount", () => {
    const result = schema.safeParse(input({ amount: 1.5 }));
    expect(issuePaths(result)).toContain("amount");
  });

  it("rejects a negative regular price", () => {
    const result = schema.safeParse(input({ regularPrice: -1 }));
    expect(issuePaths(result)).toContain("regularPrice");
  });

  it("rejects a negative company cost", () => {
    const result = schema.safeParse(input({ companyPurchaseCost: -5 }));
    expect(issuePaths(result)).toContain("companyPurchaseCost");
  });

  it("rejects a non-positive validity", () => {
    const result = schema.safeParse(input({ validityValue: 0 }));
    expect(issuePaths(result)).toContain("validityValue");
  });

  it("rejects a fractional validity", () => {
    const result = schema.safeParse(input({ validityValue: 1.5 }));
    expect(issuePaths(result)).toContain("validityValue");
  });

  it("rejects an unknown offer type", () => {
    const result = schema.safeParse(input({ offerType: "UNKNOWN" }));
    expect(issuePaths(result)).toContain("offerType");
  });
});

describe("createOperatorOfferSchema - discount rules", () => {
  it("accepts a percentage discount at the 100% boundary", () => {
    const result = schema.safeParse(
      input({
        discountType: "PERCENTAGE",
        discountValue: 100,
        resellerCommissionValue: 0,
        agentCommissionValue: 0,
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a percentage discount above 100", () => {
    const result = schema.safeParse(
      input({ discountType: "PERCENTAGE", discountValue: 101 }),
    );
    expect(issuePaths(result)).toContain("discountValue");
  });

  it("accepts a fixed discount equal to the regular price", () => {
    const result = schema.safeParse(
      input({
        regularPrice: 50,
        discountType: "FIXED",
        discountValue: 50,
        resellerCommissionValue: 0,
        agentCommissionValue: 0,
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a fixed discount greater than the regular price", () => {
    const result = schema.safeParse(
      input({ regularPrice: 50, discountType: "FIXED", discountValue: 51 }),
    );
    expect(issuePaths(result)).toContain("discountValue");
  });

  it("rejects a negative discount value", () => {
    const result = schema.safeParse(
      input({ discountType: "FIXED", discountValue: -1 }),
    );
    expect(issuePaths(result)).toContain("discountValue");
  });
});

describe("createOperatorOfferSchema - commission rules", () => {
  it("accepts a percentage commission at the 100% boundary", () => {
    const result = schema.safeParse(
      input({ resellerCommissionType: "PERCENTAGE", resellerCommissionValue: 100 }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a reseller percentage commission above 100", () => {
    const result = schema.safeParse(
      input({
        resellerCommissionType: "PERCENTAGE",
        resellerCommissionValue: 101,
      }),
    );
    expect(issuePaths(result)).toContain("resellerCommissionValue");
  });

  it("rejects an agent percentage commission above 100", () => {
    const result = schema.safeParse(
      input({
        agentCommissionType: "PERCENTAGE",
        agentCommissionValue: 101,
      }),
    );
    expect(issuePaths(result)).toContain("agentCommissionValue");
  });

  it("accepts a fixed commission equal to the selling price", () => {
    const result = schema.safeParse(
      input({
        regularPrice: 100,
        discountType: "NONE",
        resellerCommissionType: "FIXED",
        resellerCommissionValue: 100,
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a fixed reseller commission above the selling price", () => {
    const result = schema.safeParse(
      input({
        regularPrice: 100,
        discountType: "NONE",
        resellerCommissionType: "FIXED",
        resellerCommissionValue: 101,
      }),
    );
    expect(issuePaths(result)).toContain("resellerCommissionValue");
  });

  it("evaluates fixed commissions against the discounted selling price", () => {
    const result = schema.safeParse(
      input({
        regularPrice: 100,
        discountType: "FIXED",
        discountValue: 40,
        resellerCommissionType: "FIXED",
        resellerCommissionValue: 65,
      }),
    );
    expect(issuePaths(result)).toContain("resellerCommissionValue");
  });

  it("rejects a fixed agent commission above the selling price", () => {
    const result = schema.safeParse(
      input({
        regularPrice: 100,
        discountType: "NONE",
        agentCommissionType: "FIXED",
        agentCommissionValue: 101,
      }),
    );
    expect(issuePaths(result)).toContain("agentCommissionValue");
  });

  it("rejects a negative commission value", () => {
    const result = schema.safeParse(
      input({ resellerCommissionType: "FIXED", resellerCommissionValue: -1 }),
    );
    expect(issuePaths(result)).toContain("resellerCommissionValue");
  });
});

describe("createOperatorOfferSchema - inventory rules", () => {
  it("requires a stock quantity for limited inventory", () => {
    const result = schema.safeParse(
      input({ inventoryMode: "LIMITED", stockQuantity: undefined }),
    );
    expect(issuePaths(result)).toContain("stockQuantity");
  });

  it("rejects a negative stock quantity", () => {
    const result = schema.safeParse(
      input({ inventoryMode: "LIMITED", stockQuantity: -1 }),
    );
    expect(issuePaths(result)).toContain("stockQuantity");
  });

  it("rejects a fractional stock quantity", () => {
    const result = schema.safeParse(
      input({ inventoryMode: "LIMITED", stockQuantity: 1.5 }),
    );
    expect(issuePaths(result)).toContain("stockQuantity");
  });

  it("does not block unlimited inventory when stock is absent", () => {
    const result = schema.safeParse(
      input({ inventoryMode: "UNLIMITED", stockQuantity: "" }),
    );
    expect(result.success).toBe(true);
  });
});

describe("createOperatorOfferSchema - scheduling rules", () => {
  it("uses the shared local date-time format", () => {
    expect(OFFER_DATETIME_FORMAT).toBe("yyyy-MM-dd'T'HH:mm");
  });

  it("requires a start date/time", () => {
    const result = schema.safeParse(input({ startsAt: "" }));
    expect(issuePaths(result)).toContain("startsAt");
  });

  it("requires an end date/time", () => {
    const result = schema.safeParse(input({ endsAt: "" }));
    expect(issuePaths(result)).toContain("endsAt");
  });

  it("rejects an unparseable start date/time", () => {
    const result = schema.safeParse(input({ startsAt: "not-a-date" }));
    expect(issuePaths(result)).toContain("startsAt");
  });

  it("rejects an end date/time equal to the start", () => {
    const result = schema.safeParse(
      input({ startsAt: "2025-01-01T10:00", endsAt: "2025-01-01T10:00" }),
    );
    expect(issuePaths(result)).toContain("endsAt");
  });

  it("rejects an end date/time before the start", () => {
    const result = schema.safeParse(
      input({ startsAt: "2025-02-01T10:00", endsAt: "2025-01-01T10:00" }),
    );
    expect(issuePaths(result)).toContain("endsAt");
  });

  it("accepts an end date/time after the start", () => {
    const result = schema.safeParse(
      input({ startsAt: "2025-01-01T10:00", endsAt: "2025-01-01T11:00" }),
    );
    expect(result.success).toBe(true);
  });
});
