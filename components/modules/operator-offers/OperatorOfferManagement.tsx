"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/table/DataTable";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import { DataTableSearch } from "@/components/shared/table/DataTableSearch";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useOperatorOffers } from "@/hooks/use-operator-offers";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { OperatorOfferDeleteDialog } from "@/components/modules/operator-offers/OperatorOfferDeleteDialog";
import { OperatorOfferFormDialog } from "@/components/modules/operator-offers/OperatorOfferFormDialog";
import { getOperatorOfferColumns } from "@/components/modules/operator-offers/OperatorOfferColumns";
import type { IOperatorOffer } from "@/types/operator-offer.types";

export function OperatorOfferManagement() {
  const t = useTranslations("admin.operatorOffers");
  const tc = useTranslations("common");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IOperatorOffer | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const {
    searchTerm: searchInput,
    handleSearchInputChange,
    clearSearch,
  } = useServerManagedDataTableSearch({ onSearch: handleSearch });

  const { data, isLoading, isFetching, isError, error, refetch } = useOperatorOffers({
    page,
    limit,
    searchTerm,
  });

  const columns = useMemo(
    () =>
      getOperatorOfferColumns({
        onEdit: (offer) => {
          setSelectedOffer(offer);
          setFormOpen(true);
        },
        onDelete: (offer) => {
          setSelectedOffer(offer);
          setDeleteOpen(true);
        },
        labels: {
          offer: t("columns.offer"),
          operator: t("columns.operator"),
          type: t("columns.type"),
          price: t("columns.price"),
          commission: t("columns.commission"),
          status: t("columns.status"),
          actions: t("columns.actions"),
          edit: t("rowActions.edit"),
          delete: t("rowActions.delete"),
        },
      }),
    [t],
  );

  const rows = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? null;

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { refetch },
  });

  const openCreateDialog = () => {
    setSelectedOffer(null);
    setFormOpen(true);
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
          {t("addOffer")}
        </Button>
      </PageHeader>

      <DataTableSearch
        value={searchInput}
        onChange={handleSearchInputChange}
        onClear={clearSearch}
        placeholder={t("searchPlaceholder")}
      />

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

      <OperatorOfferFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        offer={selectedOffer}
      />

      <OperatorOfferDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        offer={selectedOffer}
      />
    </div>
  );
}