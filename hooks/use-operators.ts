"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  createOperator,
  deleteOperator,
  getOperators,
  updateOperator,
} from "@/lib/operator-api";
import type { ApiResponse } from "@/types/api.types";
import type {
  ICreateOperatorPayload,
  IOperator,
  IOperatorListParams,
  IUpdateOperatorPayload,
} from "@/types/operator.types";

export const OPERATORS_QUERY_KEY = "operators" as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useOperators(params: IOperatorListParams = {}) {
  return useQuery<ApiResponse<IOperator[]>, ApiError>({
    queryKey: [OPERATORS_QUERY_KEY, params],
    queryFn: () => getOperators(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateOperator() {
  const queryClient = useQueryClient();

  return useMutation<IOperator, ApiError, ICreateOperatorPayload>({
    mutationFn: createOperator,
    onSuccess: (operator) => {
      toast.success("Operator created", {
        description: `“${operator.name}” has been added.`,
      });
      queryClient.invalidateQueries({ queryKey: [OPERATORS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to create operator", {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateOperatorVariables {
  id: string;
  payload: IUpdateOperatorPayload;
}

export function useUpdateOperator() {
  const queryClient = useQueryClient();

  return useMutation<IOperator, ApiError, IUpdateOperatorVariables>({
    mutationFn: ({ id, payload }) => updateOperator(id, payload),
    onSuccess: (operator) => {
      toast.success("Operator updated", {
        description: `“${operator.name}” has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: [OPERATORS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to update operator", {
        description: describeError(error),
      });
    },
  });
}

export function useDeleteOperator() {
  const queryClient = useQueryClient();

  return useMutation<IOperator, ApiError, string>({
    mutationFn: deleteOperator,
    onSuccess: (operator) => {
      toast.success("Operator deleted", {
        description: `“${operator.name}” has been removed.`,
      });
      queryClient.invalidateQueries({ queryKey: [OPERATORS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to delete operator", {
        description: describeError(error),
      });
    },
  });
}
