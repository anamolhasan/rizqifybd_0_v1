"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { CurrencyCell } from "@/components/shared/cell/CurrencyCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { IOperatorOffer, OperatorOfferStatus } from "@/types/operator-offer.types";

interface OperatorOfferColumnActions {
  onEdit: (offer: IOperatorOffer) => void;
  onDelete: (offer: IOperatorOffer) => void;
}

export interface OperatorOfferColumnLabels {
  offer: string;
  operator: string;
  type: string;
  price: string;
  commission: string;
  status: string;
  actions: string;
  edit: string;
  delete: string;
}

const OFFER_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  SCHEDULED: "secondary",
  ACTIVE: "default",
  PAUSED: "secondary",
  EXPIRED: "outline",
  OUT_OF_STOCK: "destructive",
};

export function getOperatorOfferColumns({
  onEdit,
  onDelete,
  labels,
}: OperatorOfferColumnActions & { labels: OperatorOfferColumnLabels }): ColumnDef<
  IOperatorOffer,
  unknown
>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.offer} />
      ),
      cell: ({ row }) => (
        <div className="flex max-w-[320px] flex-col">
          <span className="font-medium">{row.original.name}</span>
          {row.original.description ? (
            <span className="truncate text-xs text-muted-foreground">
              {row.original.description}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "operator.name",
      header: labels.operator,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.operator?.name ?? "—"}</span>
      ),
    },
    {
      accessorKey: "offerType",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.type} />
      ),
      cell: ({ row }) => <OperatorOfferTypeBadge type={row.original.offerType} />,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.price} />
      ),
      cell: ({ row }) => <CurrencyCell value={row.original.price} />,
    },
    {
      accessorKey: "commissionRate",
      header: labels.commission,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatNumber(row.original.commissionRate)}%
        </span>
      ),
    },
    {
      id: "status",
      header: labels.status,
      cell: ({ row }) => <OperatorOfferStatusCell status={row.original.status} />,
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">{labels.actions}</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`${labels.edit} ${row.original.name}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            aria-label={`${labels.delete} ${row.original.name}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}

function OperatorOfferTypeBadge({ type }: { type: IOperatorOffer["offerType"] }) {
  const te = useTranslations("enums");
  return <Badge variant="secondary">{te(`offerType.${type}`)}</Badge>;
}

function OperatorOfferStatusCell({ status }: { status: OperatorOfferStatus }) {
  const te = useTranslations("enums");
  return (
    <StatusBadgeCell
      status={status}
      label={te(`offerStatus.${status}`)}
      variantMap={OFFER_STATUS_VARIANTS}
    />
  );
}
