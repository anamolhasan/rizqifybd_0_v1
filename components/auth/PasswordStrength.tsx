"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const LEVELS = [
  {
    labelKey: "strength.tooShort",
    hintKey: "strength.hintTooShort",
    indicator: "[&>[data-slot=progress-indicator]]:bg-destructive",
    text: "text-destructive",
  },
  {
    labelKey: "strength.weak",
    hintKey: "strength.hintWeak",
    indicator: "[&>[data-slot=progress-indicator]]:bg-warning",
    text: "text-warning",
  },
  {
    labelKey: "strength.fair",
    hintKey: "strength.hintFair",
    indicator: "[&>[data-slot=progress-indicator]]:bg-warning",
    text: "text-warning",
  },
  {
    labelKey: "strength.good",
    hintKey: "strength.hintGood",
    indicator: "[&>[data-slot=progress-indicator]]:bg-info",
    text: "text-info",
  },
  {
    labelKey: "strength.strong",
    hintKey: "strength.hintStrong",
    indicator: "[&>[data-slot=progress-indicator]]:bg-success",
    text: "text-success",
  },
] as const;

export function scorePassword(password: string) {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(score, LEVELS.length - 1);
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const t = useTranslations("auth");
  const score = useMemo(() => scorePassword(password), [password]);

  if (!password) {
    return null;
  }

  const level = LEVELS[score];

  return (
    <div className={cn("space-y-1.5", className)}>
      <Progress value={(score / (LEVELS.length - 1)) * 100} className={cn("h-1.5", level.indicator)} />
      <p className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", level.text)}>{t(level.labelKey)}</span>
        <span className="text-muted-foreground">{t(level.hintKey)}</span>
      </p>
    </div>
  );
}
