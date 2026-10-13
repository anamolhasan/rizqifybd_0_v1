"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { z } from "zod";

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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeUserRole } from "@/hooks/use-users";
import type { Role } from "@/types/enums";
import type { IUser } from "@/types/user.types";
import { RoleBadge } from "./RoleBadge";
import { getAssignableRoles, ROLE_LABELS } from "./user.constants";

const changeRoleSchema = z.object({
  role: z.string().min(1, { message: "Select a role" }),
});

type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

const PRIVILEGED_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];

interface ChangeRoleDialogProps {
  user: IUser | null;
  actorRole?: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeRoleDialog({
  user,
  actorRole,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const assignableRoles = useMemo(
    () =>
      user
        ? getAssignableRoles(actorRole, user.role).filter(
            (role) => role !== user.role,
          )
        : [],
    [actorRole, user],
  );

  const {
    mutateAsync: changeRole,
    isPending,
    error,
    reset,
  } = useChangeUserRole();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    watch,
    formState: { errors },
  } = useForm<ChangeRoleFormValues>({
    resolver: standardSchemaResolver(changeRoleSchema),
    defaultValues: { role: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset();
    resetForm({ role: "" });
  }, [open, user, reset, resetForm]);

  const selectedRole = watch("role") as Role | "";
  const isSensitive =
    selectedRole !== "" &&
    (PRIVILEGED_ROLES.includes(selectedRole) ||
      (user ? PRIVILEGED_ROLES.includes(user.role) : false));

  const submit = async (values: ChangeRoleFormValues) => {
    if (!user || isPending || !values.role) return;
    try {
      await changeRole({ id: user.id, payload: { role: values.role as Role } });
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
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            {user ? `Assign a new role to ${user.name}.` : "Assign a new role."}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5">
            <span className="text-sm text-muted-foreground">Current role</span>
            <RoleBadge role={user.role} />
          </div>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {assignableRoles.length ? (
          <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
            <FieldGroup>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Field data-invalid={Boolean(errors.role)}>
                    <FieldLabel htmlFor="change-role">New role</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger
                        id="change-role"
                        className="w-full"
                        aria-invalid={Boolean(errors.role)}
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.role]} />
                  </Field>
                )}
              />
            </FieldGroup>

            {isSensitive ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-300">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  This changes administrator-level privileges. Make sure this is
                  intended — the action is recorded by the backend.
                </span>
              </div>
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
              <Button type="submit" disabled={isPending || !selectedRole}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change role"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <Alert>
            <AlertCircle />
            <AlertDescription>
              You are not authorized to assign any role to this user.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
