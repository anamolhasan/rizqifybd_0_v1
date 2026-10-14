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
import { useTranslations } from "next-intl";

export function CategoryManagement() {
  const t = useTranslations("admin.categories");
  const tc = useTranslations("common");
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
        labels: {
          title: t("columns.title"),
          description: t("columns.description"),
          created: t("columns.created"),
          actions: t("columns.actions"),
          edit: t("rowActions.edit"),
          delete: t("rowActions.delete"),
        },
      }),
    [t],
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
        title={t("title")}
        description={t("description")}
      >
        <Button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={openCreateDialog}
        >
          <Plus />
          {t("addCategory")}
        </Button>
      </PageHeader>

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
