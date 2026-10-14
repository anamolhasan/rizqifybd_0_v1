"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2, Undo2 } from "lucide-react";
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
import { useDeleteUser } from "@/hooks/use-users";
import type { IUser } from "@/types/user.types";

interface DeleteUserDialogProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const t = useTranslations("admin.users.delete");
  const tc = useTranslations("common");
  const { mutateAsync: deleteUser, isPending, error, reset } = useDeleteUser();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  const handleConfirm = async () => {
    if (!user || isPending) return;
    try {
      await deleteUser(user.id);
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

        <div className="flex items-start gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
          <Undo2 className="mt-0.5 size-3.5 shrink-0" />
          <span>{t("note")}</span>
        </div>

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
              t("confirm")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
