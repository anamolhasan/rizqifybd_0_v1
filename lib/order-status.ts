import type { OrderStatus, PaymentStatus } from "@/types/enums";

// The customer-facing result of an order is derived from the two lifecycle enums
// the backend returns (order status + payment status). Terminal and exception
// states take precedence so a cancelled, failed or refunded order is never
// reported as merely pending or paid. PROCESSING/WORKING both mean "paid, still
// being fulfilled", so they surface as `paid` until the order is COMPLETED.
export type OrderResultState =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "failed"
  | "refunded";

export function resolveOrderResultState(
  status: OrderStatus,
  paymentStatus: PaymentStatus,
): OrderResultState {
  if (status === "CANCELLED" || paymentStatus === "CANCELLED") {
    return "cancelled";
  }

  if (status === "FAILED" || paymentStatus === "FAILED") {
    return "failed";
  }

  if (paymentStatus === "REFUNDED") {
    return "refunded";
  }

  if (status === "COMPLETED") {
    return "fulfilled";
  }

  if (paymentStatus === "PAID") {
    return "paid";
  }

  return "pending";
}
