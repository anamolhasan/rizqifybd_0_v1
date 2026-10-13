import type { ProductType } from "./enums";

export interface IProduct {
  id: string;
  operatorId: string;
  name: string;
  description: string | null;
  type: ProductType;
  price: number;
  commissionRate: number;
  referralCommissionRate: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  operator?: { id: string; name: string; code: string; logo: string | null } | null;
}

export interface ICreateProductPayload {
  operatorId: string;
  name: string;
  description?: string;
  type?: ProductType;
  price: number;
  commissionRate?: number;
  referralCommissionRate?: number;
  isActive?: boolean;
}

export interface IUpdateProductPayload
  extends Partial<ICreateProductPayload> {}

export interface IDeleteProductResult {
  id: string;
  isDeleted: boolean;
  deletedAt: string;
}