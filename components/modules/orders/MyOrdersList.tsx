"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { PayOrderDialog } from "@/components/modules/orders/PayOrderDialog";
import { getMyOrderColumns } from "@/components/modules/orders/MyOrderColumns";
import { PageHeader } from "@/components/shared/PageHeader";
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
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyOrders } from "@/hooks/use-orders";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
} from "@/types/enums";
import type { IOrder } from "@/types/order.types";

const ALL_VALUE = "ALL";

export function MyOrdersList() {
  const t = useTranslations("orders.list");
  const te = useTranslations("enums");
  const tc = useTranslations("common");
  const { data: currentUser } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | typeof ALL_VALUE>(
    ALL_VALUE,
  );
  const [paymentFilter, setPaymentFilter] = useState<
    PaymentStatus | typeof ALL_VALUE
  >(ALL_VALUE);
  const [payTarget, setPayTarget] = useState<IOrder | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const {
    searchTerm: searchInput,
    handleSearchInputChange,
    clearSearch,
  } = useServerManagedDataTableSearch({ onSearch: handleSearch });

  const { data, isLoading, isFetching, isError, error, refetch } = useMyOrders({
    page,
    limit,
    searchTerm,
    status: statusFilter === ALL_VALUE ? undefined : statusFilter,
    paymentStatus: paymentFilter === ALL_VALUE ? undefined : paymentFilter,
  });

  const canPay = useCallback(
    (order: IOrder) =>
      Boolean(currentUser) &&
      order.userId === currentUser?.id &&
      order.paymentStatus === "PENDING" &&
      order.status !== "CANCELLED" &&
      order.status !== "FAILED" &&
      order.status !== "COMPLETED",
    [currentUser],
  );

  const columns = useMemo(
    () =>
      getMyOrderColumns({
        canPay,
        onPay: (order) => {
          setPayTarget(order);
          setPayOpen(true);
        },
        labels: {
          order: t("columns.order"),
          quantity: t("columns.quantity"),
          total: t("columns.total"),
          payment: t("columns.payment"),
          status: t("columns.status"),
          placedOn: t("columns.placedOn"),
          actions: t("columns.actions"),
          view: t("rowActions.view"),
          payWithWallet: t("rowActions.payWithWallet"),
          unknownOffer: t("unknownOffer"),
        },
      }),
    [canPay, t],
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

  const handlePageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const hasFilters = statusFilter !== ALL_VALUE || paymentFilter !== ALL_VALUE;

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")}>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/dashboard/new-orders">
            <Plus />
            {t("browseOffers")}
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DataTableSearch
          value={searchInput}
          onChange={handleSearchInputChange}
          onClear={clearSearch}
          placeholder={t("searchPlaceholder")}
        />
        <DataTableFilters
          hasFilters={hasFilters}
          onClear={() => {
            setStatusFilter(ALL_VALUE);
            setPaymentFilter(ALL_VALUE);
            setPage(1);
          }}
        >
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as OrderStatus | typeof ALL_VALUE);
              setPage(1);
            }}
          >
            <SelectTrigger size="sm" className="w-[170px]">
              <SelectValue placeholder={t("filters.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t("filters.allStatuses")}</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {te(`orderStatus.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(value) => {
              setPaymentFilter(value as PaymentStatus | typeof ALL_VALUE);
              setPage(1);
            }}
          >
            <SelectTrigger size="sm" className="w-[170px]">
              <SelectValue placeholder={t("filters.allPaymentStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>
                {t("filters.allPaymentStatuses")}
              </SelectItem>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {te(`paymentStatus.${status}`)}
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
          <AlertDescription>{error?.message ?? tc("error")}</AlertDescription>
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

      <PayOrderDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        order={payTarget}
      />
    </div>
  );
}
