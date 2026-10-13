"use client";

import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface AppSubmitButtonProps extends ComponentProps<typeof Button> {
  isSubmitting?: boolean;
  submittingText?: string;
}

export function AppSubmitButton({
  isSubmitting = false,
  submittingText,
  children,
  disabled,
  ...props
}: AppSubmitButtonProps) {
  const t = useTranslations("common");
  const text = submittingText ?? t("saving");

  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin" />
          {text}
        </>
      ) : (
        children
      )}
    </Button>
  );
}