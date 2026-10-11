import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type {
  ICreateOperatorPayload,
  IOperator,
  IOperatorListParams,
  IUpdateOperatorPayload,
} from "@/types/operator.types";

// The backend exposes its operator catalogue at /api/v1/operators.
const OPERATORS_ENDPOINT = "/operators";

export async function getOperators(
  params: IOperatorListParams = {},
): Promise<ApiResponse<IOperator[]>> {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    isActive:
      params.isActive === undefined ? undefined : String(params.isActive),
    // The list endpoint does not exclude soft-deleted rows by default.
    isDeleted: String(params.isDeleted ?? false),
  });

  const { data, message, meta } = await apiRequest<IOperator[]>(
    `${OPERATORS_ENDPOINT}${queryString}`,
    {
      method: "GET",
    },
  );

  return { success: true, message, data, meta: meta as PaginationMeta | undefined };
}

export async function createOperator(
  payload: ICreateOperatorPayload,
): Promise<IOperator> {
  const { data } = await apiRequest<IOperator>(OPERATORS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}

export async function updateOperator(
  id: string,
  payload: IUpdateOperatorPayload,
): Promise<IOperator> {
  const { data } = await apiRequest<IOperator>(
    `${OPERATORS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function deleteOperator(id: string): Promise<IOperator> {
  const { data } = await apiRequest<IOperator>(
    `${OPERATORS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return data;
}
