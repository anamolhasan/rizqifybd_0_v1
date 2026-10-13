"use client";

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: TanStackTable<TData>;
  children?: React.ReactNode;
  emptyStateMessage?: string | null;
  isLoading?: boolean;
  isRefetching?: boolean;
  skeletonRowCount?: number;
}

export function DataTable<TData>({
  table,
  children,
  emptyStateMessage,
  isLoading = false,
  isRefetching = false,
  skeletonRowCount = 5,
  className,
  ...props
}: DataTableProps<TData>) {
  const t = useTranslations("common");
  const emptyMessage =
    emptyStateMessage === undefined ? t("noResults") : emptyStateMessage;
  const refetch = (
    table.options.meta as { refetch?: () => void } | undefined
  )?.refetch;

  const columns = table.getAllColumns();
  const showRefetchIndicator = isRefetching && !isLoading;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        aria-busy={isLoading || isRefetching}
        className="relative overflow-hidden rounded-xl border bg-card"
      >
        {showRefetchIndicator ? (
          <div
            role="progressbar"
            aria-label={t("refreshingData")}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden"
          >
            <div className="h-full w-full animate-pulse bg-primary/70" />
          </div>
        ) : null}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} aria-hidden="true">
                  {columns.map((_, cellIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${cellIndex}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <RefreshCcw className="size-5" />
                    <span>{emptyMessage}</span>
                    {refetch ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                      >
                        {t("refresh")}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {children}
    </div>
  );
}
