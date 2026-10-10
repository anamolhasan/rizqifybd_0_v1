import type { Metadata } from "next";

import { RegisterForm } from "@/components/shared/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a new RizqifyBD account.",
};

interface SignUpPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const redirectPath =
    typeof params.redirect === "string" ? params.redirect : undefined;

  return <RegisterForm redirectPath={redirectPath} />;
}
