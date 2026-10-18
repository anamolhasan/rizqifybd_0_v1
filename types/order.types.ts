import type {
  OrderStatus,
  PaymentStatus,
} from "./enums";
import type { IOperator } from "./operator.types";
import type { IOperatorOffer } from "./operator-offer.types";
import type { IWalletTransaction } from "./wallet.types";

export interface IOrderOperatorOffer {
  operator: IOperator;
}

export interface IOrder {
  id: string;
  userId: string;
  sellerId: string | null;
  operatorOfferId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  commissionAmount: number;
  referralCommissionAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  targetNumber: string | null;
  note: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  operatorOffer?: (IOperatorOffer & { operator?: IOperator }) | null;
  payment?: IPayment | null;
}

export interface IPayment {
  id: string;
  orderId: string;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
  metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrderPayload {
  operatorOfferId: string;
  quantity?: number;
  targetNumber?: string;
  note?: string;
  buyerId?: string;
}

export interface ICreateOrderWithWalletPayload {
  operatorOfferId: string;
  quantity?: number;
  targetNumber?: string;
  note?: string;
  idempotencyKey?: string;
}

export interface ICreateOrderWithWalletResult {
  order: IOrder;
  walletTransaction: IWalletTransaction | null;
  idempotent: boolean;
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
}

// Query contract shared by the customer (/orders/my) and staff (/orders) list
// endpoints. Both use the backend QueryBuilder, so they accept the same generic
// pagination/sort params plus per-endpoint filterable fields.
export interface IOrderListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  operatorOfferId?: string;
  userId?: string;
}

export interface IPayOrderResult {
  orderId: string;
  paymentId: string;
  paymentUrl: string | null;
}