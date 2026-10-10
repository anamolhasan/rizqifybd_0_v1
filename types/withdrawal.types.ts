import type { WithdrawalMethod, WithdrawalStatus } from "./enums";
import type { IUser } from "./user.types";

export interface IWithdrawal {
  id: string;
  userId: string;
  amount: number;
  method: WithdrawalMethod;
  accountNumber: string;
  accountName: string | null;
  status: WithdrawalStatus;
  adminNote: string | null;
  processedById: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export interface ICreateWithdrawalPayload {
  amount: number;
  method: WithdrawalMethod;
  accountNumber: string;
  accountName?: string;
}

export interface IUpdateWithdrawalStatusPayload {
  status: WithdrawalStatus;
  adminNote?: string;
}