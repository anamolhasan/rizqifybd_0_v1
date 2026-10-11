import type { Metadata } from "next";

import { RegisterForm } from "@/components/shared/forms/RegisterForm";
import { referralService } from "@/services/services";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a new RizqifyBD account.",
};

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