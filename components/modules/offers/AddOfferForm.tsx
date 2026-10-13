"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  AlertCircle,
  Loader2,
  RotateCcw,
  Save,
  SendHorizonal,
} from "lucide-react";
import { z } from "zod";

import { PageHeader } from "@/components/shared/PageHeader";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOffer } from "@/hooks/use-offers";
import { useOperators } from "@/hooks/use-operators";
import { ApiError } from "@/lib/api";
import { formatBDT } from "@/lib/format";
import {
  buildCreateOfferPayloadSubset,
  calculateProfitBreakdown,
  calculateSellingPrice,
} from "@/lib/offer-calculations";
import {
  AMOUNT_UNIT_LABELS,
  AMOUNT_UNITS,
  DISCOUNT_TYPE_LABELS,
  DISCOUNT_TYPES,
  OFFER_BADGES,
  OFFER_STATUS_LABELS,
  OFFER_STATUSES,
  OFFER_TYPE_LABELS,
  OFFER_TYPES,
  VALIDITY_UNIT_LABELS,
  VALIDITY_UNITS,
} from "./add-offer.constants";
import { OfferBadgeSelector } from "./OfferBadgeSelector";
import { OfferOperatorMultiSelect } from "./OfferOperatorMultiSelect";
import { OfferProfitPanel } from "./OfferProfitPanel";

const addOfferSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Offer title is required" })
      .max(150, { message: "Offer title must be at most 150 characters" }),
    operatorIds: z
      .array(z.string())
      .min(1, { message: "Select at least one operator" }),
    offerType: z.enum(OFFER_TYPES),
    amount: z.coerce
      .number({ message: "Amount is required" })
      .positive({ message: "Amount must be greater than 0" }),
    amountUnit: z.enum(AMOUNT_UNITS),
    validityValue: z.coerce
      .number({ message: "Validity is required" })
      .positive({ message: "Validity must be greater than 0" }),
    validityUnit: z.enum(VALIDITY_UNITS),
    badges: z.array(z.enum(OFFER_BADGES)).default([]),
    description: z
      .string()
      .max(2000, { message: "Description must be at most 2000 characters" })
      .optional()
      .default(""),
    regularPrice: z.coerce
      .number({ message: "Regular price is required" })
      .nonnegative({ message: "Regular price must be zero or greater" }),
    discountType: z.enum(DISCOUNT_TYPES),
    discountValue: z.coerce
      .number({ message: "Discount value is required" })
      .nonnegative({ message: "Discount value must be zero or greater" }),
    companyPurchaseCost: z.coerce
      .number({ message: "Company cost is required" })
      .nonnegative({ message: "Company cost must be zero or greater" }),
    resellerCommissionAmount: z.coerce
      .number({ message: "Reseller commission is required" })
      .nonnegative({ message: "Reseller commission must be zero or greater" }),
    agentCommissionAmount: z.coerce
      .number({ message: "Agent commission is required" })
      .nonnegative({ message: "Agent commission must be zero or greater" }),
    stockQuantity: z.coerce
      .number({ message: "Stock is required" })
      .int({ message: "Stock must be a whole number" })
      .nonnegative({ message: "Stock cannot be negative" }),
    unlimitedStock: z.boolean().default(false),
    startDate: z.string().min(1, { message: "Start date is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endDate: z.string().min(1, { message: "End date is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    status: z.enum(OFFER_STATUSES),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
      ctx.addIssue({
        code: "custom",
        message: "Discount percentage cannot exceed 100%",
        path: ["discountValue"],
      });
    }

    if (data.discountType === "FIXED" && data.discountValue > data.regularPrice) {
      ctx.addIssue({
        code: "custom",
        message: "Discount cannot exceed the regular price",
        path: ["discountValue"],
      });
    }

    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid start date/time",
        path: ["startDate"],
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid end date/time",
        path: ["endDate"],
      });
    }

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end.getTime() <= start.getTime()
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End date/time must be after the start",
        path: ["endDate"],
      });
    }
  });

