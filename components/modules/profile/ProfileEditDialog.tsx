"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, Loader2 } from "lucide-react";
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
import { useUpdateMyProfile } from "@/hooks/use-auth";
import type { AuthUser, UpdateMyProfilePayload } from "@/lib/auth-api";

const PROFILE_FIELDS = [
  "name",
  "phone",
  "contactNumber",
  "address",
  "country",
  "profilePhoto",
] as const;
type ProfileFieldName = (typeof PROFILE_FIELDS)[number];

function isProfileField(path: string): path is ProfileFieldName {
  return (PROFILE_FIELDS as readonly string[]).includes(path);
}

// Mirrors the backend allow-list (see auth.validation.ts -> updateProfileZodSchema).
// Role, status, balance and other privileged fields are not present and cannot be set.
const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be at most 100 characters" }),
  phone: z
    .string()
    .trim()
    .max(30, { message: "Phone must be at most 30 characters" })
    .optional(),
  contactNumber: z
    .string()
    .trim()
    .max(30, { message: "Contact number must be at most 30 characters" })
    .optional(),
  address: z
    .string()
    .trim()
    .max(255, { message: "Address must be at most 255 characters" })
    .optional(),
  country: z
    .string()
    .trim()
    .max(100, { message: "Country must be at most 100 characters" })
    .optional(),
  profilePhoto: z
    .union([
      z.literal(""),
      z.string().url({ message: "Profile photo must be a valid URL" }),
    ])
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const DEFAULT_VALUES: ProfileFormValues = {
  name: "",
  phone: "",
  contactNumber: "",
  address: "",
  country: "",
  profilePhoto: "",
};

function valuesFromUser(user: AuthUser): ProfileFormValues {
  return {
    name: user.name ?? "",
    phone: user.phone ?? "",
    contactNumber: user.appUser?.contactNumber ?? "",
    address: user.appUser?.address ?? "",
    country: user.appUser?.country ?? "",
    profilePhoto: user.appUser?.profilePhoto ?? "",
  };
}

function buildPayload(values: ProfileFormValues): UpdateMyProfilePayload {
  const payload: UpdateMyProfilePayload = {
    name: values.name.trim(),
  };
  if (values.phone?.trim()) payload.phone = values.phone.trim();
  if (values.contactNumber?.trim()) {
    payload.contactNumber = values.contactNumber.trim();
  }
  if (values.address?.trim()) payload.address = values.address.trim();
  if (values.country?.trim()) payload.country = values.country.trim();
  if (values.profilePhoto?.trim()) {
    payload.profilePhoto = values.profilePhoto.trim();
  }
  return payload;
}

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  user,
}: ProfileEditDialogProps) {
  const {
    mutateAsync: updateProfile,
    isPending: isSubmitting,
    error: submissionError,
    reset: resetMutation,
  } = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: standardSchemaResolver(profileSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    resetMutation();
    reset(valuesFromUser(user));
  }, [open, user, reset, resetMutation]);

  // Surface backend field-level validation errors on the matching inputs.
  useEffect(() => {
    if (!submissionError?.errorSources?.length) return;
    for (const source of submissionError.errorSources) {
      if (isProfileField(source.path)) {
        setError(source.path, { type: "server", message: source.message });
      }
    }
  }, [submissionError, setError]);

  const hasFieldError = Boolean(
    submissionError?.errorSources?.some((source) =>
      isProfileField(source.path),
    ),
  );
  const formError =
    submissionError && !hasFieldError
      ? (submissionError.errorSources?.[0]?.message ?? submissionError.message)
      : null;

  const submit = async (values: ProfileFormValues) => {
    if (isSubmitting) return;

    clearErrors();
    try {
      await updateProfile(buildPayload(values));
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal details. Role, status and account fields cannot
            be changed here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate>
          {formError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="profile-name">Full Name</FieldLabel>
              <Input
                id="profile-name"
                placeholder="e.g. Mehedi Hasan"
                aria-invalid={Boolean(errors.name)}
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.phone)}>
                <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
                <Input
                  id="profile-phone"
                  type="tel"
                  placeholder="e.g. 01700000000"
                  aria-invalid={Boolean(errors.phone)}
                  disabled={isSubmitting}
                  {...register("phone")}
                />
                <FieldError errors={[errors.phone]} />
              </Field>

              <Field data-invalid={Boolean(errors.contactNumber)}>
                <FieldLabel htmlFor="profile-contact-number">
                  Contact Number
                </FieldLabel>
                <Input
                  id="profile-contact-number"
                  type="tel"
                  placeholder="e.g. 01800000000"
                  aria-invalid={Boolean(errors.contactNumber)}
                  disabled={isSubmitting}
                  {...register("contactNumber")}
                />
                <FieldError errors={[errors.contactNumber]} />
              </Field>

              <Field data-invalid={Boolean(errors.address)}>
                <FieldLabel htmlFor="profile-address">Address</FieldLabel>
                <Input
                  id="profile-address"
                  placeholder="e.g. Mirpur, Dhaka"
                  aria-invalid={Boolean(errors.address)}
                  disabled={isSubmitting}
                  {...register("address")}
                />
                <FieldError errors={[errors.address]} />
              </Field>

              <Field data-invalid={Boolean(errors.country)}>
                <FieldLabel htmlFor="profile-country">Country</FieldLabel>
                <Input
                  id="profile-country"
                  placeholder="e.g. Bangladesh"
                  aria-invalid={Boolean(errors.country)}
                  disabled={isSubmitting}
                  {...register("country")}
                />
                <FieldError errors={[errors.country]} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.profilePhoto)}>
              <FieldLabel htmlFor="profile-photo">Profile Photo URL</FieldLabel>
              <Input
                id="profile-photo"
                type="url"
                placeholder="https://example.com/photo.jpg"
                aria-invalid={Boolean(errors.profilePhoto)}
                disabled={isSubmitting}
                {...register("profilePhoto")}
              />
              <FieldError errors={[errors.profilePhoto]} />
            </Field>
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
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}