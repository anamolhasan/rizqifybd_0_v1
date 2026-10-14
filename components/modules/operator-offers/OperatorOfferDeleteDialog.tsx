"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { useDeleteOperatorOffer } from "@/hooks/use-operator-offers";
import type { IOperatorOffer } from "@/types/operator-offer.types";

interface OperatorOfferDeleteDialogProps {
  offer: IOperatorOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OperatorOfferDeleteDialog({
  offer,
  open,
  onOpenChange,
}: OperatorOfferDeleteDialogProps) {
  const t = useTranslations("admin.operatorOfferForm");
  const {
    mutateAsync: deleteOperatorOffer,
    isPending,
    error,
    reset,
  } = useDeleteOperatorOffer();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  const handleConfirm = async () => {
    if (!offer || isPending) return;

    try {
      await deleteOperatorOffer(offer.id);
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
              {offer
                ? t("deleteConfirmDescription", { title: offer.name })
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