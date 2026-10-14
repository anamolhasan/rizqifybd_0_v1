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
  type OperatorStatusFilter,
} from "./operator.constants";
import type { IOperator } from "@/types/operator.types";
import { useTranslations } from "next-intl";

export function OperatorManagement() {
  const t = useTranslations("admin.operators");
  const te = useTranslations("enums");
  const tc = useTranslations("common");
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
        labels: {
          name: t("columns.name"),
          code: t("columns.code"),
          status: t("columns.status"),
          createdAt: t("columns.createdAt"),
          actions: t("columns.actions"),
          edit: t("rowActions.edit"),
          delete: t("rowActions.delete"),
          active: te("operatorStatus.ACTIVE"),
          inactive: te("operatorStatus.INACTIVE"),
        },
      }),
    [t, te],
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
        title={t("title")}
        description={t("description")}
      >
        <Button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={openCreateDialog}
        >
          <Plus />
          {t("addOperator")}
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title={t("statsTitle")}
          value={totalOperators}
          iconName="operators"
          description={t("statsDescription")}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DataTableSearch
          value={searchInput}
          onChange={handleSearchInputChange}
          onClear={clearSearch}
          placeholder={t("searchPlaceholder")}
        />
        <DataTableFilters
          hasFilters={statusFilter !== "ALL"}
          onClear={() => handleStatusChange("ALL")}
        >
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder={te("operatorStatus.ALL")} />
            </SelectTrigger>
            <SelectContent>
              {OPERATOR_STATUS_FILTERS.map((status) => (
                <SelectItem key={status} value={status}>
                  {te(`operatorStatus.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DataTableFilters>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("errorTitle")}</AlertTitle>
          <AlertDescription>
            {error?.message ?? tc("error")}
          </AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCcw />
              {tc("retry")}
            </Button>
          </AlertAction>
        </Alert>
      ) : (
        <DataTable
          table={table}
          isLoading={isLoading}
          emptyStateMessage={t("empty")}
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