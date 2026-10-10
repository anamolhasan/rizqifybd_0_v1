import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AppSubmitButtonProps extends ComponentProps<typeof Button> {
  isSubmitting?: boolean;
  submittingText?: string;
}

export function AppSubmitButton({
  isSubmitting = false,
  submittingText = "Saving...",
  children,
  disabled,
  ...props
}: AppSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin" />
          {submittingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}