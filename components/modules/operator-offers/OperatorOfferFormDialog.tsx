"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { format } from "date-fns";
import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/shared/DateTimePicker";
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
  FieldDescription,
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
import {
  AMOUNT_UNITS,
  COMMISSION_TYPES,
  DISCOUNT_TYPES,
  INVENTORY_MODES,
  OFFER_STATUSES,
  OFFER_TYPES,
  VALIDITY_UNITS,
} from "@/components/modules/operator-offers/add-operator-offer.constants";
import { OperatorOfferBadgeSelector } from "@/components/modules/operator-offers/OperatorOfferBadgeSelector";
import { useCreateOperatorOffer, useUpdateOperatorOffer } from "@/hooks/use-operator-offers";
import { useOperators } from "@/hooks/use-operators";
import { buildCreateOperatorOfferPayload } from "@/lib/operator-offer-calculations";
import {
  createOperatorOfferSchema,
  OFFER_DATETIME_FORMAT,
  type OperatorOfferFormValues,
} from "@/lib/operator-offer-validation";
import type { IOperatorOffer } from "@/types/operator-offer.types";

const BACKEND_FIELD_MAP: Partial<Record<string, keyof OperatorOfferFormValues>> = {
  name: "title",
  operatorId: "operatorIds",
  companyPurchasePrice: "companyPurchaseCost",
  offerType: "offerType",
  amount: "amount",
  amountUnit: "amountUnit",
  validityValue: "validityValue",
  validityUnit: "validityUnit",
  regularPrice: "regularPrice",
  discountType: "discountType",
  discountValue: "discountValue",
  resellerCommissionType: "resellerCommissionType",
  resellerCommissionValue: "resellerCommissionValue",
  agentCommissionType: "agentCommissionType",
  agentCommissionValue: "agentCommissionValue",
  inventoryMode: "inventoryMode",
  stockQuantity: "stockQuantity",
  badges: "badges",
  startsAt: "startsAt",
  endsAt: "endsAt",
  status: "status",
  description: "description",
};

function isoLocal(offsetDays: number, time: string): string {
  const [hours, minutes] = time.split(":").map((part) => Number(part));
  const date = new Date(Date.now() + offsetDays * 86_400_000);
  date.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0,
  );
  return format(date, OFFER_DATETIME_FORMAT);
}

const DEFAULT_VALUES: OperatorOfferFormValues = {
  title: "",
  description: "",
  operatorIds: [],
  offerType: "MB",
  amount: 1,
  amountUnit: "MB",
  validityValue: 30,
  validityUnit: "DAYS",
  regularPrice: 0,
  discountType: "NONE",
  discountValue: 0,
  companyPurchaseCost: 0,
  resellerCommissionType: "FIXED",
  resellerCommissionValue: 0,
  agentCommissionType: "FIXED",
  agentCommissionValue: 0,
  inventoryMode: "UNLIMITED",
  stockQuantity: 0,
  badges: [],
  startsAt: isoLocal(0, "00:00"),
  endsAt: isoLocal(30, "23:59"),
  status: "DRAFT",
};

function offerToFormValues(offer: IOperatorOffer): OperatorOfferFormValues {
  return {
    title: offer.name,
    description: offer.description ?? "",
    operatorIds: [offer.operatorId],
    offerType: offer.offerType,
    amount: offer.amount ?? 1,
    amountUnit: offer.amountUnit ?? "MB",
    validityValue: offer.validityValue ?? 30,
    validityUnit: offer.validityUnit ?? "DAYS",
    regularPrice: offer.regularPrice,
    discountType: offer.discountType,
    discountValue: offer.discountValue,
    companyPurchaseCost: offer.companyPurchasePrice,
    resellerCommissionType: offer.resellerCommissionType,
    resellerCommissionValue: offer.resellerCommissionValue,
    agentCommissionType: offer.agentCommissionType,
    agentCommissionValue: offer.agentCommissionValue,
    inventoryMode: offer.inventoryMode,
    stockQuantity: offer.stockQuantity ?? 0,
    badges: offer.badges,
    startsAt: format(new Date(offer.startsAt), OFFER_DATETIME_FORMAT),
    endsAt: format(new Date(offer.endsAt), OFFER_DATETIME_FORMAT),
    status: offer.status,
  };
}

