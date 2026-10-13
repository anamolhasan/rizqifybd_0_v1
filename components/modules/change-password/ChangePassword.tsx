"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { KeyRound, Loader2, Lock, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useChangePassword } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import {
  createChangePasswordSchema,
  type ChangePasswordFormInputs,
} from "@/lib/validations";

const DEFAULT_VALUES: ChangePasswordFormInputs = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const SERVER_FIELDS = new Set<keyof ChangePasswordFormInputs>([
  "currentPassword",
  "newPassword",
]);

export function ChangePassword() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormInputs>({
    resolver: standardSchemaResolver(createChangePasswordSchema(tv)),
    defaultValues: DEFAULT_VALUES,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useChangePassword();
  const busy = isSubmitting || isPending;

  const newPassword = useWatch({ control, name: "newPassword" }) ?? "";

  const submit = async (values: ChangePasswordFormInputs) => {
    setFormError(null);

    try {
      await mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset(DEFAULT_VALUES);
    } catch (error) {
      let mappedToField = false;

      if (error instanceof ApiError && error.errorSources?.length) {
        for (const source of error.errorSources) {
          const field = source.path as keyof ChangePasswordFormInputs;
          if (SERVER_FIELDS.has(field)) {
            setError(field, { type: "server", message: source.message });
            mappedToField = true;
          }
        }
      }

      if (!mappedToField) {
        setFormError(
          error instanceof Error && error.message
            ? error.message
            : t("changePasswordFailed"),
        );
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <PageHeader
        title={t("changePasswordHeading")}
        description={t("changePasswordDescription")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("changePasswordCardTitle")}</CardTitle>
          <CardDescription>{t("changePasswordCardDescription")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
            {formError ? (
              <Alert variant="destructive" role="alert">
                <TriangleAlert />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <FieldGroup>
              <Field data-invalid={Boolean(errors.currentPassword)}>
                <FieldLabel htmlFor="currentPassword">
                  <Lock className="size-4 text-muted-foreground" />
                  {t("currentPassword")}
                </FieldLabel>
                <PasswordInput
                  id="currentPassword"
                  autoComplete="current-password"
                  placeholder={t("placeholderPassword")}
                  className="h-11"
                  aria-invalid={Boolean(errors.currentPassword)}
                  disabled={busy}
                  {...register("currentPassword")}
                />
                <FieldError errors={[errors.currentPassword]} />
              </Field>

              <Field data-invalid={Boolean(errors.newPassword)}>
                <FieldLabel htmlFor="newPassword">
                  <KeyRound className="size-4 text-muted-foreground" />
                  {t("newPassword")}
                </FieldLabel>
                <PasswordInput
                  id="newPassword"
                  autoComplete="new-password"
                  placeholder={t("placeholderNewPassword")}
                  className="h-11"
                  aria-invalid={Boolean(errors.newPassword)}
                  disabled={busy}
                  {...register("newPassword")}
                />
                <PasswordStrength password={newPassword} />
                <FieldError errors={[errors.newPassword]} />
              </Field>

              <Field data-invalid={Boolean(errors.confirmNewPassword)}>
                <FieldLabel htmlFor="confirmNewPassword">
                  <Lock className="size-4 text-muted-foreground" />
                  {t("confirmNewPassword")}
                </FieldLabel>
                <PasswordInput
                  id="confirmNewPassword"
                  autoComplete="new-password"
                  placeholder={t("placeholderPassword")}
                  className="h-11"
                  aria-invalid={Boolean(errors.confirmNewPassword)}
                  disabled={busy}
                  {...register("confirmNewPassword")}
                />
                <FieldError errors={[errors.confirmNewPassword]} />
              </Field>
            </FieldGroup>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setFormError(null);
                  reset(DEFAULT_VALUES);
                }}
              >
                {t("reset")}
              </Button>
              <Button
                type="submit"
                disabled={busy}
                className="bg-primary text-primary-foreground hover:bg-primary/90 sm:min-w-40"
              >
                {busy ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("updating")}
                  </>
                ) : (
                  <>
                    <KeyRound />
                    {t("updatePassword")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
