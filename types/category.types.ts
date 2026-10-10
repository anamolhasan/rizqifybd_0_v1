export interface ICategory {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface ICreateCategoryPayload {
  title: string;
  description?: string;
}

export type IUpdateCategoryPayload = Partial<ICreateCategoryPayload>;
