"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
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
import { useRestoreUser } from "@/hooks/use-users";
import type { IUser } from "@/types/user.types";

interface RestoreUserDialogProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RestoreUserDialog({
  user,
  open,
  onOpenChange,
}: RestoreUserDialogProps) {
  const t = useTranslations("admin.users.restore");
  const tc = useTranslations("common");
  const { mutateAsync: restoreUser, isPending, error, reset } = useRestoreUser();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  const handleConfirm = async () => {
    if (!user || isPending) return;
    try {
      await restoreUser(user.id);
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
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {user
              ? t("descriptionNamed", { name: user.name, email: user.email })
              : t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {tc("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {t("restoring")}
              </>
            ) : (
              <>
                <RotateCcw />
                {t("confirm")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
