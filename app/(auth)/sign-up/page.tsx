import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/components/shared/forms/RegisterForm";
import { referralService } from "@/services/services";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.signUp");
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface SignUpPageProps {
  searchParams: Promise<{ redirect?: string; ref?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const redirectPath =
    typeof params.redirect === "string" ? params.redirect : undefined;
  const referralCode =
    typeof params.ref === "string" && params.ref.trim().length > 0
      ? params.ref.trim()
      : undefined;

  let defaultReferralCode: string | undefined;
  if (!referralCode) {
    try {
      const { data } = await referralService.getDefaultReferralCode();
      defaultReferralCode = data.referralCode ?? undefined;
    } catch {
      defaultReferralCode = undefined;
    }
  }

  return (
    <RegisterForm
      redirectPath={redirectPath}
      referralCode={referralCode ?? defaultReferralCode}
    />
  );
}