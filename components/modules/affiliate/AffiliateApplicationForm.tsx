"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  BadgeCheck,
  Loader2,
  MessageSquareText,
  Send,
  TriangleAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitAffiliateApplication } from "@/hooks/use-affiliate-application";
import { ApiError } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-api";
import {
  createAffiliateApplicationSchema,
  type AffiliateApplicationFormValues,
} from "@/lib/validations";

const DEFAULT_VALUES: AffiliateApplicationFormValues = { reason: "" };

interface AffiliateApplicationFormProps {
  user?: AuthUser;
}

export function AffiliateApplicationForm({
  user,
}: AffiliateApplicationFormProps) {
  const t = useTranslations("affiliate.form");
  const tv = useTranslations("validation");
  const [formError, setFormError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useSubmitAffiliateApplication();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AffiliateApplicationFormValues>({
    resolver: standardSchemaResolver(createAffiliateApplicationSchema(tv)),
    defaultValues: DEFAULT_VALUES,
  });

  const busy = isSubmitting || isPending;

  const submit = async (values: AffiliateApplicationFormValues) => {
    setFormError(null);
    clearErrors();

    try {
      await mutateAsync({ reason: values.reason.trim() });
      reset(DEFAULT_VALUES);
    } catch (error) {
      let mappedToField = false;

      if (error instanceof ApiError && error.errorSources?.length) {
        for (const source of error.errorSources) {
          if (source.path === "reason") {
            setError("reason", { type: "server", message: source.message });
            mappedToField = true;
          }
        }
      }

      if (!mappedToField) {
        setFormError(error instanceof Error ? error.message : t("errorGeneric"));
      }
    }
  };

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl"
      />

      <CardHeader className="gap-2">
        <CardTitle className="text-lg font-bold tracking-tight">
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 rounded-2xl border border-primary/10 bg-white/50 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <BadgeCheck className="size-4 text-primary" />
            {t("applicantInfo")}
          </p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <ApplicantField label={t("fieldName")} value={user?.name ?? "—"} />
            <ApplicantField label={t("fieldEmail")} value={user?.email ?? "—"} />
            <ApplicantField
              label={t("fieldMobile")}
              value={user?.appUser?.contactNumber ?? user?.phone ?? "—"}
            />
          </dl>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
          {formError ? (
            <Alert variant="destructive" role="alert">
              <TriangleAlert />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.reason)}>
              <FieldLabel htmlFor="affiliate-application-reason">
                <MessageSquareText className="size-4 text-muted-foreground" />
                {t("reasonLabel")}
              </FieldLabel>
              <Textarea
                id="affiliate-application-reason"
                rows={4}
                placeholder={t("reasonPlaceholder")}
                aria-invalid={Boolean(errors.reason)}
                disabled={busy}
                {...register("reason")}
              />
              <FieldError errors={[errors.reason]} />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:min-w-44"
          >
            {busy ? (
              <>
                <Loader2 className="animate-spin" />
                {t("submitting")}
              </>
            ) : (
              <>
                <Send />
                {t("submit")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ApplicantField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}
