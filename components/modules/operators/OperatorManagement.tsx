"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/table/DataTable";
import { DataTableFilters } from "@/components/shared/table/DataTableFilters";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import { DataTableSearch } from "@/components/shared/table/DataTableSearch";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOperators } from "@/hooks/use-operators";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { OperatorDeleteDialog } from "./OperatorDeleteDialog";
import { OperatorFormDialog } from "./OperatorFormDialog";
import { getOperatorColumns } from "./OperatorColumns";
import {
  OPERATOR_STATUS_FILTERS,
  OPERATOR_STATUS_LABELS,
  type OperatorStatusFilter,
} from "./operator.constants";
import type { IOperator } from "@/types/operator.types";

export function OperatorManagement() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<IOperator | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<OperatorStatusFilter>("ALL");

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const {
    searchTerm: searchInput,
    handleSearchInputChange,
    clearSearch,
  } = useServerManagedDataTableSearch({ onSearch: handleSearch });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useOperators({
      page,
      limit,
      searchTerm,
      isActive:
        statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE",
    });

  const columns = useMemo(
    () =>
      getOperatorColumns({
        onEdit: (operator) => {
          setSelectedOperator(operator);
          setFormOpen(true);
        },
        onDelete: (operator) => {
          setSelectedOperator(operator);
          setDeleteOpen(true);
        },
      }),
    [],
  );

  const rows = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? null;
  const totalOperators = meta?.total ?? rows.length;

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { refetch },
  });

  const openCreateDialog = () => {
    setSelectedOperator(null);
    setFormOpen(true);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as OperatorStatusFilter);
    setPage(1);
  };

  const handlePageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operators Management"
        description="Manage the mobile operators that power your telecom catalogue."
      >
        <Button
          type="button"
          className="bg-sky-500 text-slate-950 hover:bg-sky-400"
          onClick={openCreateDialog}
        >
          <Plus />
          Add Operator
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Operators"
          value={totalOperators}
          iconName="operators"
          description="Mobile operators in the catalogue."
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DataTableSearch
          value={searchInput}
          onChange={handleSearchInputChange}
          onClear={clearSearch}
          placeholder="Search operators by name or code..."
        />
        <DataTableFilters
          hasFilters={statusFilter !== "ALL"}
          onClear={() => handleStatusChange("ALL")}
        >
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {OPERATOR_STATUS_FILTERS.map((status) => (
                <SelectItem key={status} value={status}>
                  {OPERATOR_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DataTableFilters>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to load operators</AlertTitle>
          <AlertDescription>
            {error?.message ?? "Something went wrong. Please try again."}
          </AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCcw />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      ) : (
        <DataTable
          table={table}
          isLoading={isLoading}
          emptyStateMessage="No operators found."
        >
          {meta ? (
            <DataTablePagination
              autoPagination={meta}
              isLoading={isFetching}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </DataTable>
      )}

      <OperatorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        operator={selectedOperator}
      />

      <OperatorDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        operator={selectedOperator}
      />
    </div>
  );
}
