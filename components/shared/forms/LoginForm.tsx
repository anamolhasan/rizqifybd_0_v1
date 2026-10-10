"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginFormInputs } from "@/lib/validations";

interface LoginFormProps {
  redirectPath?: string;
}

export function LoginForm({ redirectPath }: LoginFormProps) {
  const login = useLogin(redirectPath);
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormInputs) => {
    login.mutate(values);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          স্বাগতম!
        </h1>
        <p className="text-sm text-muted-foreground">
          আপনার অ্যাকাউন্টে লগ ইন করে সেবা ব্যবহার করুন।
        </p>
      </div>

      {login.isError && (
        <Alert variant="destructive" className="animate-in fade-in">
          <AlertCircle />
          <AlertDescription>{login.error?.message}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">
              <Mail className="size-4 text-muted-foreground" />
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11"
              aria-invalid={Boolean(errors.email)}
              disabled={login.isPending}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="password">
              <Lock className="size-4 text-muted-foreground" />
              Password
            </FieldLabel>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11"
              aria-invalid={Boolean(errors.password)}
              disabled={login.isPending}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="remember"
            className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
          >
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(value) => setRemember(value === true)}
            />
            মনে রাখুন
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={login.isPending}
          className="h-11 w-full bg-sky-500 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          {login.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              সাইন ইন হচ্ছে...
            </>
          ) : (
            <>
              সাইন ইন
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          নতুন অ্যাকাউন্ট খুলুন
        </Link>
      </p>
    </div>
  );
}
