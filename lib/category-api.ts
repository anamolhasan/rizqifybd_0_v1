import { apiRequest } from "./api";

import type { ApiResponse } from "@/types/api.types";
import type {
  ICategory,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/types/category.types";

// The backend exposes its category/specialty taxonomy at /api/v1/specialties.
const CATEGORIES_ENDPOINT = "/specialties";

export async function getCategories(): Promise<ApiResponse<ICategory[]>> {
  const { data, message } = await apiRequest<ICategory[]>(CATEGORIES_ENDPOINT, {
    method: "GET",
  });

  return { success: true, message, data };
}

export async function createCategory(
  payload: ICreateCategoryPayload,
): Promise<ICategory> {
  const { data } = await apiRequest<ICategory>(CATEGORIES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}

export async function updateCategory(
  id: string,
  payload: IUpdateCategoryPayload,
): Promise<ICategory> {
  const { data } = await apiRequest<ICategory>(
    `${CATEGORIES_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function deleteCategory(id: string): Promise<ICategory> {
  const { data } = await apiRequest<ICategory>(
    `${CATEGORIES_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return data;
}
