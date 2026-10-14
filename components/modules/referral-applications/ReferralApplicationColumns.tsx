"use client";

import { Check, Eye, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Button } from "@/components/ui/button";
import type { IReferralApplication } from "@/types/referral.types";

interface ReferralApplicationColumnActions {
  onView: (application: IReferralApplication) => void;
  onApprove: (application: IReferralApplication) => void;
  onReject: (application: IReferralApplication) => void;
}

export interface ReferralApplicationColumnLabels {
  applicant: string;
  email: string;
  phone: string;
  method: string;
  amount: string;
  status: string;
  createdAt: string;
  reviewedBy: string;
  actions: string;
  view: string;
  approve: string;
  reject: string;
  notProvided: string;
  yes: string;
  no: string;
  statusLabels: Record<string, string>;
}

export function getReferralApplicationColumns({
  onView,
  onApprove,
  onReject,
  labels,
}: ReferralApplicationColumnActions & {
  labels: ReferralApplicationColumnLabels;
}): ColumnDef<IReferralApplication, unknown>[] {
  return [
    {
      id: "applicant",
      header: labels.applicant,
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.appUser?.authUser?.name}
          email={row.original.appUser?.authUser?.email}
          image={row.original.appUser?.profilePhoto}
        />
      ),
    },
    {
      accessorKey: "status",
      header: labels.status,
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.status}
          label={labels.statusLabels[row.original.status] ?? row.original.status}
        />
      ),
    },
    {
      id: "promotionMethod",
      header: labels.method,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.promotionMethod ?? labels.notProvided}
        </span>
      ),
    },
    {
      accessorKey: "appliedAt",
      header: labels.createdAt,
      cell: ({ row }) => <DateCell value={row.original.appliedAt} withTime />,
    },
    {
      id: "reviewedBy",
      header: labels.reviewedBy,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.reviewedBy?.name ?? labels.notProvided}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">{labels.actions}</span>,
      cell: ({ row }) => {
        const application = row.original;
        const isPending = application.status === "PENDING";

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={labels.view}
              onClick={() => onView(application)}
            >
              <Eye />
            </Button>

            {isPending ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-emerald-600 hover:text-emerald-600"
                  aria-label={labels.approve}
                  onClick={() => onApprove(application)}
                >
                  <Check />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  aria-label={labels.reject}
                  onClick={() => onReject(application)}
                >
                  <X />
                </Button>
              </>
            ) : null}
          </div>
        );
      },
    },
  ];
}