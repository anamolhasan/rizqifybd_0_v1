"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  AlertCircle,
  ArrowRight,
  Link2,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

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
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useRegister } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormInputs } from "@/lib/validations";

interface RegisterFormProps {
  redirectPath?: string;
  referralCode?: string;
}

export function RegisterForm({ redirectPath, referralCode }: RegisterFormProps) {
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
      referralCode: referralCode ?? "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = (values: RegisterFormInputs) => {
    if (!agreed) return;
    signup.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      ...(values.referralCode?.trim()
        ? { referralCode: values.referralCode.trim() }
        : {}),
    });
  };

  return (
    <Card className="glow-panel mx-auto w-full max-w-110 rounded-3xl border-[1.5px] bg-card/80 py-9 backdrop-blur">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardHeader className="px-8">
          <CardTitle className="font-heading text-3xl font-extrabold">
            অ্যাকাউন্ট তৈরি করুন
          </CardTitle>
          <CardDescription className="text-[.95rem]">
            মাত্র এক ধাপে RizqifyBD পরিবারে যোগ দিন।
          </CardDescription>
        </CardHeader>

        {signup.isError && (
          <div className="px-8 pt-6">
            <Alert variant="destructive" className="animate-in fade-in">
              <AlertCircle />
              <AlertDescription>{signup.error?.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="mt-6 space-y-5 px-8">
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="name" className="text-sm font-semibold">
                <User className="size-4 text-muted-foreground" />
                Full Name
              </FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className="h-12 rounded-xl bg-input/50"
                aria-invalid={Boolean(errors.name)}
                disabled={signup.isPending}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

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
                disabled={signup.isPending}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={Boolean(errors.referralCode)}>
              <FieldLabel
                htmlFor="referralCode"
                className="text-sm font-semibold"
              >
                <Link2 className="size-4 text-muted-foreground" />
                Referral Code{" "}
                <span className="font-normal text-muted-foreground">
                  (Optional)
                </span>
              </FieldLabel>
              <Input
                id="referralCode"
                type="text"
                autoComplete="off"
                placeholder="e.g. AB12XYZ3"
                className="h-12 rounded-xl bg-input/50"
                aria-invalid={Boolean(errors.referralCode)}
                disabled={signup.isPending}
                {...register("referralCode")}
              />
              <FieldError errors={[errors.referralCode]} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password" className="text-sm font-semibold">
                <Lock className="size-4 text-muted-foreground" />
                Password
              </FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-input/50"
                aria-invalid={Boolean(errors.password)}
                disabled={signup.isPending}
                {...register("password")}
              />
              <PasswordStrength password={password ?? ""} />
              <FieldError errors={[errors.password]} />
            </Field>

            <Field data-invalid={Boolean(errors.confirmPassword)}>
              <FieldLabel
                htmlFor="confirmPassword"
                className="text-sm font-semibold"
              >
                <Lock className="size-4 text-muted-foreground" />
                Confirm Password
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-input/50"
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
              <Link
                href="/terms"
                className="font-medium text-primary hover:underline"
              >
                শর্তাবলী
              </Link>{" "}
              ও{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary hover:underline"
              >
                গোপনীয়তা নীতি
              </Link>{" "}
              সম্মত আছি।
            </span>
          </label>
        </CardContent>

        <CardFooter className="mt-7 flex-col gap-4 rounded-none border-t-0 bg-transparent px-8">
          <Button
            type="submit"
            disabled={signup.isPending || !agreed}
            className="glow-cy h-12 w-full rounded-xl bg-linear-to-r from-neon-cy to-neon-vi font-heading text-base font-extrabold text-primary-foreground hover:opacity-90"
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
          <p className="text-center text-sm text-muted-foreground">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