interface OperatorOfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: IOperatorOffer | null;
}

export function OperatorOfferFormDialog({
  open,
  onOpenChange,
  offer,
}: OperatorOfferFormDialogProps) {
  const t = useTranslations("admin.operatorOfferForm");
  const te = useTranslations("enums");
  const tv = useTranslations("validation");
  const isEditing = Boolean(offer);

  const {
    mutateAsync: createOperatorOffer,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateOperatorOffer();

  const {
    mutateAsync: updateOperatorOffer,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateOperatorOffer();

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
  } = useForm<OperatorOfferFormValues>({
    resolver: standardSchemaResolver(createOperatorOfferSchema(tv)),
    defaultValues: DEFAULT_VALUES,
  });

  const watchedValues = useWatch({ control });
  const discountType = watchedValues.discountType ?? "NONE";
  const inventoryMode = watchedValues.inventoryMode ?? "UNLIMITED";
  const isLimitedStock = inventoryMode === "LIMITED";

  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset(offer ? offerToFormValues(offer) : DEFAULT_VALUES);
  }, [open, offer, reset, resetCreate, resetUpdate]);

  // Surface backend field-level validation errors on the matching inputs.
  useEffect(() => {
    if (!submissionError?.errorSources?.length) return;
    for (const source of submissionError.errorSources) {
      const target = BACKEND_FIELD_MAP[source.path];
      if (target) {
        setError(target, { type: "server", message: source.message });
      }
    }
  }, [submissionError, setError]);

  const hasFieldError = Boolean(
    submissionError?.errorSources?.some(
      (source) => BACKEND_FIELD_MAP[source.path],
    ),
  );
  const formError =
    submissionError && !hasFieldError
      ? (submissionError.errorSources?.[0]?.message ?? submissionError.message)
      : null;

  const submit = async (values: OperatorOfferFormValues) => {
    if (isSubmitting) return;

    clearErrors();
    const payload = buildCreateOperatorOfferPayload(values);

    try {
      if (isEditing && offer) {
        await updateOperatorOffer({ id: offer.id, payload });
      } else {
        await createOperatorOffer(payload);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>
            {isEditing ? t("editDescription") : t("addDescription")}
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
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="offer-dialog-title">{t("title")}</FieldLabel>
              <Input
                id="offer-dialog-title"
                placeholder={t("titlePlaceholder")}
                aria-invalid={Boolean(errors.title)}
                disabled={isSubmitting}
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="offer-dialog-description">
                {t("description")}
              </FieldLabel>
              <Textarea
                id="offer-dialog-description"
                rows={3}
                placeholder={t("descriptionPlaceholder")}
                aria-invalid={Boolean(errors.description)}
                disabled={isSubmitting}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.operatorIds)}>
                <FieldLabel htmlFor="offer-dialog-operator">
                  {t("operator")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="operatorIds"
                  render={({ field }) => (
                    <Select
                      value={field.value[0] ?? ""}
                      onValueChange={(value) => field.onChange([value])}
                      disabled={isSubmitting || isLoadingOperators}
                    >
                      <SelectTrigger
                        id="offer-dialog-operator"
                        className="w-full"
                        aria-invalid={Boolean(errors.operatorIds)}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingOperators
                              ? t("loadingOperators")
                              : t("operatorPlaceholder")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.length === 0 ? (
                          <SelectItem value="__unavailable__" disabled>
                            {t("noOperatorsAvailable")}
                          </SelectItem>
                        ) : (
                          operatorOptions.map((operator) => (
                            <SelectItem
                              key={operator.value}
                              value={operator.value}
                            >
                              {operator.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.operatorIds]} />
              </Field>

              <Field data-invalid={Boolean(errors.offerType)}>
                <FieldLabel htmlFor="offer-dialog-type">
                  {t("offerType")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="offerType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="offer-dialog-type"
                        className="w-full"
                        aria-invalid={Boolean(errors.offerType)}
                      >
                        <SelectValue placeholder={t("typePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {OFFER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {te(`offerType.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.offerType]} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.amount)}>
                <FieldLabel htmlFor="offer-dialog-amount">
                  {t("amount")}
                </FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="offer-dialog-amount"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step="1"
                    aria-invalid={Boolean(errors.amount)}
                    disabled={isSubmitting}
                    {...register("amount", { valueAsNumber: true })}
                  />
                  <Controller
                    control={control}
                    name="amountUnit"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="offer-dialog-amount-unit"
                          className="w-28"
                          aria-invalid={Boolean(errors.amountUnit)}
                        >
                          <SelectValue placeholder={t("amountUnitPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {AMOUNT_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {te(`amountUnit.${unit}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <FieldError errors={[errors.amount, errors.amountUnit]} />
              </Field>

              <Field data-invalid={Boolean(errors.validityValue)}>
                <FieldLabel htmlFor="offer-dialog-validity">
                  {t("validity")}
                </FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="offer-dialog-validity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step="1"
                    aria-invalid={Boolean(errors.validityValue)}
                    disabled={isSubmitting}
                    {...register("validityValue", { valueAsNumber: true })}
                  />
                  <Controller
                    control={control}
                    name="validityUnit"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="offer-dialog-validity-unit"
                          className="w-32"
                          aria-invalid={Boolean(errors.validityUnit)}
                        >
                          <SelectValue
                            placeholder={t("validityUnitPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {VALIDITY_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {te(`validityUnit.${unit}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <FieldError errors={[errors.validityValue, errors.validityUnit]} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field data-invalid={Boolean(errors.regularPrice)}>
                <FieldLabel htmlFor="offer-dialog-regular-price">
                  {t("regularPrice")}
                </FieldLabel>
                <Input
                  id="offer-dialog-regular-price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  aria-invalid={Boolean(errors.regularPrice)}
                  disabled={isSubmitting}
                  {...register("regularPrice", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.regularPrice]} />
              </Field>

              <Field data-invalid={Boolean(errors.discountType)}>
                <FieldLabel htmlFor="offer-dialog-discount-type">
                  {t("discountType")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="offer-dialog-discount-type"
                        className="w-full"
                        aria-invalid={Boolean(errors.discountType)}
                      >
                        <SelectValue placeholder={t("discountTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {DISCOUNT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {te(`discountType.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.discountType]} />
              </Field>

              <Field data-invalid={Boolean(errors.discountValue)}>
                <FieldLabel htmlFor="offer-dialog-discount-value">
                  {t("discountValue")}
                </FieldLabel>
                <Input
                  id="offer-dialog-discount-value"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  aria-invalid={Boolean(errors.discountValue)}
                  disabled={isSubmitting || discountType === "NONE"}
                  {...register("discountValue", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.discountValue]} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.companyPurchaseCost)}>
              <FieldLabel htmlFor="offer-dialog-company-cost">
                {t("companyCost")}
              </FieldLabel>
              <Input
                id="offer-dialog-company-cost"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                aria-invalid={Boolean(errors.companyPurchaseCost)}
                disabled={isSubmitting}
                {...register("companyPurchaseCost", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.companyPurchaseCost]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.resellerCommissionType)}>
                <FieldLabel htmlFor="offer-dialog-reseller-commission-type">
                  {t("resellerCommissionType")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="resellerCommissionType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="offer-dialog-reseller-commission-type"
                        className="w-full"
                        aria-invalid={Boolean(errors.resellerCommissionType)}
                      >
                        <SelectValue placeholder={t("commissionTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMISSION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {te(`commissionType.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.resellerCommissionType]} />
              </Field>

              <Field data-invalid={Boolean(errors.resellerCommissionValue)}>
                <FieldLabel htmlFor="offer-dialog-reseller-commission-value">
                  {t("resellerCommissionValue")}
                </FieldLabel>
                <Input
                  id="offer-dialog-reseller-commission-value"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  aria-invalid={Boolean(errors.resellerCommissionValue)}
                  disabled={isSubmitting}
                  {...register("resellerCommissionValue", {
                    valueAsNumber: true,
                  })}
                />
                <FieldError errors={[errors.resellerCommissionValue]} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.agentCommissionType)}>
                <FieldLabel htmlFor="offer-dialog-agent-commission-type">
                  {t("agentCommissionType")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="agentCommissionType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="offer-dialog-agent-commission-type"
                        className="w-full"
                        aria-invalid={Boolean(errors.agentCommissionType)}
                      >
                        <SelectValue placeholder={t("commissionTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMISSION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {te(`commissionType.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.agentCommissionType]} />
              </Field>

              <Field data-invalid={Boolean(errors.agentCommissionValue)}>
                <FieldLabel htmlFor="offer-dialog-agent-commission-value">
                  {t("agentCommissionValue")}
                </FieldLabel>
                <Input
                  id="offer-dialog-agent-commission-value"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  aria-invalid={Boolean(errors.agentCommissionValue)}
                  disabled={isSubmitting}
                  {...register("agentCommissionValue", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.agentCommissionValue]} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.inventoryMode)}>
                <FieldLabel htmlFor="offer-dialog-inventory-mode">
                  {t("inventoryMode")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="inventoryMode"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="offer-dialog-inventory-mode"
                        className="w-full"
                        aria-invalid={Boolean(errors.inventoryMode)}
                      >
                        <SelectValue placeholder={t("inventoryModePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {INVENTORY_MODES.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {te(`inventoryMode.${mode}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.inventoryMode]} />
              </Field>

              {isLimitedStock ? (
                <Field data-invalid={Boolean(errors.stockQuantity)}>
                  <FieldLabel htmlFor="offer-dialog-stock">
                    {t("stockQuantity")}
                  </FieldLabel>
                  <Input
                    id="offer-dialog-stock"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step="1"
                    aria-invalid={Boolean(errors.stockQuantity)}
                    disabled={isSubmitting}
                    {...register("stockQuantity", { valueAsNumber: true })}
                  />
                  <FieldDescription>
                    {t("stockQuantityDescription")}
                  </FieldDescription>
                  <FieldError errors={[errors.stockQuantity]} />
                </Field>
              ) : null}
            </div>

            <Field data-invalid={Boolean(errors.badges)}>
              <FieldLabel>{t("badges")}</FieldLabel>
              <Controller
                control={control}
                name="badges"
                render={({ field }) => (
                  <OperatorOfferBadgeSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FieldError errors={[errors.badges]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.startsAt)}>
                <FieldLabel htmlFor="offer-dialog-starts-at">
                  {t("startDateTime")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="startsAt"
                  render={({ field }) => (
                    <DateTimePicker
                      id="offer-dialog-starts-at"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      invalid={Boolean(errors.startsAt)}
                      placeholder={t("dateTimePlaceholder")}
                      dateLabel={t("selectDate")}
                      timeLabel={t("selectTime")}
                    />
                  )}
                />
                <FieldError errors={[errors.startsAt]} />
              </Field>

              <Field data-invalid={Boolean(errors.endsAt)}>
                <FieldLabel htmlFor="offer-dialog-ends-at">
                  {t("endDateTime")}
                </FieldLabel>
                <Controller
                  control={control}
                  name="endsAt"
                  render={({ field }) => (
                    <DateTimePicker
                      id="offer-dialog-ends-at"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      invalid={Boolean(errors.endsAt)}
                      placeholder={t("dateTimePlaceholder")}
                      dateLabel={t("selectDate")}
                      timeLabel={t("selectTime")}
                    />
                  )}
                />
                <FieldError errors={[errors.endsAt]} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.status)}>
              <FieldLabel htmlFor="offer-dialog-status">
                {t("status")}
              </FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="offer-dialog-status"
                      className="w-full sm:w-64"
                      aria-invalid={Boolean(errors.status)}
                    >
                      <SelectValue placeholder={t("statusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {te(`offerStatus.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.status]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {isEditing ? t("saving") : t("creating")}
                </>
              ) : isEditing ? (
                t("saveChanges")
              ) : (
                t("createOperatorOffer")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
