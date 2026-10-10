"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/table/DataTable";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { CategoryDeleteDialog } from "./CategoryDeleteDialog";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { getCategoryColumns } from "./CategoryColumns";
import type { ICategory } from "@/types/category.types";

export function CategoryManagement() {
  const { data, isLoading, isError, error, refetch } = useCategories();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: (category) => {
          setSelectedCategory(category);
          setFormOpen(true);
        },
        onDelete: (category) => {
          setSelectedCategory(category);
          setDeleteOpen(true);
        },
      }),
    [],
  );

  const rows = useMemo(() => data?.data ?? [], [data]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const openCreateDialog = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organise your products into categories for easier management."
      >
        <Button
          type="button"
          className="bg-sky-500 text-slate-950 hover:bg-sky-400"
          onClick={openCreateDialog}
        >
          <Plus />
          Add Category
        </Button>
      </PageHeader>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to load categories</AlertTitle>
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
          emptyStateMessage="No categories yet. Add your first category to get started."
        />
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
      />

      <CategoryDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
      />
    </div>
  );
}
