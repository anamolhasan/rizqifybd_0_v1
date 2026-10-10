import type {
  WalletTransactionReason,
  WalletTransactionType,
} from "./enums";

export interface IWalletSummary {
  balance: number;
  totalEarned: number;
  canEarn: boolean;
  referredBy: string | null;
}

export interface IWalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  reason: WalletTransactionReason;
  amount: number;
  balanceAfter: number;
  description: string | null;
  orderId: string | null;
  withdrawalId: string | null;
  createdAt: string;
}

export interface IAdjustWalletPayload {
  userId: string;
  amount: number;
  type: WalletTransactionType;
  reason?: WalletTransactionReason;
  description?: string;
}