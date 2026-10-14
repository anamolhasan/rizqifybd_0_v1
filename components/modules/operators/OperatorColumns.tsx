"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IOperator } from "@/types/operator.types";

interface OperatorColumnActions {
  onEdit: (operator: IOperator) => void;
  onDelete: (operator: IOperator) => void;
}

export interface OperatorColumnLabels {
  name: string;
  code: string;
  status: string;
  createdAt: string;
  actions: string;
  edit: string;
  delete: string;
  active: string;
  inactive: string;
}

export function getOperatorColumns({
  onEdit,
  onDelete,
  labels,
}: OperatorColumnActions & { labels: OperatorColumnLabels }): ColumnDef<
  IOperator,
  unknown
>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.name} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "code",
      header: labels.code,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono tracking-wide">
          {row.original.code}
        </Badge>
      ),
    },
    {
      id: "status",
      header: labels.status,
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.isActive ? "ACTIVE" : "INACTIVE"}
          label={
            row.original.isActive ? labels.active : labels.inactive
          }
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={labels.createdAt} />
      ),
      cell: ({ row }) => <DateCell value={row.original.createdAt} />,
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