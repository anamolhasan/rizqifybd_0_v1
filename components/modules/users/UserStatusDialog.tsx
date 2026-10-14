"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserStatus } from "@/hooks/use-users";
import type { IUser } from "@/types/user.types";
import { UserStatusBadge } from "./UserStatusBadge";
import {
  getStatusActionLabel,
  USER_STATUS_ACTION_TARGETS,
  type UserStatusAction,
} from "./user.constants";

const DESTRUCTIVE_ACTIONS: UserStatusAction[] = ["BLOCK", "SUSPEND", "DEACTIVATE"];

interface UserStatusDialogProps {
  user: IUser | null;
  action: UserStatusAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserStatusDialog({
  user,
  action,
  open,
  onOpenChange,
}: UserStatusDialogProps) {
  const t = useTranslations("admin.users.statusDialog");
  const tc = useTranslations("common");
  const te = useTranslations("enums");
  const {
    mutateAsync: updateStatus,
    isPending,
    error,
    reset,
  } = useUpdateUserStatus();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const targetStatus = action ? USER_STATUS_ACTION_TARGETS[action] : null;
  const isDestructive = action ? DESTRUCTIVE_ACTIONS.includes(action) : false;

  const handleConfirm = async () => {
    if (!user || !targetStatus || isPending) return;
    try {
      await updateStatus({ id: user.id, payload: { status: targetStatus } });
      onOpenChange(false);
    } catch {
      // Errors surface via toast and the alert below.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action
              ? t(`titles.${action.toLowerCase()}`)
              : t("titleFallback")}
          </DialogTitle>
          <DialogDescription>
            {user && action
              ? `${t(`descriptions.${action.toLowerCase()}`)} ${t("notify", {
                  name: user.name,
                })}`
              : t("descriptionFallback")}
          </DialogDescription>
        </DialogHeader>

        {user && action ? (
          <div className="flex items-center justify-center gap-3 rounded-lg border bg-muted/40 px-3 py-3">
            <UserStatusBadge status={user.status} />
            <span className="text-muted-foreground">→</span>
            <UserStatusBadge status={targetStatus ?? user.status} />
          </div>
        ) : null}

        {isDestructive ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{t("destructive")}</span>
          </div>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            {tc("cancel")}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "default"}
            disabled={isPending || !targetStatus}
            onClick={() => void handleConfirm()}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {t("applying")}
              </>
            ) : action ? (
              getStatusActionLabel(action, te)
            ) : (
              t("apply")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
