"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DateCell } from "@/components/shared/cell/DateCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { Button } from "@/components/ui/button";
import type { ICategory } from "@/types/category.types";

interface CategoryColumnActions {
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export function getCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnActions): ColumnDef<ICategory, unknown>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="block max-w-[420px] truncate text-sm text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title="Created" />
      ),
      cell: ({ row }) => <DateCell value={row.original.createdAt} />,
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
            aria-label={`Edit ${row.original.title}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            aria-label={`Delete ${row.original.title}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}
