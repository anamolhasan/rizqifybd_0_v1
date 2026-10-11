"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";

import { PasswordInput } from "@/components/auth/PasswordInput";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateStaffUser } from "@/hooks/use-users";
import type { Role } from "@/types/enums";
import { getCreatableStaffRoles, STAFF_ROLE_LABELS } from "./user.constants";

const FIELD_NAMES = ["name", "email", "password", "role"] as const;
type StaffFieldName = (typeof FIELD_NAMES)[number];

function isStaffField(path: string): path is StaffFieldName {
  return (FIELD_NAMES as readonly string[]).includes(path);
}

export interface StaffCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actorRole?: Role | null;
}

export function StaffCreateDialog({
  open,
  onOpenChange,
  actorRole,
}: StaffCreateDialogProps) {
  const creatableRoles = getCreatableStaffRoles(actorRole);

  if (!open || !creatableRoles.length) return null;

  return (
    <StaffCreateForm
      creatableRoles={creatableRoles}
      onOpenChange={onOpenChange}
    />
  );
}

// Mirrors the backend createStaffUserZodSchema field rules. Role is validated
// against the actor's own CREATABLE_ROLES_BY_ROLE; the backend enforces this
// again on submit.
function buildStaffSchema(roles: Role[]) {
  return z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must be at most 100 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(roles as [Role, ...Role[]], {
      message: "Select a role for the staff account",
    }),
  });
}

export type StaffFormValues = z.infer<ReturnType<typeof buildStaffSchema>>;

interface StaffCreateFormProps {
  creatableRoles: Role[];
  onOpenChange: (open: boolean) => void;
}

function StaffCreateForm({
  creatableRoles,
  onOpenChange,
}: StaffCreateFormProps) {
  const schema = buildStaffSchema(creatableRoles);
  const DEFAULT_VALUES: StaffFormValues = {
    name: "",
    email: "",
    password: "",
    role: creatableRoles[0],
  };

  const {
    mutateAsync: createStaffUser,
    isPending: isSubmitting,
    error: submissionError,
    reset: resetMutation,
  } = useCreateStaffUser();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!creatableRoles.length) return;
    resetMutation();
    reset(DEFAULT_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatableRoles, reset, resetMutation]);

  // Surface backend field-level validation errors on the matching inputs.
  useEffect(() => {
    if (!submissionError?.errorSources?.length) return;
    for (const source of submissionError.errorSources) {
      if (isStaffField(source.path)) {
        setError(source.path, { type: "server", message: source.message });
      }
    }
  }, [submissionError, setError]);

  const hasFieldError = Boolean(
    submissionError?.errorSources?.some((source) => isStaffField(source.path)),
  );
  const formError =
    submissionError && !hasFieldError
      ? (submissionError.errorSources?.[0]?.message ?? submissionError.message)
      : null;

  const submit = async (values: StaffFormValues) => {
    if (isSubmitting) return;

    clearErrors();

    try {
      await createStaffUser({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
      });
      reset(DEFAULT_VALUES);
      onOpenChange(false);
    } catch {
      // Errors are surfaced via toast and the field-error effect above.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Staff Account</DialogTitle>
          <DialogDescription>
            Grant a new member access to the RizqifyBD admin panel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            Role assignments are enforced server-side. You can grant{" "}
            {creatableRoles.map((role) => STAFF_ROLE_LABELS[role]).join(", ")}.
          </span>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
          {formError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="staff-name">Full Name</FieldLabel>
              <Input
                id="staff-name"
                type="text"
                autoComplete="off"
                placeholder="e.g. John Doe"
                aria-invalid={Boolean(errors.name)}
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="staff-email">Email</FieldLabel>
              <Input
                id="staff-email"
                type="email"
                autoComplete="off"
                placeholder="staff@rizqifybd.com"
                aria-invalid={Boolean(errors.email)}
                disabled={isSubmitting}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="staff-password">Temporary Password</FieldLabel>
              <PasswordInput
                id="staff-password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                aria-invalid={Boolean(errors.password)}
                disabled={isSubmitting}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Field data-invalid={Boolean(errors.role)}>
                  <FieldLabel htmlFor="staff-role">Role</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="staff-role"
                      className="w-full"
                      aria-invalid={Boolean(errors.role)}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {creatableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {STAFF_ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.role]} />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Staff Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}