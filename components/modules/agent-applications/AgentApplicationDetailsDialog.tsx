"use client";

import type { ReactNode } from "react";

import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IAgentApplication } from "@/types/agentApplication.types";
import { useTranslations } from "next-intl";

interface AgentApplicationDetailsDialogProps {
  application: IAgentApplication | null;
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

export function AgentApplicationDetailsDialog({
  application,
  open,
  onOpenChange,
}: AgentApplicationDetailsDialogProps) {
  const t = useTranslations("admin.agentApplications.details");
  const tc = useTranslations("common");
  const te = useTranslations("enums");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {application ? (
          <dl className="max-h-[60vh] divide-y overflow-y-auto">
            <DetailRow label={t("applicant")}>
              {application.appUser?.authUser?.name ?? tc("notProvided")}
            </DetailRow>
            <DetailRow label={t("email")}>
              {application.appUser?.authUser?.email ?? tc("notProvided")}
            </DetailRow>
            <DetailRow label={t("status")}>
              <StatusBadgeCell
                status={application.status}
                label={te(`applicationStatus.${application.status}`)}
              />
            </DetailRow>
            <DetailRow label={t("reason")}>
              {application.reason ?? tc("notProvided")}
            </DetailRow>
            <DetailRow label={t("appliedAt")}>
              <DateCell value={application.appliedAt} withTime />
            </DetailRow>
            <DetailRow label={t("reviewedBy")}>
              {application.reviewedBy?.name ?? tc("notProvided")}
            </DetailRow>
            <DetailRow label={t("reviewedAt")}>
              <DateCell value={application.reviewedAt} withTime />
            </DetailRow>
            {application.status === "REJECTED" ? (
              <DetailRow label={t("rejectionReason")}>
                {application.rejectionReason ?? tc("notProvided")}
              </DetailRow>
            ) : null}
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
