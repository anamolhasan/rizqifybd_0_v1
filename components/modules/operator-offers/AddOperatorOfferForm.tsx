"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { format } from "date-fns";
import {
  AlertCircle,
  Loader2,
  RotateCcw,
  Save,
  SendHorizonal,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { DateTimePicker } from "@/components/shared/DateTimePicker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useCreateOperatorOffer } from "@/hooks/use-operator-offers";
import { useOperators } from "@/hooks/use-operators";
import { ApiError } from "@/lib/api";
import { formatBDT } from "@/lib/format";
import {
  buildCreateOperatorOfferPayload,
  calculateProfitBreakdown,
  calculateSellingPrice,
} from "@/lib/operator-offer-calculations";
import {
  createOperatorOfferSchema,
  OFFER_DATETIME_FORMAT,
  type OperatorOfferFormValues,
} from "@/lib/operator-offer-validation";
import {
  AMOUNT_UNITS,
  COMMISSION_TYPES,
  DISCOUNT_TYPES,
  INVENTORY_MODES,
  OFFER_STATUSES,
  OFFER_TYPES,
  VALIDITY_UNITS,
} from "./add-operator-offer.constants";
import { OperatorOfferBadgeSelector } from "./OperatorOfferBadgeSelector";
import { OperatorOfferOperatorMultiSelect } from "./OperatorOfferOperatorMultiSelect";
import { OperatorOfferProfitPanel } from "./OperatorOfferProfitPanel";
import { useTranslations } from "next-intl";

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

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function mapSourcePath(path: string): keyof OperatorOfferFormValues | null {
  switch (path) {
    case "name":
      return "title";
    case "operatorId":
      return "operatorIds";
    case "companyPurchasePrice":
      return "companyPurchaseCost";
    case "offerType":
      return "offerType";
    case "amount":
      return "amount";
    case "amountUnit":
      return "amountUnit";
    case "validityValue":
      return "validityValue";
    case "validityUnit":
      return "validityUnit";
    case "regularPrice":
      return "regularPrice";
    case "discountType":
      return "discountType";
    case "discountValue":
      return "discountValue";
    case "resellerCommissionType":
      return "resellerCommissionType";
    case "resellerCommissionValue":
      return "resellerCommissionValue";
    case "agentCommissionType":
      return "agentCommissionType";
    case "agentCommissionValue":
      return "agentCommissionValue";
    case "inventoryMode":
      return "inventoryMode";
    case "stockQuantity":
      return "stockQuantity";
    case "badges":
      return "badges";
    case "startsAt":
      return "startsAt";
    case "endsAt":
      return "endsAt";
    case "status":
      return "status";
    case "description":
      return "description";
    default:
      return null;
  }
}

export function AddOperatorOfferForm() {
  const router = useRouter();
  const t = useTranslations("admin.operatorOfferForm");
  const te = useTranslations("enums");
  const tv = useTranslations("validation");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: operatorsData, isLoading: isLoadingOperators } = useOperators({
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const operators = useMemo(() => operatorsData?.data ?? [], [operatorsData]);

  const {
    mutateAsync: createOperatorOffer,
    isPending,
    reset: resetMutation,
  } = useCreateOperatorOffer();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<OperatorOfferFormValues>({
    resolver: standardSchemaResolver(createOperatorOfferSchema(tv)),
    defaultValues: DEFAULT_VALUES,
  });

  const watchedValues = useWatch({ control });
  const discountType = watchedValues.discountType ?? "NONE";
  const inventoryMode = watchedValues.inventoryMode ?? "UNLIMITED";
  const isLimitedStock = inventoryMode === "LIMITED";

  const busy = isPending || isSubmitting;

  const pricing = useMemo(() => {
    const input = {
      regularPrice: toNumber(watchedValues.regularPrice),
      discountType: watchedValues.discountType ?? "NONE",
      discountValue: toNumber(watchedValues.discountValue),
      companyPurchaseCost: toNumber(watchedValues.companyPurchaseCost),
      resellerCommissionType: watchedValues.resellerCommissionType ?? "FIXED",
      resellerCommissionValue: toNumber(watchedValues.resellerCommissionValue),
      agentCommissionType: watchedValues.agentCommissionType ?? "FIXED",
      agentCommissionValue: toNumber(watchedValues.agentCommissionValue),
    };
    const { sellingPrice } = calculateSellingPrice(
      input.regularPrice,
      input.discountType,
      input.discountValue,
    );
    const breakdown = calculateProfitBreakdown(input);
    return {
      sellingPrice,
      breakdown,
      resellerProfit: breakdown.resellerSale.estimatedProfit,
      agentProfit: breakdown.agentSale.estimatedProfit,
    };
  }, [watchedValues]);

  const fieldErrors = (name: keyof OperatorOfferFormValues) => [
    errors[name] as { message?: string } | undefined,
  ];

  const submit = async (
    values: OperatorOfferFormValues,
    action: "draft" | "publish",
  ) => {
    if (busy) return;

    setFormError(null);
    setSuccessMessage(null);
    clearErrors();
    resetMutation();

    const status: OperatorOfferFormValues["status"] =
      action === "draft"
        ? "DRAFT"
        : values.status === "DRAFT"
          ? "ACTIVE"
          : values.status;

    const payload = buildCreateOperatorOfferPayload({
      title: values.title,
      description: values.description,
      operatorIds: values.operatorIds,
      offerType: values.offerType,
      amount: values.amount,
      amountUnit: values.amountUnit,
      validityValue: values.validityValue,
      validityUnit: values.validityUnit,
      regularPrice: values.regularPrice,
      discountType: values.discountType,
      discountValue: values.discountValue,
      companyPurchaseCost: values.companyPurchaseCost,
      resellerCommissionType: values.resellerCommissionType,
      resellerCommissionValue: values.resellerCommissionValue,
      agentCommissionType: values.agentCommissionType,
      agentCommissionValue: values.agentCommissionValue,
      inventoryMode: values.inventoryMode,
      stockQuantity: values.stockQuantity,
      badges: values.badges,
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      status,
    });

    try {
      await createOperatorOffer(payload);
      reset({ ...DEFAULT_VALUES, badges: [], status });
      setSuccessMessage(
        action === "publish"
          ? t("successPublished", { title: values.title })
          : t("successDraft", { title: values.title }),
      );
    } catch (error) {
      let mapped = false;

      if (error instanceof ApiError && error.errorSources?.length) {
        for (const source of error.errorSources) {
          const target = mapSourcePath(source.path);
          if (target) {
            setError(target, { type: "server", message: source.message });
            mapped = true;
          }
        }
      }

      if (!mapped) {
        setFormError(
          error instanceof Error
            ? error.message
            : "Unable to save the offer. Please try again.",
        );
      }
    }
  };

  const onSubmitDraft = handleSubmit((values) => submit(values, "draft"));
  const onSubmitPublish = handleSubmit((values) => submit(values, "publish"));

  const handleReset = () => {
    reset(DEFAULT_VALUES);
    clearErrors();
    setFormError(null);
    setSuccessMessage(null);
    resetMutation();
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("addTitle")} description={t("addDescription")} />

      <form
        onSubmit={onSubmitPublish}
        noValidate
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="space-y-6">
          {formError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          {successMessage ? (
            <Alert>
              <AlertTitle>{t("successOfferSaved")}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : null}

          {/* 1. Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("basicInfo")}</CardTitle>
              <CardDescription>{t("basicInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.title)}>
                  <FieldLabel htmlFor="offer-title">{t("title")}</FieldLabel>
                  <Input
                    id="offer-title"
                    placeholder={t("titlePlaceholder")}
                    aria-invalid={Boolean(errors.title)}
                    disabled={busy}
                    {...register("title")}
                  />
                  <FieldError errors={fieldErrors("title")} />
                </Field>

                <Field data-invalid={Boolean(errors.description)}>
                  <FieldLabel htmlFor="offer-description">
                    {t("description")}
                  </FieldLabel>
                  <Textarea
                    id="offer-description"
                    rows={3}
                    placeholder={t("descriptionPlaceholder")}
                    aria-invalid={Boolean(errors.description)}
                    disabled={busy}
                    {...register("description")}
                  />
                  <FieldError errors={fieldErrors("description")} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 2. Operator and Offer Type */}
          <Card>
            <CardHeader>
              <CardTitle>{t("operatorAndType")}</CardTitle>
              <CardDescription>
                {t("operatorAndTypeDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.operatorIds)}>
                  <FieldLabel htmlFor="offer-operators">
                    {t("operators")}
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="operatorIds"
                    render={({ field }) => (
                      <OperatorOfferOperatorMultiSelect
                        options={operators}
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={isLoadingOperators}
                        invalid={Boolean(errors.operatorIds)}
                        disabled={busy}
                      />
                    )}
                  />
                  <FieldDescription>
                    {t("operatorsDescription")}
                  </FieldDescription>
                  <FieldError errors={fieldErrors("operatorIds")} />
                </Field>

                <Field data-invalid={Boolean(errors.offerType)}>
                  <FieldLabel htmlFor="offer-type">{t("offerType")}</FieldLabel>
                  <Controller
                    control={control}
                    name="offerType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={busy}
                      >
                        <SelectTrigger
                          id="offer-type"
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
                  <FieldError errors={fieldErrors("offerType")} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 3. Package Quantity and Unit */}
          <Card>
            <CardHeader>
              <CardTitle>{t("packageQuantity")}</CardTitle>
              <CardDescription>
                {t("packageQuantityDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.amount)}>
                    <FieldLabel htmlFor="offer-amount">{t("amount")}</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id="offer-amount"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step="1"
                        aria-invalid={Boolean(errors.amount)}
                        disabled={busy}
                        {...register("amount", { valueAsNumber: true })}
                      />
                      <Controller
                        control={control}
                        name="amountUnit"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={busy}
                          >
                            <SelectTrigger
                              id="offer-amount-unit"
                              className="w-28"
                              aria-invalid={Boolean(errors.amountUnit)}
                            >
                              <SelectValue
                                placeholder={t("amountUnitPlaceholder")}
                              />
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
                    <FieldError errors={fieldErrors("amount")} />
                    <FieldError errors={fieldErrors("amountUnit")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.validityValue)}>
                    <FieldLabel htmlFor="offer-validity">
                      {t("validity")}
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id="offer-validity"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step="1"
                        aria-invalid={Boolean(errors.validityValue)}
                        disabled={busy}
                        {...register("validityValue", { valueAsNumber: true })}
                      />
                      <Controller
                        control={control}
                        name="validityUnit"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={busy}
                          >
                            <SelectTrigger
                              id="offer-validity-unit"
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
                    <FieldError errors={fieldErrors("validityValue")} />
                    <FieldError errors={fieldErrors("validityUnit")} />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 4. Pricing and Discount */}
          <Card>
            <CardHeader>
              <CardTitle>{t("pricingDiscount")}</CardTitle>
              <CardDescription>
                {t("pricingDiscountDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.regularPrice)}>
                    <FieldLabel htmlFor="offer-regular-price">
                      {t("regularPrice")}
                    </FieldLabel>
                    <Input
                      id="offer-regular-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      aria-invalid={Boolean(errors.regularPrice)}
                      disabled={busy}
                      {...register("regularPrice", { valueAsNumber: true })}
                    />
                    <FieldError errors={fieldErrors("regularPrice")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.discountType)}>
                    <FieldLabel htmlFor="offer-discount-type">
                      {t("discountType")}
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="discountType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={busy}
                        >
                          <SelectTrigger
                            id="offer-discount-type"
                            className="w-full"
                            aria-invalid={Boolean(errors.discountType)}
                          >
                            <SelectValue
                              placeholder={t("discountTypePlaceholder")}
                            />
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
                    <FieldError errors={fieldErrors("discountType")} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.discountValue)}>
                    <FieldLabel htmlFor="offer-discount-value">
                      {t("discountValue")}
                    </FieldLabel>
                    <Input
                      id="offer-discount-value"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      aria-invalid={Boolean(errors.discountValue)}
                      disabled={busy || discountType === "NONE"}
                      {...register("discountValue", { valueAsNumber: true })}
                    />
                    <FieldError errors={fieldErrors("discountValue")} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="offer-selling-price">
                      {t("sellingPrice")}
                    </FieldLabel>
                    <Input
                      id="offer-selling-price"
                      readOnly
                      value={formatBDT(pricing.sellingPrice)}
                      className="bg-muted/50"
                      disabled
                    />
                    <FieldDescription>
                      {t("sellingPriceDescription")}
                    </FieldDescription>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 5. Commission */}
          <Card>
            <CardHeader>
              <CardTitle>{t("commissionSection")}</CardTitle>
              <CardDescription>
                {t("commissionSectionDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.companyPurchaseCost)}>
                  <FieldLabel htmlFor="offer-company-cost">
                    {t("companyCost")}
                  </FieldLabel>
                  <Input
                    id="offer-company-cost"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    aria-invalid={Boolean(errors.companyPurchaseCost)}
                    disabled={busy}
                    {...register("companyPurchaseCost", { valueAsNumber: true })}
                  />
                  <FieldError errors={fieldErrors("companyPurchaseCost")} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.resellerCommissionType)}>
                    <FieldLabel htmlFor="offer-reseller-commission-type">
                      {t("resellerCommissionType")}
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="resellerCommissionType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={busy}
                        >
                          <SelectTrigger
                            id="offer-reseller-commission-type"
                            className="w-full"
                            aria-invalid={Boolean(errors.resellerCommissionType)}
                          >
                            <SelectValue
                              placeholder={t("commissionTypePlaceholder")}
                            />
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
                    <FieldError
                      errors={fieldErrors("resellerCommissionType")}
                    />
                  </Field>

                  <Field data-invalid={Boolean(errors.resellerCommissionValue)}>
                    <FieldLabel htmlFor="offer-reseller-commission-value">
                      {t("resellerCommissionValue")}
                    </FieldLabel>
                    <Input
                      id="offer-reseller-commission-value"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      aria-invalid={Boolean(errors.resellerCommissionValue)}
                      disabled={busy}
                      {...register("resellerCommissionValue", {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError errors={fieldErrors("resellerCommissionValue")} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.agentCommissionType)}>
                    <FieldLabel htmlFor="offer-agent-commission-type">
                      {t("agentCommissionType")}
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="agentCommissionType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={busy}
                        >
                          <SelectTrigger
                            id="offer-agent-commission-type"
                            className="w-full"
                            aria-invalid={Boolean(errors.agentCommissionType)}
                          >
                            <SelectValue
                              placeholder={t("commissionTypePlaceholder")}
                            />
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
                    <FieldError errors={fieldErrors("agentCommissionType")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.agentCommissionValue)}>
                    <FieldLabel htmlFor="offer-agent-commission-value">
                      {t("agentCommissionValue")}
                    </FieldLabel>
                    <Input
                      id="offer-agent-commission-value"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      aria-invalid={Boolean(errors.agentCommissionValue)}
                      disabled={busy}
                      {...register("agentCommissionValue", {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError errors={fieldErrors("agentCommissionValue")} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="offer-reseller-profit">
                      {t("resellerProfit")}
                    </FieldLabel>
                    <Input
                      id="offer-reseller-profit"
                      readOnly
                      value={formatBDT(pricing.resellerProfit)}
                      className="bg-muted/50"
                      disabled
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="offer-agent-profit">
                      {t("agentProfit")}
                    </FieldLabel>
                    <Input
                      id="offer-agent-profit"
                      readOnly
                      value={formatBDT(pricing.agentProfit)}
                      className="bg-muted/50"
                      disabled
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 6. Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>{t("inventory")}</CardTitle>
              <CardDescription>{t("inventoryDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.inventoryMode)}>
                    <FieldLabel htmlFor="offer-inventory-mode">
                      {t("inventoryMode")}
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="inventoryMode"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={busy}
                        >
                          <SelectTrigger
                            id="offer-inventory-mode"
                            className="w-full"
                            aria-invalid={Boolean(errors.inventoryMode)}
                          >
                            <SelectValue
                              placeholder={t("inventoryModePlaceholder")}
                            />
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
                    <FieldError errors={fieldErrors("inventoryMode")} />
                  </Field>

                  {isLimitedStock ? (
                    <Field data-invalid={Boolean(errors.stockQuantity)}>
                      <FieldLabel htmlFor="offer-stock">
                        {t("stockQuantity")}
                      </FieldLabel>
                      <Input
                        id="offer-stock"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step="1"
                        aria-invalid={Boolean(errors.stockQuantity)}
                        disabled={busy}
                        {...register("stockQuantity", { valueAsNumber: true })}
                      />
                      <FieldDescription>
                        {t("stockQuantityDescription")}
                      </FieldDescription>
                      <FieldError errors={fieldErrors("stockQuantity")} />
                    </Field>
                  ) : null}
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 7. Badges */}
          <Card>
            <CardHeader>
              <CardTitle>{t("badges")}</CardTitle>
              <CardDescription>{t("badgesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.badges)}>
                  <Controller
                    control={control}
                    name="badges"
                    render={({ field }) => (
                      <OperatorOfferBadgeSelector
                        value={field.value}
                        onChange={field.onChange}
                        disabled={busy}
                      />
                    )}
                  />
                  <FieldError errors={fieldErrors("badges")} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* 8. Schedule and Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t("scheduleStatus")}</CardTitle>
              <CardDescription>{t("scheduleStatusDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.startsAt)}>
                    <FieldLabel htmlFor="offer-starts-at">
                      {t("startDateTime")}
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="startsAt"
                      render={({ field }) => (
                        <DateTimePicker
                          id="offer-starts-at"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={busy}
                          invalid={Boolean(errors.startsAt)}
                          placeholder={t("dateTimePlaceholder")}
                          dateLabel={t("selectDate")}
                          timeLabel={t("selectTime")}
                        />
                      )}
                    />
                    <FieldError errors={fieldErrors("startsAt")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.endsAt)}>
                    <FieldLabel htmlFor="offer-ends-at">
                      {t("endDateTime")}
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="endsAt"
                      render={({ field }) => (
                        <DateTimePicker
                          id="offer-ends-at"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={busy}
                          invalid={Boolean(errors.endsAt)}
                          placeholder={t("dateTimePlaceholder")}
                          dateLabel={t("selectDate")}
                          timeLabel={t("selectTime")}
                        />
                      )}
                    />
                    <FieldError errors={fieldErrors("endsAt")} />
                  </Field>
                </div>

                <Field data-invalid={Boolean(errors.status)}>
                  <FieldLabel htmlFor="offer-status">{t("status")}</FieldLabel>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={busy}
                      >
                        <SelectTrigger
                          id="offer-status"
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
                  <FieldError errors={fieldErrors("status")} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{t("profitSummary")}</CardTitle>
              <CardDescription>{t("profitSummaryDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <OperatorOfferProfitPanel
                sellingPrice={pricing.sellingPrice}
                companyPurchaseCost={toNumber(
                  watchedValues.companyPurchaseCost,
                )}
                breakdown={pricing.breakdown}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              <Button
                type="submit"
                disabled={busy}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {busy ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("publishing")}
                  </>
                ) : (
                  <>
                    <SendHorizonal />
                    {t("publishOffer")}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={onSubmitDraft}
              >
                <Save />
                {t("saveAsDraft")}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={handleReset}
              >
                <RotateCcw />
                {t("reset")}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() =>
                  router.push("/admin/dashboard/operator-offers")
                }
              >
                {t("cancel")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
