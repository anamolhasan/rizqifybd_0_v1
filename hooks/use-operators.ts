"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import { getOperators } from "@/lib/operator-api";
import type { ApiResponse } from "@/types/api.types";
import type { IOperator, IOperatorListParams } from "@/types/operator.types";

export const OPERATORS_QUERY_KEY = "operators" as const;

export function useOperators(params: IOperatorListParams = {}) {
  return useQuery<ApiResponse<IOperator[]>, ApiError>({
    queryKey: [OPERATORS_QUERY_KEY, params],
    queryFn: () => getOperators(params),
    placeholderData: (previousData) => previousData,
  });
}
