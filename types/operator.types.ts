export interface IOperator {
  id: string;
  name: string;
  code: string;
  logo: string | null;
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
  isActive?: boolean;
}

export interface IUpdateOperatorPayload
  extends Partial<ICreateOperatorPayload> {}

export interface IDeleteOperatorResult {
  id: string;
  isDeleted: boolean;
  deletedAt: string;
}