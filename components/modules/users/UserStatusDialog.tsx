"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

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
  USER_STATUS_ACTION_LABELS,
  USER_STATUS_ACTION_TARGETS,
  type UserStatusAction,
} from "./user.constants";

const DESTRUCTIVE_ACTIONS: UserStatusAction[] = ["BLOCK", "SUSPEND", "DEACTIVATE"];

const ACTION_TITLES: Record<UserStatusAction, string> = {
  ACTIVATE: "Activate account?",
  DEACTIVATE: "Deactivate account?",
  SUSPEND: "Suspend account?",
  UNSUSPEND: "Unsuspend account?",
  BLOCK: "Block account?",
  UNBLOCK: "Unblock account?",
};

const ACTION_DESCRIPTIONS: Record<UserStatusAction, string> = {
  ACTIVATE: "The user will regain access to their account.",
  DEACTIVATE: "The account will be set to inactive.",
  SUSPEND: "The account will be temporarily suspended.",
  UNSUSPEND: "The suspension will be lifted and access restored.",
  BLOCK: "The user will be blocked from signing in until unblocked.",
  UNBLOCK: "The block will be lifted and access restored.",
};

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
            {action ? ACTION_TITLES[action] : "Change status"}
          </DialogTitle>
          <DialogDescription>
            {user && action
              ? `${ACTION_DESCRIPTIONS[action]} ${user.name} will be notified by the next sign-in attempt.`
              : "Change the account status."}
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
            <span>
              This restricts access. The backend records who performed the
              change and when.
            </span>
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
            Cancel
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
                Applying...
              </>
            ) : action ? (
              USER_STATUS_ACTION_LABELS[action]
            ) : (
              "Apply"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
