"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserProfile } from "@/hooks/use-users";
import type { ValidationTranslator } from "@/lib/validations";
import type { IUpdateUserProfilePayload, IUser } from "@/types/user.types";

function buildEditUserSchema(t: ValidationTranslator) {
  const optionalUrl = z
    .string()
    .trim()
    .url({ message: t("urlInvalid") })
    .optional()
    .or(z.literal(""));

  return z
    .object({
      name: z.string().trim().max(100, { message: t("atMost100") }),
      phone: z.string().trim(),
      image: optionalUrl,
      profilePhoto: optionalUrl,
      contactNumber: z.string().trim(),
      address: z.string().trim(),
      country: z.string().trim(),
    })
    .refine(
      (data) =>
        Object.values(data).some(
          (value) => typeof value === "string" && value.length > 0,
        ),
      { message: t("provideAtLeastOneField") },
    );
}

type EditFormValues = z.infer<ReturnType<typeof buildEditUserSchema>>;

const EDITABLE_FIELDS = [
  "name",
  "phone",
  "image",
  "profilePhoto",
  "contactNumber",
  "address",
  "country",
] as const;
type EditableField = (typeof EDITABLE_FIELDS)[number];

function isEditableField(path: string): path is EditableField {
  return (EDITABLE_FIELDS as readonly string[]).includes(path);
}

function getFormValues(user: IUser | null): EditFormValues {
  return {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    image: user?.image ?? "",
    profilePhoto: user?.appUser?.profilePhoto ?? "",
    contactNumber: user?.appUser?.contactNumber ?? "",
    address: user?.appUser?.address ?? "",
    country: user?.appUser?.country ?? "",
  };
}

interface UserEditDialogProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const t = useTranslations("admin.users.edit");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const {
    mutateAsync: updateProfile,
    isPending,
    error,
    reset,
  } = useUpdateUserProfile();

  const {
    register,
    control,
    handleSubmit,
    reset: resetForm,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: standardSchemaResolver(buildEditUserSchema(tv)),
    defaultValues: getFormValues(user),
  });

  useEffect(() => {
    if (!open) return;
    reset();
    resetForm(getFormValues(user));
  }, [open, user, reset, resetForm]);

  useEffect(() => {
    if (!error?.errorSources?.length) return;
    for (const source of error.errorSources) {
      if (isEditableField(source.path)) {
        setError(source.path, { type: "server", message: source.message });
      }
    }
  }, [error, setError]);

  const submit = async (values: EditFormValues) => {
    if (!user || isPending) return;
    clearErrors();

    const payload: IUpdateUserProfilePayload = {};
    for (const field of EDITABLE_FIELDS) {
      const value = (values[field] ?? "").toString().trim();
      if (value) payload[field] = value;
    }

    try {
      await updateProfile({ id: user.id, payload });
      onOpenChange(false);
    } catch {
      // Errors surface via toast and the field-error effect above.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  const hasFieldError = Boolean(
    error?.errorSources?.some((source) => isEditableField(source.path)),
  );
  const formError =
    error && !hasFieldError ? (error.errorSources?.[0]?.message ?? error.message) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {user
              ? t("descriptionNamed", { name: user.name })
              : t("description")}
          </DialogDescription>
        </DialogHeader>

        {formError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="edit-name">{t("name")}</FieldLabel>
              <Input id="edit-name" autoComplete="off" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.phone)}>
              <FieldLabel htmlFor="edit-phone">{t("phone")}</FieldLabel>
              <Input
                id="edit-phone"
                autoComplete="off"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
              />
              <FieldError errors={[errors.phone]} />
            </Field>

            <Field data-invalid={Boolean(errors.contactNumber)}>
              <FieldLabel htmlFor="edit-contact">
                {t("contactNumber")}
              </FieldLabel>
              <Input
                id="edit-contact"
                autoComplete="off"
                {...register("contactNumber")}
              />
              <FieldError errors={[errors.contactNumber]} />
            </Field>

            <Field data-invalid={Boolean(errors.image)}>
              <FieldLabel htmlFor="edit-image">{t("image")}</FieldLabel>
              <Input
                id="edit-image"
                autoComplete="off"
                placeholder="https://..."
                {...register("image")}
              />
              <FieldError errors={[errors.image]} />
            </Field>

            <Field data-invalid={Boolean(errors.profilePhoto)}>
              <FieldLabel htmlFor="edit-photo">{t("profilePhoto")}</FieldLabel>
              <Input
                id="edit-photo"
                autoComplete="off"
                placeholder="https://..."
                {...register("profilePhoto")}
              />
              <FieldError errors={[errors.profilePhoto]} />
            </Field>

            <Field data-invalid={Boolean(errors.country)}>
              <FieldLabel htmlFor="edit-country">{t("country")}</FieldLabel>
              <Input id="edit-country" autoComplete="off" {...register("country")} />
              <FieldError errors={[errors.country]} />
            </Field>

            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Field data-invalid={Boolean(errors.address)}>
                  <FieldLabel htmlFor="edit-address">{t("address")}</FieldLabel>
                  <Textarea id="edit-address" rows={2} {...field} />
                  <FieldError errors={[errors.address]} />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
