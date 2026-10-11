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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="glow-panel mx-auto w-full max-w-110 rounded-3xl border-[1.5px] bg-card/80 py-9 backdrop-blur">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardHeader className="px-8">
          <CardTitle className="font-heading text-3xl font-extrabold">
            স্বাগতম!
          </CardTitle>
          <CardDescription className="text-[.95rem]">
            আপনার অ্যাকাউন্টে লগ ইন করে সেবা ব্যবহার করুন।
          </CardDescription>
        </CardHeader>

        {login.isError && (
          <div className="px-8 pt-6">
            <Alert variant="destructive" className="animate-in fade-in">
              <AlertCircle />
              <AlertDescription>{login.error?.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="mt-6 space-y-5 px-8">
          <FieldGroup>
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="email" className="text-sm font-semibold">
                <Mail className="size-4 text-muted-foreground" />
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-12 rounded-xl bg-input/50"
                aria-invalid={Boolean(errors.email)}
                disabled={login.isPending}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password" className="text-sm font-semibold">
                <Lock className="size-4 text-muted-foreground" />
                Password
              </FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-input/50"
                aria-invalid={Boolean(errors.password)}
                disabled={login.isPending}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label
              htmlFor="remember"
              className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground"
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
              className="font-semibold text-primary hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="mt-7 flex-col gap-4 rounded-none border-t-0 bg-transparent px-8">
          <Button
            type="submit"
            disabled={login.isPending}
            className="glow-cy h-12 w-full rounded-xl bg-linear-to-r from-neon-cy to-neon-vi font-heading text-base font-extrabold text-primary-foreground hover:opacity-90"
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
          <p className="text-sm text-muted-foreground">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-primary hover:underline"
            >
              নতুন অ্যাকাউন্ট খুলুন
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