type AddOfferFormValues = z.infer<typeof addOfferSchema>;

function isoDate(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

const DEFAULT_VALUES: AddOfferFormValues = {
  title: "",
  operatorIds: [],
  offerType: "MB",
  amount: 1,
  amountUnit: "MB",
  validityValue: 30,
  validityUnit: "DAYS",
  badges: [],
  description: "",
  regularPrice: 0,
  discountType: "FIXED",
  discountValue: 0,
  companyPurchaseCost: 0,
  resellerCommissionAmount: 0,
  agentCommissionAmount: 0,
  stockQuantity: 0,
  unlimitedStock: false,
  startDate: isoDate(0),
  startTime: "00:00",
  endDate: isoDate(30),
  endTime: "23:59",
  status: "DRAFT",
};

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function mapSourcePath(path: string): keyof AddOfferFormValues | null {
  switch (path) {
    case "name":
      return "title";
    case "operatorId":
      return "operatorIds";
    case "type":
      return "offerType";
    case "price":
      return "regularPrice";
    case "commissionRate":
      return "resellerCommissionAmount";
    case "description":
      return "description";
    default:
      return null;
  }
}

export function AddOfferForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: operatorsData, isLoading: isLoadingOperators } = useOperators({
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const operators = useMemo(() => operatorsData?.data ?? [], [operatorsData]);

  const {
    mutateAsync: createOffer,
    isPending,
    reset: resetMutation,
  } = useCreateOffer();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AddOfferFormValues>({
    resolver: standardSchemaResolver(addOfferSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const watchedValues = useWatch({ control });
  const unlimitedStock = Boolean(watchedValues.unlimitedStock);

  const busy = isPending || isSubmitting;

  const pricing = useMemo(() => {
    const input = {
      regularPrice: toNumber(watchedValues.regularPrice),
      discountType: watchedValues.discountType ?? "FIXED",
      discountValue: toNumber(watchedValues.discountValue),
      companyPurchaseCost: toNumber(watchedValues.companyPurchaseCost),
      resellerCommissionAmount: toNumber(watchedValues.resellerCommissionAmount),
      agentCommissionAmount: toNumber(watchedValues.agentCommissionAmount),
    };
    const { sellingPrice } = calculateSellingPrice(
      input.regularPrice,
      input.discountType,
      input.discountValue,
    );
    return { sellingPrice, breakdown: calculateProfitBreakdown(input) };
  }, [watchedValues]);

  const fieldErrors = (name: keyof AddOfferFormValues) => [
    errors[name] as { message?: string } | undefined,
  ];

  const submit = async (
    values: AddOfferFormValues,
    action: "draft" | "publish",
  ) => {
    if (busy) return;

    setFormError(null);
    setSuccessMessage(null);
    clearErrors();
    resetMutation();

    const isActive = action === "publish";
    const status: AddOfferFormValues["status"] =
      action === "draft" ? "DRAFT" : values.status === "DRAFT" ? "ACTIVE" : values.status;

    const { sellingPrice } = calculateSellingPrice(
      values.regularPrice,
      values.discountType,
      values.discountValue,
    );

    const payload = buildCreateOfferPayloadSubset({
      name: values.title,
      operatorId: values.operatorIds[0],
      offerType: values.offerType,
      price: sellingPrice,
      resellerCommissionAmount: toNumber(values.resellerCommissionAmount),
      isActive,
      description: values.description,
    });

    try {
      await createOffer(payload);
      reset({ ...DEFAULT_VALUES, badges: [], status });
      setSuccessMessage(
        action === "publish"
          ? `“${values.title}” has been published.`
          : `“${values.title}” was saved as a draft.`,
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
      <PageHeader
        title="Add Offer"
        description="Create a telecom offer with pricing, commission, and availability details."
      />

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
              <AlertTitle>Offer saved</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Describe the offer and choose the operators it applies to.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.title)}>
                  <FieldLabel htmlFor="offer-title">Offer Title</FieldLabel>
                  <Input
                    id="offer-title"
                    placeholder="e.g. 10GB Monthly Internet"
                    aria-invalid={Boolean(errors.title)}
                    disabled={busy}
                    {...register("title")}
                  />
                  <FieldError errors={fieldErrors("title")} />
                </Field>

                <Field data-invalid={Boolean(errors.operatorIds)}>
                  <FieldLabel htmlFor="offer-operators">Operators</FieldLabel>
                  <Controller
                    control={control}
                    name="operatorIds"
                    render={({ field }) => (
                      <OfferOperatorMultiSelect
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
                    Select one or more operators this offer is available for.
                  </FieldDescription>
                  <FieldError errors={fieldErrors("operatorIds")} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.offerType)}>
                    <FieldLabel htmlFor="offer-type">Offer Type</FieldLabel>
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
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {OFFER_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {OFFER_TYPE_LABELS[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={fieldErrors("offerType")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.amount)}>
                    <FieldLabel htmlFor="offer-amount">Amount</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id="offer-amount"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
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
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {AMOUNT_UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {AMOUNT_UNIT_LABELS[unit]}
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
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.validityValue)}>
                    <FieldLabel htmlFor="offer-validity">Validity</FieldLabel>
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
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {VALIDITY_UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {VALIDITY_UNIT_LABELS[unit]}
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

                  <Field data-invalid={Boolean(errors.badges)}>
                    <FieldLabel>Badges</FieldLabel>
                    <Controller
                      control={control}
                      name="badges"
                      render={({ field }) => (
                        <OfferBadgeSelector
                          value={field.value}
                          onChange={field.onChange}
                          disabled={busy}
                        />
                      )}
                    />
                    <FieldDescription>
                      Optional highlights shown on the offer card.
                    </FieldDescription>
                  </Field>
                </div>

                <Field data-invalid={Boolean(errors.description)}>
                  <FieldLabel htmlFor="offer-description">Description</FieldLabel>
                  <Textarea
                    id="offer-description"
                    rows={3}
                    placeholder="Optional short description"
                    aria-invalid={Boolean(errors.description)}
                    disabled={busy}
                    {...register("description")}
                  />
                  <FieldError errors={fieldErrors("description")} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing &amp; Commission</CardTitle>
              <CardDescription>
                Set pricing and the commission paid to resellers or agents. The
                selling price is calculated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.regularPrice)}>
                    <FieldLabel htmlFor="offer-regular-price">
                      Regular Price (৳)
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
                      Discount Type
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
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                          <SelectContent>
                            {DISCOUNT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {DISCOUNT_TYPE_LABELS[type]}
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
                      Discount Value
                    </FieldLabel>
                    <Input
                      id="offer-discount-value"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      aria-invalid={Boolean(errors.discountValue)}
                      disabled={busy}
                      {...register("discountValue", { valueAsNumber: true })}
                    />
                    <FieldError errors={fieldErrors("discountValue")} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="offer-selling-price">
                      Selling Price (৳)
                    </FieldLabel>
                    <Input
                      id="offer-selling-price"
                      readOnly
                      value={formatBDT(pricing.sellingPrice)}
                      className="bg-muted/50"
                      disabled
                    />
                    <FieldDescription>
                      Calculated from the regular price and discount.
                    </FieldDescription>
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.companyPurchaseCost)}>
                    <FieldLabel htmlFor="offer-company-cost">
                      Company Purchase Cost (৳)
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

                  <Field data-invalid={Boolean(errors.resellerCommissionAmount)}>
                    <FieldLabel htmlFor="offer-reseller-commission">
                      Reseller Commission (৳)
                    </FieldLabel>
                    <Input
                      id="offer-reseller-commission"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      aria-invalid={Boolean(errors.resellerCommissionAmount)}
                      disabled={busy}
                      {...register("resellerCommissionAmount", {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError errors={fieldErrors("resellerCommissionAmount")} />
                  </Field>
                </div>

                <Field data-invalid={Boolean(errors.agentCommissionAmount)}>
                  <FieldLabel htmlFor="offer-agent-commission">
                    Agent Commission (৳)
                  </FieldLabel>
                  <Input
                    id="offer-agent-commission"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    aria-invalid={Boolean(errors.agentCommissionAmount)}
                    disabled={busy}
                    {...register("agentCommissionAmount", { valueAsNumber: true })}
                  />
                  <FieldError errors={fieldErrors("agentCommissionAmount")} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory &amp; Schedule</CardTitle>
              <CardDescription>
                Control stock and when the offer is available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.stockQuantity)}>
                    <FieldLabel htmlFor="offer-stock">Stock Quantity</FieldLabel>
                    <Input
                      id="offer-stock"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="1"
                      aria-invalid={Boolean(errors.stockQuantity)}
                      disabled={busy || unlimitedStock}
                      {...register("stockQuantity", { valueAsNumber: true })}
                    />
                    <FieldError errors={fieldErrors("stockQuantity")} />
                  </Field>

                  <Field orientation="horizontal" className="sm:pt-6">
                    <FieldLabel htmlFor="offer-unlimited-stock">
                      Unlimited Stock
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="unlimitedStock"
                      render={({ field }) => (
                        <Switch
                          id="offer-unlimited-stock"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={busy}
                        />
                      )}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field data-invalid={Boolean(errors.startDate)}>
                    <FieldLabel htmlFor="offer-start-date">Start Date</FieldLabel>
                    <Input
                      id="offer-start-date"
                      type="date"
                      aria-invalid={Boolean(errors.startDate)}
                      disabled={busy}
                      {...register("startDate")}
                    />
                    <FieldError errors={fieldErrors("startDate")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.startTime)}>
                    <FieldLabel htmlFor="offer-start-time">Start Time</FieldLabel>
                    <Input
                      id="offer-start-time"
                      type="time"
                      aria-invalid={Boolean(errors.startTime)}
                      disabled={busy}
                      {...register("startTime")}
                    />
                    <FieldError errors={fieldErrors("startTime")} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field data-invalid={Boolean(errors.endDate)}>
                    <FieldLabel htmlFor="offer-end-date">End Date</FieldLabel>
                    <Input
                      id="offer-end-date"
                      type="date"
                      aria-invalid={Boolean(errors.endDate)}
                      disabled={busy}
                      {...register("endDate")}
                    />
                    <FieldError errors={fieldErrors("endDate")} />
                  </Field>

                  <Field data-invalid={Boolean(errors.endTime)}>
                    <FieldLabel htmlFor="offer-end-time">End Time</FieldLabel>
                    <Input
                      id="offer-end-time"
                      type="time"
                      aria-invalid={Boolean(errors.endTime)}
                      disabled={busy}
                      {...register("endTime")}
                    />
                    <FieldError errors={fieldErrors("endTime")} />
                  </Field>
                </div>

                <Field data-invalid={Boolean(errors.status)}>
                  <FieldLabel htmlFor="offer-status">Status</FieldLabel>
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {OFFER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {OFFER_STATUS_LABELS[status]}
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
              <CardTitle>Profit Summary</CardTitle>
              <CardDescription>
                Estimated profit after company cost and the applicable
                commission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OfferProfitPanel
                sellingPrice={pricing.sellingPrice}
                companyPurchaseCost={toNumber(watchedValues.companyPurchaseCost)}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <SendHorizonal />
                    Publish Offer
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
                Save as Draft
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={handleReset}
              >
                <RotateCcw />
                Reset
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => router.push("/admin/dashboard/offers-management")}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
