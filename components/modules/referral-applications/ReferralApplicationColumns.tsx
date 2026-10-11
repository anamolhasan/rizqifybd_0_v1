"use client";

import { Check, Eye, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Button } from "@/components/ui/button";
import {
  PROMOTION_METHOD_LABELS,
  REFERRAL_STATUS_LABELS,
} from "./referral-application.constants";
import type { IReferralApplication } from "@/types/referral.types";

interface ReferralApplicationColumnActions {
  onView: (application: IReferralApplication) => void;
  onApprove: (application: IReferralApplication) => void;
  onReject: (application: IReferralApplication) => void;
}

export function getReferralApplicationColumns({
  onView,
  onApprove,
  onReject,
}: ReferralApplicationColumnActions): ColumnDef<
  IReferralApplication,
  unknown
>[] {
  return [
    {
      id: "applicant",
      header: "Applicant",
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
      header: "Status",
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.status}
          label={REFERRAL_STATUS_LABELS[row.original.status]}
        />
      ),
    },
    {
      id: "promotionMethod",
      header: "Promotion",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.promotionMethod
            ? PROMOTION_METHOD_LABELS[row.original.promotionMethod]
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "appliedAt",
      header: "Applied",
      cell: ({ row }) => <DateCell value={row.original.appliedAt} withTime />,
    },
    {
      id: "reviewedBy",
      header: "Reviewed by",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.reviewedBy?.name ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">Actions</span>,
      cell: ({ row }) => {
        const application = row.original;
        const isPending = application.status === "PENDING";

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="View application details"
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
                  aria-label="Approve application"
                  onClick={() => onApprove(application)}
                >
                  <Check />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  aria-label="Reject application"
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
