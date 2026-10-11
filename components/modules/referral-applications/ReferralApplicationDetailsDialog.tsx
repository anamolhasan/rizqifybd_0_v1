"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PROMOTION_METHOD_LABELS,
  REFERRAL_STATUS_LABELS,
} from "./referral-application.constants";
import type { IReferralApplication } from "@/types/referral.types";

interface ReferralApplicationDetailsDialogProps {
  application: IReferralApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm break-words">{children}</dd>
    </div>
  );
}

export function ReferralApplicationDetailsDialog({
  application,
  open,
  onOpenChange,
}: ReferralApplicationDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Referral application</DialogTitle>
          <DialogDescription>
            Submitted details and review history.
          </DialogDescription>
        </DialogHeader>

        {application ? (
          <dl className="max-h-[60vh] divide-y overflow-y-auto">
            <DetailRow label="Applicant">
              {application.appUser?.authUser?.name ?? "—"}
            </DetailRow>
            <DetailRow label="Email">
              {application.appUser?.authUser?.email ?? "—"}
            </DetailRow>
            <DetailRow label="Status">
              <StatusBadgeCell
                status={application.status}
                label={REFERRAL_STATUS_LABELS[application.status]}
              />
            </DetailRow>
            <DetailRow label="Promotion method">
              {application.promotionMethod
                ? PROMOTION_METHOD_LABELS[application.promotionMethod]
                : "—"}
            </DetailRow>
            <DetailRow label="Promotion URL">
              {application.promotionUrl ? (
                <a
                  href={application.promotionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                >
                  {application.promotionUrl}
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="Reason">
              {application.reason ?? "—"}
            </DetailRow>
            <DetailRow label="Terms accepted">
              {application.termsAccepted ? "Yes" : "No"}
            </DetailRow>
            <DetailRow label="Applied at">
              <DateCell value={application.appliedAt} withTime />
            </DetailRow>
            <DetailRow label="Reviewed by">
              {application.reviewedBy?.name ?? "—"}
            </DetailRow>
            <DetailRow label="Reviewed at">
              <DateCell value={application.reviewedAt} withTime />
            </DetailRow>
            {application.status === "REJECTED" ? (
              <DetailRow label="Rejection reason">
                {application.rejectionReason ?? "—"}
              </DetailRow>
            ) : null}
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
