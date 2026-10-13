"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { CurrencyCell } from "@/components/shared/cell/CurrencyCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { OFFER_TYPE_LABELS } from "@/components/modules/offers/offer.constants";
import type { IProduct } from "@/types/product.types";

interface OfferColumnActions {
  onEdit: (offer: IProduct) => void;
  onDelete: (offer: IProduct) => void;
}

export function getOfferColumns({
  onEdit,
  onDelete,
}: OfferColumnActions): ColumnDef<IProduct, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title="Offer" />
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
      header: "Operator",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.operator?.name ?? "—"}</span>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {OFFER_TYPE_LABELS[row.original.type]}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title="Price" />
      ),
      cell: ({ row }) => <CurrencyCell value={row.original.price} />,
    },
    {
      accessorKey: "commissionRate",
      header: "Commission",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatNumber(row.original.commissionRate)}%
        </span>
      ),
    },
    {
      accessorKey: "referralCommissionRate",
      header: "Referral",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatNumber(row.original.referralCommissionRate)}%
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.isActive ? "ACTIVE" : "INACTIVE"}
          label={row.original.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${row.original.name}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            aria-label={`Delete ${row.original.name}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}
