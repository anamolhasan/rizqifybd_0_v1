"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { CurrencyCell } from "@/components/shared/cell/CurrencyCell";
import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { OrderStatus, PaymentStatus } from "@/types/enums";
import type { IOrder } from "@/types/order.types";

interface OrderColumnActions {
  onManage: (order: IOrder) => void;
}

export interface OrderColumnLabels {
  order: string;
  targetNumber: string;
  quantity: string;
  total: string;
  payment: string;
  status: string;
  placedOn: string;
  actions: string;
  manage: string;
  unknownOffer: string;
  notProvided: string;
}

const PAYMENT_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "outline",
  CANCELLED: "destructive",
};

const ORDER_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  PROCESSING: "secondary",
  WORKING: "secondary",
  COMPLETED: "default",
  CANCELLED: "destructive",
  FAILED: "destructive",
};

export function getOrderColumns({
  onManage,
  labels,
}: OrderColumnActions & { labels: OrderColumnLabels }): ColumnDef<
  IOrder,
  unknown
>[] {
  return [
    {
      id: "order",
      header: labels.order,
      cell: ({ row }) => {
        const offer = row.original.operatorOffer;
        return (
          <div className="flex max-w-[260px] flex-col">
            <span className="font-medium">
              {offer?.name ?? labels.unknownOffer}
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              {row.original.id}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "targetNumber",
      header: labels.targetNumber,
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.targetNumber ?? labels.notProvided}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: labels.quantity,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatNumber(row.original.quantity)}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.total} />
      ),
      cell: ({ row }) => <CurrencyCell value={row.original.totalAmount} />,
    },
    {
      id: "payment",
      header: labels.payment,
      cell: ({ row }) => (
        <PaymentStatusCell status={row.original.paymentStatus} />
      ),
    },
    {
      id: "status",
      header: labels.status,
      cell: ({ row }) => <OrderStatusCell status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.placedOn} />
      ),
      cell: ({ row }) => <DateCell value={row.original.createdAt} withTime />,
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">{labels.actions}</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`${labels.manage} ${row.original.id}`}
            onClick={() => onManage(row.original)}
          >
            <SlidersHorizontal />
            {labels.manage}
          </Button>
        </div>
      ),
    },
  ];
}

function PaymentStatusCell({ status }: { status: PaymentStatus }) {
  const te = useTranslations("enums");
  return (
    <StatusBadgeCell
      status={status}
      label={te(`paymentStatus.${status}`)}
      variantMap={PAYMENT_STATUS_VARIANTS}
    />
  );
}

function OrderStatusCell({ status }: { status: OrderStatus }) {
  const te = useTranslations("enums");
  return (
    <StatusBadgeCell
      status={status}
      label={te(`orderStatus.${status}`)}
      variantMap={ORDER_STATUS_VARIANTS}
    />
  );
}
