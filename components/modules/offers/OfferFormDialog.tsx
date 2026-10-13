"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  OFFER_TYPE_LABELS,
  OFFER_TYPE_VALUES,
} from "@/components/modules/offers/offer.constants";
import { useCreateOffer, useUpdateOffer } from "@/hooks/use-offers";
import { useOperators } from "@/hooks/use-operators";
import type { ProductType } from "@/types/enums";
import type { IProduct, ICreateProductPayload } from "@/types/product.types";

const FIELD_NAMES = [
  "name",
  "operatorId",
  "type",
  "price",
  "commissionRate",
  "referralCommissionRate",
  "description",
] as const;
type OfferFieldName = (typeof FIELD_NAMES)[number];

function isOfferField(path: string): path is OfferFieldName {
  return (FIELD_NAMES as readonly string[]).includes(path);
}

// Mirrors the backend Product validation (operatorId + name + price required,
// type/commissionRate/isActive optional) and the name column constraint (VarChar(150)).
const offerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(150, { message: "Name must be at most 150 characters" }),
  operatorId: z.string().min(1, { message: "Operator is required" }),
  type: z.enum(OFFER_TYPE_VALUES),
  price: z.coerce
    .number({ message: "Price is required" })
    .nonnegative({ message: "Price must be zero or greater" }),
  commissionRate: z.coerce
    .number({ message: "Commission is required" })
    .min(0, { message: "Commission must be zero or greater" })
    .max(100, { message: "Commission must be at most 100" }),
  referralCommissionRate: z.coerce
    .number({ message: "Referral commission is required" })
    .min(0, { message: "Referral commission must be zero or greater" })
    .max(100, { message: "Referral commission must be at most 100" }),
  isActive: z.boolean(),
  description: z.string().optional(),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

const DEFAULT_VALUES: OfferFormValues = {
  name: "",
  operatorId: "",
  type: "RECHARGE",
  price: 0,
  commissionRate: 0,
  referralCommissionRate: 0,
  isActive: true,
  description: "",
};

interface OfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: IProduct | null;
}

export function OfferFormDialog({
  open,
  onOpenChange,
  offer,
}: OfferFormDialogProps) {
  const isEditing = Boolean(offer);

  const {
    mutateAsync: createOffer,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateOffer();

  const {
    mutateAsync: updateOffer,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateOffer();

  const isSubmitting = isCreating || isUpdating;
  const submissionError = isEditing ? updateError : createError;

  const { data: operatorsData, isLoading: isLoadingOperators } = useOperators({
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  const operatorOptions = useMemo(() => {
    const operators = operatorsData?.data ?? [];
    const options = operators.map((operator) => ({
      value: operator.id,
      label: operator.name,
    }));

    // Keep the current offer's operator selectable even if it is no longer
    // returned by the (non-deleted) list.
    if (
      offer?.operator &&
      !options.some((option) => option.value === offer.operatorId)
    ) {
      options.unshift({ value: offer.operatorId, label: offer.operator.name });
    }

    return options;
  }, [operatorsData, offer]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: standardSchemaResolver(offerSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset(
      offer
        ? {
            name: offer.name,
            operatorId: offer.operatorId,
            type: offer.type,
            price: offer.price,
            commissionRate: offer.commissionRate,
            referralCommissionRate: offer.referralCommissionRate,
            isActive: offer.isActive,
            description: offer.description ?? "",
          }
        : DEFAULT_VALUES,
    );
  }, [open, offer, reset, resetCreate, resetUpdate]);

  // Surface backend field-level validation errors on the matching inputs.
  useEffect(() => {
    if (!submissionError?.errorSources?.length) return;
    for (const source of submissionError.errorSources) {
      if (isOfferField(source.path)) {
        setError(source.path, { type: "server", message: source.message });
      }
    }
  }, [submissionError, setError]);

  const hasFieldError = Boolean(
    submissionError?.errorSources?.some((source) =>
      isOfferField(source.path),
    ),
  );
  const formError =
    submissionError && !hasFieldError
      ? (submissionError.errorSources?.[0]?.message ?? submissionError.message)
      : null;

  const submit = async (values: OfferFormValues) => {
    if (isSubmitting) return;

    clearErrors();
    const description = values.description?.trim() ?? "";
    const payload: ICreateProductPayload = {
      operatorId: values.operatorId,
      name: values.name.trim(),
      type: values.type,
      price: values.price,
      commissionRate: values.commissionRate,
      referralCommissionRate: values.referralCommissionRate,
      isActive: values.isActive,
    };

    if (isEditing) {
      payload.description = description;
    } else if (description) {
      payload.description = description;
    }

    try {
      if (isEditing && offer) {
        await updateOffer({ id: offer.id, payload });
      } else {
        await createOffer(payload);
      }
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
          <DialogTitle>{isEditing ? "Edit Offer" : "Add Offer"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the offer details below."
              : "Create a new offer for your telecom catalogue."}
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
              <FieldLabel htmlFor="offer-name">Name</FieldLabel>
              <Input
                id="offer-name"
                placeholder="e.g. 10GB Monthly Internet"
                aria-invalid={Boolean(errors.name)}
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.operatorId)}>
              <FieldLabel htmlFor="offer-operator">Operator</FieldLabel>
              <Controller
                control={control}
                name="operatorId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || isLoadingOperators}
                  >
                    <SelectTrigger
                      id="offer-operator"
                      className="w-full"
                      aria-invalid={Boolean(errors.operatorId)}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingOperators
                            ? "Loading operators..."
                            : "Select operator"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorOptions.length === 0 ? (
                        <SelectItem value="__unavailable__" disabled>
                          No operators available yet
                        </SelectItem>
                      ) : (
                        operatorOptions.map((operator) => (
                          <SelectItem key={operator.value} value={operator.value}>
                            {operator.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.operatorId]} />
            </Field>

            <Field data-invalid={Boolean(errors.type)}>
              <FieldLabel htmlFor="offer-type">Type</FieldLabel>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as ProductType)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="offer-type"
                      className="w-full"
                      aria-invalid={Boolean(errors.type)}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFER_TYPE_VALUES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {OFFER_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.type]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.price)}>
                <FieldLabel htmlFor="offer-price">Price (৳)</FieldLabel>
                <Input
                  id="offer-price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  aria-invalid={Boolean(errors.price)}
                  disabled={isSubmitting}
                  {...register("price", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.price]} />
              </Field>

              <Field data-invalid={Boolean(errors.commissionRate)}>
                <FieldLabel htmlFor="offer-commission">
                  Commission (%)
                </FieldLabel>
                <Input
                  id="offer-commission"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step="0.01"
                  aria-invalid={Boolean(errors.commissionRate)}
                  disabled={isSubmitting}
                  {...register("commissionRate", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.commissionRate]} />
              </Field>

              <Field data-invalid={Boolean(errors.referralCommissionRate)}>
                <FieldLabel htmlFor="offer-referral-commission">
                  Referral Commission (%)
                </FieldLabel>
                <Input
                  id="offer-referral-commission"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step="0.01"
                  aria-invalid={Boolean(errors.referralCommissionRate)}
                  disabled={isSubmitting}
                  {...register("referralCommissionRate", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.referralCommissionRate]} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="offer-description">Description</FieldLabel>
              <Textarea
                id="offer-description"
                rows={3}
                placeholder="Optional short description"
                aria-invalid={Boolean(errors.description)}
                disabled={isSubmitting}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field orientation="horizontal">
              <FieldLabel htmlFor="offer-active">Active</FieldLabel>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    id="offer-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
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
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Offer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
