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
import { useDeleteOperator } from "@/hooks/use-operators";
import type { IOperator } from "@/types/operator.types";
import { useTranslations } from "next-intl";

interface OperatorDeleteDialogProps {
  operator: IOperator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OperatorDeleteDialog({
  operator,
  open,
  onOpenChange,
}: OperatorDeleteDialogProps) {
  const t = useTranslations("admin.operatorForm");
  const {
    mutateAsync: deleteOperator,
    isPending,
    error,
    reset,
  } = useDeleteOperator();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  const handleConfirm = async () => {
    if (!operator || isPending) return;

    try {
      await deleteOperator(operator.id);
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
            {operator
              ? t("deleteConfirmDescription", { title: operator.name })
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