export interface IOperator {
  id: string;
  name: string;
  code: string;
  logo: string | null;
  logoPublicId: string | null;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOperatorPayload {
  name: string;
  code: string;
  logo?: string;
  logoPublicId?: string;
  isActive?: boolean;
}

export type IUpdateOperatorPayload = Partial<ICreateOperatorPayload>;

export interface IDeleteOperatorResult {
  id: string;
  isDeleted: boolean;
  deletedAt: string;
}

export interface IOperatorListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  isDeleted?: boolean;
}