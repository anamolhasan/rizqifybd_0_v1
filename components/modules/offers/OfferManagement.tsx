"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";

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
import { useOffers } from "@/hooks/use-offers";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { OfferDeleteDialog } from "@/components/modules/offers/OfferDeleteDialog";
import { OfferFormDialog } from "@/components/modules/offers/OfferFormDialog";
import { getOfferColumns } from "@/components/modules/offers/OfferColumns";
import type { IOffer } from "@/types/offer.types";

export function OfferManagement() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);
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

  const { data, isLoading, isFetching, isError, error, refetch } = useOffers({
    page,
    limit,
    searchTerm,
  });

  const columns = useMemo(
    () =>
      getOfferColumns({
        onEdit: (offer) => {
          setSelectedOffer(offer);
          setFormOpen(true);
        },
        onDelete: (offer) => {
          setSelectedOffer(offer);
          setDeleteOpen(true);
        },
      }),
    [],
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
        title="Offers"
        description="Manage telecom offers for operators and products in your catalogue."
      >
        <Button
          type="button"
          className="bg-sky-500 text-slate-950 hover:bg-sky-400"
          onClick={openCreateDialog}
        >
          <Plus />
          Add Offer
        </Button>
      </PageHeader>

      <DataTableSearch
        value={searchInput}
        onChange={handleSearchInputChange}
        onClear={clearSearch}
        placeholder="Search offers by name or operator..."
      />

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to load offers</AlertTitle>
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
          emptyStateMessage="No offers found."
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

      <OfferFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        offer={selectedOffer}
      />

      <OfferDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        offer={selectedOffer}
      />
    </div>
  );
}
