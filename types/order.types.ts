import type {
  OrderStatus,
  PaymentStatus,
} from "./enums";
import type { IOperator } from "./operator.types";
import type { IProduct } from "./product.types";

export interface IOrderProduct {
  operator: IOperator;
}

export interface IOrder {
  id: string;
  userId: string;
  sellerId: string | null;
  productId: string;
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
  product?: (IProduct & { operator?: IOperator }) | null;
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
  productId: string;
  quantity?: number;
  targetNumber?: string;
  note?: string;
  buyerId?: string;
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface IPayOrderResult {
  orderId: string;
  paymentId: string;
  paymentUrl: string | null;
}