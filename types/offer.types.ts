import type { ProductType } from "./enums";
import type { IProduct } from "./product.types";

export type IOffer = IProduct;

export interface IOfferListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  operatorId?: string;
  type?: ProductType;
  isActive?: boolean;
  isDeleted?: boolean;
}
