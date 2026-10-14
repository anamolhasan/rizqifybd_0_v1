import { isValid, parse } from "date-fns";
import { z } from "zod";

import {
  AMOUNT_UNITS,
  COMMISSION_TYPES,
  DISCOUNT_TYPES,
  INVENTORY_MODES,
  OFFER_BADGES,
  OFFER_STATUSES,
  OFFER_TYPES,
  VALIDITY_UNITS,
} from "@/components/modules/operator-offers/add-operator-offer.constants";
import { calculateSellingPrice } from "@/lib/operator-offer-calculations";
import type { ValidationTranslator } from "@/lib/validations";

/**
 * Shared offer authoring validation. Kept as a factory (mirroring
 * lib/validations.ts) so the schema can be reused by the form and by unit tests
 * while producing translated messages through a next-intl translator.
 *
 * All financial values are previews only. The schema enforces sane ranges and
 * never normalises prices or commissions silently — conflicts (e.g. a negative
 * profit) surface as warnings in the UI, not as hidden adjustments.
 */

// Local wall-clock format shared with components/shared/DateTimePicker.
export const OFFER_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm";

// Convert a raw field value into a finite number, or undefined when blank. This
// lets optional numerics (stock quantity on unlimited inventory) be omitted
// without being rejected by the `int`/`nonnegative` checks.
function toFiniteNumberOrUndefined(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function createOperatorOfferSchema(t: ValidationTranslator) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, { message: t("offerTitleRequired") })
        .max(150, { message: t("offerTitleMax") }),
      description: z
        .string()
        .max(2000, { message: t("offerDescriptionMax") })
        .optional()
        .default(""),
      operatorIds: z
        .array(z.string())
        .min(1, { message: t("offerOperatorsRequired") }),
      offerType: z.enum(OFFER_TYPES, { message: t("offerTypeRequired") }),
      amount: z.coerce
        .number({ message: t("offerAmountRequired") })
        .int({ message: t("offerAmountInteger") })
        .positive({ message: t("offerAmountPositive") }),
      amountUnit: z.enum(AMOUNT_UNITS, { message: t("offerUnitRequired") }),
      validityValue: z.coerce
        .number({ message: t("offerValidityRequired") })
        .int({ message: t("offerValidityInteger") })
        .positive({ message: t("offerValidityPositive") }),
      validityUnit: z.enum(VALIDITY_UNITS, {
        message: t("offerUnitRequired"),
      }),
      regularPrice: z.coerce
        .number({ message: t("offerRegularPriceRequired") })
        .nonnegative({ message: t("offerPriceNonNegative") }),
      discountType: z.enum(DISCOUNT_TYPES, {
        message: t("offerDiscountTypeRequired"),
      }),
      discountValue: z.coerce
        .number({ message: t("offerDiscountValueRequired") })
        .nonnegative({ message: t("offerValueNonNegative") })
        .default(0),
      companyPurchaseCost: z.coerce
        .number({ message: t("offerCompanyCostRequired") })
        .nonnegative({ message: t("offerPriceNonNegative") }),
      resellerCommissionType: z.enum(COMMISSION_TYPES, {
        message: t("offerCommissionTypeRequired"),
      }),
      resellerCommissionValue: z.coerce
        .number({ message: t("offerCommissionRequired") })
        .nonnegative({ message: t("offerValueNonNegative") }),
      agentCommissionType: z.enum(COMMISSION_TYPES, {
        message: t("offerCommissionTypeRequired"),
      }),
      agentCommissionValue: z.coerce
        .number({ message: t("offerCommissionRequired") })
        .nonnegative({ message: t("offerValueNonNegative") }),
      inventoryMode: z.enum(INVENTORY_MODES, {
        message: t("offerInventoryModeRequired"),
      }),
      stockQuantity: z.preprocess(
        toFiniteNumberOrUndefined,
        z
          .number({ message: t("offerStockInteger") })
          .int({ message: t("offerStockInteger") })
          .nonnegative({ message: t("offerStockNonNegative") })
          .optional(),
      ),
      badges: z.array(z.enum(OFFER_BADGES)).default([]),
      startsAt: z.string().min(1, { message: t("offerStartRequired") }),
      endsAt: z.string().min(1, { message: t("offerEndRequired") }),
      status: z.enum(OFFER_STATUSES),
    })
    .superRefine((data, ctx) => {
      const { sellingPrice } = calculateSellingPrice(
        data.regularPrice,
        data.discountType,
        data.discountValue,
      );

      if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
        ctx.addIssue({
          code: "custom",
          message: t("offerDiscountPercentMax"),
          path: ["discountValue"],
        });
      }

      if (
        data.discountType === "FIXED" &&
        data.discountValue > data.regularPrice
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("offerDiscountExceedsPrice"),
          path: ["discountValue"],
        });
      }

      if (
        data.resellerCommissionType === "PERCENTAGE" &&
        data.resellerCommissionValue > 100
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("offerCommissionPercentMax"),
          path: ["resellerCommissionValue"],
        });
      }

      if (
        data.resellerCommissionType === "FIXED" &&
        data.resellerCommissionValue > sellingPrice
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("offerFixedCommissionExceedsPrice"),
          path: ["resellerCommissionValue"],
        });
      }

      if (
        data.agentCommissionType === "PERCENTAGE" &&
        data.agentCommissionValue > 100
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("offerCommissionPercentMax"),
          path: ["agentCommissionValue"],
        });
      }

      if (
        data.agentCommissionType === "FIXED" &&
        data.agentCommissionValue > sellingPrice
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("offerFixedCommissionExceedsPrice"),
          path: ["agentCommissionValue"],
        });
      }

      if (data.inventoryMode === "LIMITED" && data.stockQuantity === undefined) {
        ctx.addIssue({
          code: "custom",
          message: t("offerStockRequiredForLimited"),
          path: ["stockQuantity"],
        });
      }

      const start = parse(data.startsAt, OFFER_DATETIME_FORMAT, new Date());
      const end = parse(data.endsAt, OFFER_DATETIME_FORMAT, new Date());

      if (!isValid(start)) {
        ctx.addIssue({
          code: "custom",
          message: t("offerStartInvalid"),
          path: ["startsAt"],
        });
      }

      if (!isValid(end)) {
        ctx.addIssue({
          code: "custom",
          message: t("offerEndInvalid"),
          path: ["endsAt"],
        });
      }

      if (isValid(start) && isValid(end) && end.getTime() <= start.getTime()) {
        ctx.addIssue({
          code: "custom",
          message: t("offerEndBeforeStart"),
          path: ["endsAt"],
        });
      }
    });
}

export type OperatorOfferFormValues = z.infer<ReturnType<typeof createOperatorOfferSchema>>;
