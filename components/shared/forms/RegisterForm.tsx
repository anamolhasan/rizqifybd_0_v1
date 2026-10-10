"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

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
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useRegister } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormInputs } from "@/lib/validations";

interface RegisterFormProps {
  redirectPath?: string;
}

export function RegisterForm({ redirectPath }: RegisterFormProps) {
  const signup = useRegister(redirectPath);
  const [agreed, setAgreed] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: standardSchemaResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = (values: RegisterFormInputs) => {
    if (!agreed) return;
    signup.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm text-muted-foreground">
          মাত্র এক ধাপে RizqifyBD পরিবারে যোগ দিন।
        </p>
      </div>

      {signup.isError && (
        <Alert variant="destructive" className="animate-in fade-in">
          <AlertCircle />
          <AlertDescription>{signup.error?.message}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="name">
              <User className="size-4 text-muted-foreground" />
              Full Name
            </FieldLabel>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="h-11"
              aria-invalid={Boolean(errors.name)}
              disabled={signup.isPending}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

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
              disabled={signup.isPending}
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
              autoComplete="new-password"
              placeholder="••••••••"
              className="h-11"
              aria-invalid={Boolean(errors.password)}
              disabled={signup.isPending}
              {...register("password")}
            />
            <PasswordStrength password={password ?? ""} />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field data-invalid={Boolean(errors.confirmPassword)}>
            <FieldLabel htmlFor="confirmPassword">
              <Lock className="size-4 text-muted-foreground" />
              Confirm Password
            </FieldLabel>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              className="h-11"
              aria-invalid={Boolean(errors.confirmPassword)}
              disabled={signup.isPending}
              {...register("confirmPassword")}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>
        </FieldGroup>

        <label
          htmlFor="terms"
          className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground"
        >
          <Checkbox
            id="terms"
            className="mt-0.5"
            checked={agreed}
            onCheckedChange={(value) => setAgreed(value === true)}
          />
          <span>
            আমি{" "}
            <Link href="/terms" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
              শর্তাবলী
            </Link>{" "}
            ও{" "}
            <Link href="/privacy" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
              গোপনীয়তা নীতি
            </Link>{" "}
            সম্মত আছি।
          </span>
        </label>

        <Button
          type="submit"
          disabled={signup.isPending || !agreed}
          className="h-11 w-full bg-sky-500 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          {signup.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              অ্যাকাউন্ট তৈরি হচ্ছে...
            </>
          ) : (
            <>
              অ্যাকাউন্ট তৈরি করুন
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/login"
          className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  );
}
