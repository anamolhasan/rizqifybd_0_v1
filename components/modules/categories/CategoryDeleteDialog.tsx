"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCategory } from "@/hooks/use-categories";
import type { ICategory } from "@/types/category.types";
import { useTranslations } from "next-intl";

interface CategoryDeleteDialogProps {
  category: ICategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDeleteDialog({
  category,
  open,
  onOpenChange,
}: CategoryDeleteDialogProps) {
  const t = useTranslations("admin.categoryForm");
  const {
    mutateAsync: deleteCategory,
    isPending,
    error,
    reset,
  } = useDeleteCategory();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  const handleConfirm = async () => {
    if (!category || isPending) return;

    try {
      await deleteCategory(category.id);
      onOpenChange(false);
    } catch {
      // Keep the dialog open; the failure is surfaced via toast and below.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {category
              ? t("deleteConfirmDescription", { title: category.title })
              : t("deleteConfirmDescription", { title: "" })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("deleteConfirm")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}