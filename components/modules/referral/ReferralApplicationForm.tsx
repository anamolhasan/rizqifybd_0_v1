"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  BadgeCheck,
  Link2,
  Loader2,
  MessageSquareText,
  Send,
  Share2,
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { useApplyForReferral } from "@/hooks/use-referral";
import { ApiError } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-api";
import {
  createReferralApplicationSchema,
  type ReferralApplicationFormValues,
} from "@/lib/validations";
import type { ReferralPromotionMethod } from "@/types/referral.types";
import {
  REFERRAL_PROMOTION_METHOD_LABEL_KEYS,
  REFERRAL_PROMOTION_METHOD_VALUES,
} from "./referral.constants";

const DEFAULT_VALUES: ReferralApplicationFormValues = {
  promotionMethod: "",
  promotionUrl: "",
  reason: "",
  acceptedTerms: false,
};

const SERVER_FIELDS = new Set<keyof ReferralApplicationFormValues>([
  "promotionMethod",
  "promotionUrl",
  "reason",
]);

interface ReferralApplicationFormProps {
  user?: AuthUser;
}

export function ReferralApplicationForm({ user }: ReferralApplicationFormProps) {
  const t = useTranslations("referral.form");
  const te = useTranslations("enums");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const [formError, setFormError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useApplyForReferral();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ReferralApplicationFormValues>({
    resolver: standardSchemaResolver(createReferralApplicationSchema(tv)),
    defaultValues: DEFAULT_VALUES,
  });

  const busy = isSubmitting || isPending;

  const submit = async (values: ReferralApplicationFormValues) => {
    setFormError(null);
    clearErrors();

    try {
      await mutateAsync({
        promotionMethod: values.promotionMethod as ReferralPromotionMethod,
        promotionUrl: values.promotionUrl.trim() || undefined,
        reason: values.reason.trim(),
        termsAccepted: values.acceptedTerms,
      });
      reset(DEFAULT_VALUES);
    } catch (error) {
      let mappedToField = false;

      if (error instanceof ApiError && error.errorSources?.length) {
        for (const source of error.errorSources) {
          const field = source.path as keyof ReferralApplicationFormValues;
          if (SERVER_FIELDS.has(field)) {
            setError(field, { type: "server", message: source.message });
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
            <Field data-invalid={Boolean(errors.promotionMethod)}>
              <FieldLabel htmlFor="promotion-method">
                <Share2 className="size-4 text-muted-foreground" />
                {t("promotionMethod")}
              </FieldLabel>
              <Controller
                control={control}
                name="promotionMethod"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={busy}
                  >
                    <SelectTrigger
                      id="promotion-method"
                      className="h-11 w-full"
                      aria-invalid={Boolean(errors.promotionMethod)}
                    >
                      <SelectValue placeholder={t("promotionMethodPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {REFERRAL_PROMOTION_METHOD_VALUES.map((method) => (
                        <SelectItem key={method} value={method}>
                          {te(REFERRAL_PROMOTION_METHOD_LABEL_KEYS[method])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.promotionMethod]} />
            </Field>

            <Field data-invalid={Boolean(errors.promotionUrl)}>
              <FieldLabel htmlFor="promotion-url">
                <Link2 className="size-4 text-muted-foreground" />
                {t("promotionUrl")}{" "}
                <span className="font-normal text-muted-foreground">
                  ({tc("optional")})
                </span>
              </FieldLabel>
              <Input
                id="promotion-url"
                type="url"
                inputMode="url"
                placeholder="https://example.com/your-page"
                className="h-11"
                aria-invalid={Boolean(errors.promotionUrl)}
                disabled={busy}
                {...register("promotionUrl")}
              />
              <FieldError errors={[errors.promotionUrl]} />
            </Field>

            <Field data-invalid={Boolean(errors.reason)}>
              <FieldLabel htmlFor="application-reason">
                <MessageSquareText className="size-4 text-muted-foreground" />
                {t("reasonLabel")}
              </FieldLabel>
              <Textarea
                id="application-reason"
                rows={4}
                placeholder={t("reasonPlaceholder")}
                aria-invalid={Boolean(errors.reason)}
                disabled={busy}
                {...register("reason")}
              />
              <FieldError errors={[errors.reason]} />
            </Field>

            <Field data-invalid={Boolean(errors.acceptedTerms)}>
              <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white/50 p-4">
                <Controller
                  control={control}
                  name="acceptedTerms"
                  render={({ field }) => (
                    <Checkbox
                      id="accepted-terms"
                      className="mt-0.5"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      disabled={busy}
                      aria-invalid={Boolean(errors.acceptedTerms)}
                    />
                  )}
                />
                <label
                  htmlFor="accepted-terms"
                  className="cursor-pointer text-sm leading-6 text-muted-foreground"
                >
                  {t.rich("termsLabel", {
                    terms: (chunks) => (
                      <span className="font-semibold text-foreground">
                        {chunks}
                      </span>
                    ),
                  })}
                </label>
              </div>
              <FieldError errors={[errors.acceptedTerms]} />
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
