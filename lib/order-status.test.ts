import { describe, expect, it } from "vitest";

import { resolveOrderResultState } from "./order-status";

describe("resolveOrderResultState", () => {
  it("returns pending while the order is unpaid", () => {
    expect(resolveOrderResultState("PENDING", "PENDING")).toBe("pending");
  });

  it("returns paid once payment is PAID but the order is not completed", () => {
    expect(resolveOrderResultState("PROCESSING", "PAID")).toBe("paid");
    expect(resolveOrderResultState("WORKING", "PAID")).toBe("paid");
  });

  it("returns fulfilled when the order is COMPLETED", () => {
    expect(resolveOrderResultState("COMPLETED", "PAID")).toBe("fulfilled");
  });

  it("returns cancelled for a cancelled order or payment", () => {
    expect(resolveOrderResultState("CANCELLED", "PAID")).toBe("cancelled");
    expect(resolveOrderResultState("PENDING", "CANCELLED")).toBe("cancelled");
  });

  it("returns failed for a failed order or payment", () => {
    expect(resolveOrderResultState("FAILED", "FAILED")).toBe("failed");
    expect(resolveOrderResultState("PENDING", "FAILED")).toBe("failed");
  });

  it("returns refunded after a refund, even if otherwise completed", () => {
    expect(resolveOrderResultState("COMPLETED", "REFUNDED")).toBe("refunded");
  });
});
