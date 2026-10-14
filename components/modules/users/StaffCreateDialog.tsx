"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
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
import type { ValidationTranslator } from "@/lib/validations";
import type { Role } from "@/types/enums";
import { getCreatableStaffRoles, getRoleLabel } from "./user.constants";

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
function buildStaffSchema(roles: Role[], t: ValidationTranslator) {
  return z.object({
    name: z
      .string()
      .min(1, { message: t("nameRequired") })
      .min(2, { message: t("nameMin") })
      .max(100, { message: t("nameMax") }),
    email: z
      .string()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("invalidEmail") }),
    password: z
      .string()
      .min(1, { message: t("passwordRequired") })
      .min(6, { message: t("passwordMin") }),
    role: z.enum(roles as [Role, ...Role[]], {
      message: t("staffRoleRequired"),
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
  const t = useTranslations("admin.users.create");
  const tc = useTranslations("common");
  const te = useTranslations("enums");
  const tv = useTranslations("validation");
  const schema = buildStaffSchema(creatableRoles, tv);
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
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            {t("roleInfo", {
              roles: creatableRoles
                .map((role) => getRoleLabel(role, te))
                .join(", "),
            })}
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
              <FieldLabel htmlFor="staff-name">{t("name")}</FieldLabel>
              <Input
                id="staff-name"
                type="text"
                autoComplete="off"
                placeholder={t("namePlaceholder")}
                aria-invalid={Boolean(errors.name)}
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="staff-email">{t("email")}</FieldLabel>
              <Input
                id="staff-email"
                type="email"
                autoComplete="off"
                placeholder={t("emailPlaceholder")}
                aria-invalid={Boolean(errors.email)}
                disabled={isSubmitting}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="staff-password">{t("password")}</FieldLabel>
              <PasswordInput
                id="staff-password"
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
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
                  <FieldLabel htmlFor="staff-role">{t("role")}</FieldLabel>
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
                        <SelectValue placeholder={t("rolePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {creatableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {getRoleLabel(role, te)}
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
              {tc("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {t("creating")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}