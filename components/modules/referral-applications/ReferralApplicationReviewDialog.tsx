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
import { useReviewReferralApplication } from "@/hooks/use-referral-applications";
import type { IReferralApplication } from "@/types/referral.types";

export type ReferralReviewAction = "APPROVE" | "REJECT";

interface ReferralApplicationReviewDialogProps {
  application: IReferralApplication | null;
  action: ReferralReviewAction | null;
  open: boolean;
  reason: string;
  onReasonChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function ReferralApplicationReviewDialog({
  application,
  action,
  open,
  reason,
  onReasonChange,
  onOpenChange,
}: ReferralApplicationReviewDialogProps) {
  const { mutateAsync, isPending, error, reset } = useReviewReferralApplication();

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
            {isReject ? "Reject application" : "Approve application"}
          </DialogTitle>
          <DialogDescription>
            {isReject
              ? "Provide a reason for rejecting this referral application."
              : "Approving makes the applicant eligible to earn referral income."}
          </DialogDescription>
        </DialogHeader>

        {isReject ? (
          <div className="space-y-2">
            <Label htmlFor="referral-rejection-reason">Rejection reason</Label>
            <Textarea
              id="referral-rejection-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Explain why this application is being rejected..."
              rows={4}
              disabled={isPending}
            />
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
            Cancel
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
                Submitting...
              </>
            ) : isReject ? (
              "Reject"
            ) : (
              "Approve"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
