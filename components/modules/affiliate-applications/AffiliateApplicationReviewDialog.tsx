"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReviewAffiliateApplication } from "@/hooks/use-affiliate-applications";
import type { IAffiliateApplication } from "@/types/affiliateApplication.types";
import { useTranslations } from "next-intl";

export type AffiliateReviewAction = "APPROVE" | "REJECT";

interface AffiliateApplicationReviewDialogProps {
  application: IAffiliateApplication | null;
  action: AffiliateReviewAction | null;
  open: boolean;
  reason: string;
  onReasonChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function AffiliateApplicationReviewDialog({
  application,
  action,
  open,
  reason,
  onReasonChange,
  onOpenChange,
}: AffiliateApplicationReviewDialogProps) {
  const t = useTranslations("admin.affiliateApplications.review");
  const { mutateAsync, isPending, error, reset } =
    useReviewAffiliateApplication();

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const isReject = action === "REJECT";
  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;
  const reasonInvalid = isReject && reason.trim().length === 0;

  const handleSubmit = async () => {
    if (!application || !action || isPending || reasonInvalid) return;

    try {
      await mutateAsync({
        id: application.id,
        payload: isReject
          ? { status: "REJECTED", rejectionReason: reason.trim() }
          : { status: "APPROVED" },
      });
      onOpenChange(false);
    } catch {
      // Failure is surfaced via toast and the inline alert below.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReject ? t("rejectTitle") : t("approveTitle")}
          </DialogTitle>
          <DialogDescription>
            {isReject ? t("rejectDescription") : t("approveDescription")}
          </DialogDescription>
        </DialogHeader>

        {isReject ? (
          <div className="space-y-2">
            <Label htmlFor="affiliate-rejection-reason">{t("reason")}</Label>
            <Textarea
              id="affiliate-rejection-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder={t("reasonPlaceholder")}
              rows={4}
              disabled={isPending}
            />
            {reasonInvalid ? (
              <p className="text-sm text-destructive">{t("reasonRequired")}</p>
            ) : null}
          </div>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant={isReject ? "destructive" : "default"}
            disabled={isPending || reasonInvalid}
            onClick={() => void handleSubmit()}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
