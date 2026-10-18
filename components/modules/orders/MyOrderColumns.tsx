"use client";

import Link from "next/link";
import { Eye, Wallet } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { CurrencyCell } from "@/components/shared/cell/CurrencyCell";
import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { Button } from "@/components/ui/button";
import { MY_ORDERS_ROUTE } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { OrderStatus, PaymentStatus } from "@/types/enums";
import type { IOrder } from "@/types/order.types";

interface MyOrderColumnActions {
  onPay: (order: IOrder) => void;
  canPay: (order: IOrder) => boolean;
}

export interface MyOrderColumnLabels {
  order: string;
  quantity: string;
  total: string;
  payment: string;
  status: string;
  placedOn: string;
  actions: string;
  view: string;
  payWithWallet: string;
  unknownOffer: string;
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

export function getMyOrderColumns({
  onPay,
  canPay,
  labels,
}: MyOrderColumnActions & { labels: MyOrderColumnLabels }): ColumnDef<
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
          <div className="flex max-w-[280px] flex-col">
            <span className="font-medium">
              {offer?.name ?? labels.unknownOffer}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {offer?.operator?.name ?? labels.unknownOffer}
            </span>
          </div>
        );
      },
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
        <div className="flex items-center justify-end gap-1">
          {canPay(row.original) ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPay(row.original)}
            >
              <Wallet />
              {labels.payWithWallet}
            </Button>
          ) : null}
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label={`${labels.view} ${row.original.id}`}
          >
            <Link href={`${MY_ORDERS_ROUTE}/${row.original.id}`}>
              <Eye />
            </Link>
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
