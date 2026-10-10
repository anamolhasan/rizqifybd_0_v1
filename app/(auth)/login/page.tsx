import type { Metadata } from "next";

import { LoginForm } from "@/components/shared/forms/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your RizqifyBD account.",
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectPath =
    typeof params.redirect === "string" ? params.redirect : undefined;

  return <LoginForm redirectPath={redirectPath} />;
}
