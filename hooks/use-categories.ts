"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/category-api";
import type { ApiResponse } from "@/types/api.types";
import type {
  ICategory,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/types/category.types";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useCategories() {
  return useQuery<ApiResponse<ICategory[]>, ApiError>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<ICategory, ApiError, ICreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: (category) => {
      toast.success("Category created", {
        description: `“${category.title}” has been added.`,
      });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error("Failed to create category", {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateCategoryVariables {
  id: string;
  payload: IUpdateCategoryPayload;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<ICategory, ApiError, IUpdateCategoryVariables>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: (category) => {
      toast.success("Category updated", {
        description: `“${category.title}” has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error("Failed to update category", {
        description: describeError(error),
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<ICategory, ApiError, string>({
    mutationFn: deleteCategory,
    onSuccess: (category) => {
      toast.success("Category deleted", {
        description: `“${category.title}” has been removed.`,
      });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error("Failed to delete category", {
        description: describeError(error),
      });
    },
  });
}
