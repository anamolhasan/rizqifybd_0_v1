"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type ColumnDef,
  type Table,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import { normalizeQueryString } from "@/lib/query";

export interface UseServerManagedDataTableParams<TData> {
  queryFn: (queryString: string) => Promise<ApiResponse<TData[]>>;
  queryString: string;
  columns: ColumnDef<TData, unknown>[];
  estimatedTotalRows?: number;
}

interface UseServerManagedDataTableResult<TData> {
  table: Table<TData>;
  rows: TData[];
  queryKey: string;
  query: ReturnType<typeof useQuery<ApiResponse<TData[]>>>;
  autoPagination: PaginationMeta | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  updateSearchParams: (updates: Record<string, string | number | null>) => void;
}

export function useServerManagedDataTable<TData>({
  queryFn,
  queryString,
  columns,
  estimatedTotalRows = 10,
}: UseServerManagedDataTableParams<TData>): UseServerManagedDataTableResult<TData> {
  const [currentQueryString, setCurrentQueryString] = useState(() =>
    normalizeQueryString(queryString),
  );

  const queryKey = currentQueryString || "?limit=10";

  const query = useQuery<ApiResponse<TData[]>>({
    queryKey: [queryKey],
    queryFn: () => queryFn(currentQueryString),
    placeholderData: (previousData) => previousData,
  });

  const rows = useMemo(() => query.data?.data ?? [], [query.data?.data]);

  const autoPagination = useMemo(
    () => query.data?.meta ?? null,
    [query.data?.meta],
  );

  const table = useReactTable({
    data: rows,
    columns,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
    },
    rowCount: autoPagination?.total ?? estimatedTotalRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      refetch: query.refetch,
    },
  });

  const updateSearchParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      setCurrentQueryString((previous) => {
        const params = new URLSearchParams(
          normalizeQueryString(previous).slice(1),
        );
        for (const key of Object.keys(updates)) {
          const value = updates[key];
          if (value === null || value === undefined || value === "") {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        }
        const next = params.toString();
        return next ? `?${next}` : "";
      });
    },
    [],
  );

  return {
    table,
    rows,
    queryKey,
    query,
    autoPagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateSearchParams,
  };
}