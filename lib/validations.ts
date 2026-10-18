import { z } from "zod";

/**
 * Minimal translator shape required by the schema factories below. A
 * next-intl `t` from `useTranslations("validation")` satisfies it directly.
 * Messages carry no placeholder values, so only the key parameter is needed.
 */
export type ValidationTranslator = (key: string) => string;

export function createLoginSchema(t: ValidationTranslator) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("invalidEmail") }),
    password: z
      .string()
      .min(1, { message: t("passwordRequired") })
      .min(6, { message: t("passwordMin") }),
  });
}

export type LoginFormInputs = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(t: ValidationTranslator) {
  return z
    .object({
      name: z
        .string()
        .min(1, { message: t("nameRequired") })
        .min(2, { message: t("nameMin") }),
      email: z
        .string()
        .min(1, { message: t("emailRequired") })
        .email({ message: t("invalidEmail") }),
      password: z
        .string()
        .min(1, { message: t("passwordRequired") })
        .min(6, { message: t("passwordMin") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("confirmPasswordRequired") }),
      // Mirrors the backend rule (auth.validation.ts registerAppUserZodSchema): a
      // referral code is optional, alphanumeric, at most 32 chars. It is never
      // trusted as-is — the backend resolves and validates it on registration.
      referralCode: z
        .string()
        .trim()
        .max(32, { message: t("referralCodeMax") })
        .regex(/^[A-Za-z0-9]+$/, { message: t("referralCodeInvalid") })
        .optional()
        .or(z.literal("")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

export type RegisterFormInputs = z.infer<ReturnType<typeof createRegisterSchema>>;

// Mirrors the backend password rule (min 6 characters — see auth.validation.ts
// registerAppUserZodSchema / user.validation.ts createStaffUserZodSchema). No
// extra complexity policy is enforced by the backend, so none is invented here.
export function createChangePasswordSchema(t: ValidationTranslator) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: t("currentPasswordRequired") }),
      newPassword: z
        .string()
        .min(1, { message: t("newPasswordRequired") })
        .min(6, { message: t("passwordMin") }),
      confirmNewPassword: z
        .string()
        .min(1, { message: t("confirmNewPasswordRequired") }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmNewPassword"],
    });
}

export type ChangePasswordFormInputs = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;

// Mirrors the backend allow-list for self-service profile updates
// (see auth.validation.ts -> updateProfileZodSchema). Role, status, balance and
// other privileged fields are intentionally absent and cannot be set here.
export function createProfileEditSchema(t: ValidationTranslator) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t("nameRequired") })
      .max(100, { message: t("nameMax") }),
    phone: z.string().trim().max(30, { message: t("phoneMax") }).optional(),
    contactNumber: z
      .string()
      .trim()
      .max(30, { message: t("contactNumberMax") })
      .optional(),
    address: z
      .string()
      .trim()
      .max(255, { message: t("addressMax") })
      .optional(),
    country: z
      .string()
      .trim()
      .max(100, { message: t("countryMax") })
      .optional(),
    profilePhoto: z
      .union([
        z.literal(""),
        z.string().url({ message: t("profilePhotoUrl") }),
      ])
      .optional(),
  });
}

export type ProfileFormValues = z.infer<
  ReturnType<typeof createProfileEditSchema>
>;

export function createAgentApplicationSchema(t: ValidationTranslator) {
  return z.object({
    reason: z
      .string()
      .trim()
      .min(10, { message: t("agentReasonMin") })
      .max(2000, { message: t("agentReasonMax") }),
  });
}

export type AgentApplicationFormValues = z.infer<
  ReturnType<typeof createAgentApplicationSchema>
>;

export function createAffiliateApplicationSchema(t: ValidationTranslator) {
  return z.object({
    reason: z
      .string()
      .trim()
      .min(10, { message: t("affiliateReasonMin") })
      .max(2000, { message: t("affiliateReasonMax") }),
  });
}

export type AffiliateApplicationFormValues = z.infer<
  ReturnType<typeof createAffiliateApplicationSchema>
>;

export function createReferralApplicationSchema(t: ValidationTranslator) {
  return z.object({
    promotionMethod: z.string().min(1, { message: t("promotionMethodRequired") }),
    promotionUrl: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        { message: t("promotionUrlInvalid") },
      ),
    reason: z
      .string()
      .trim()
      .min(10, { message: t("referralReasonMin") })
      .max(1000, { message: t("referralReasonMax") }),
    acceptedTerms: z
      .boolean()
      .refine((value) => value === true, { message: t("termsAccepted") }),
  });
}

export type ReferralApplicationFormValues = z.infer<
  ReturnType<typeof createReferralApplicationSchema>
>;
