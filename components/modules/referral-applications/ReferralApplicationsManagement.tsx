"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircle, RefreshCcw } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/table/DataTable";
import { DataTableFilters } from "@/components/shared/table/DataTableFilters";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import { DataTableSearch } from "@/components/shared/table/DataTableSearch";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReferralApplications,
  useReferralApplicationStats,
} from "@/hooks/use-referral-applications";
import { getReferralApplicationColumns } from "./ReferralApplicationColumns";
import { ReferralApplicationDetailsDialog } from "./ReferralApplicationDetailsDialog";
import {
  ReferralApplicationReviewDialog,
  type ReferralReviewAction,
} from "./ReferralApplicationReviewDialog";
import { REFERRAL_STATUS_FILTER_OPTIONS } from "./referral-application.constants";
import type { ReferralApplicationStatus } from "@/types/enums";
import type {
  IReferralApplication,
  IReferralApplicationListParams,
} from "@/types/referral.types";

export function ReferralApplicationsManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<ReferralApplicationStatus | "ALL">(
    "ALL",
  );

  const [selected, setSelected] = useState<IReferralApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [review, setReview] = useState<{
    application: IReferralApplication;
    action: ReferralReviewAction;
  } | null>(null);
  const [reviewReason, setReviewReason] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<IReferralApplicationListParams>(
    () => ({
      page,
      limit,
      ...(searchTerm ? { searchTerm } : {}),
      ...(status !== "ALL" ? { status } : {}),
    }),
    [page, limit, searchTerm, status],
  );

  const { data, isLoading, isError, error, refetch } =
    useReferralApplications(params);
  const stats = useReferralApplicationStats();

  const columns = useMemo(
    () =>
      getReferralApplicationColumns({
        onView: (application) => {
          setSelected(application);
          setDetailsOpen(true);
        },
        onApprove: (application) => {
          setReviewReason("");
          setReview({ application, action: "APPROVE" });
        },
        onReject: (application) => {
          setReviewReason("");
          setReview({ application, action: "REJECT" });
        },
      }),
    [],
  );

  const rows = useMemo(() => data?.data ?? [], [data]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { refetch },
  });

  const hasFilters = status !== "ALL" || searchInput.length > 0;

  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStatus("ALL");
    setPage(1);
  };

  const statsValue = stats.data;
  const statValue = (value: number | undefined) =>
    stats.isLoading ? "—" : (value ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referral Applications"
        description="Review and manage user referral income applications."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total"
          value={statValue(statsValue?.total)}
          iconName="referrals"
        />
        <StatsCard
          title="Pending"
          value={statValue(statsValue?.pending)}
          iconName="activity"
        />
        <StatsCard
          title="Approved"
          value={statValue(statsValue?.approved)}
          iconName="award"
        />
        <StatsCard
          title="Rejected"
          value={statValue(statsValue?.rejected)}
          iconName="trending-down"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <DataTableSearch
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onClear={() => {
            setSearchInput("");
            setSearchTerm("");
          }}
          placeholder="Search by applicant name or email"
        />

        <DataTableFilters hasFilters={hasFilters} onClear={clearFilters}>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as ReferralApplicationStatus | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {REFERRAL_STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DataTableFilters>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to load referral applications</AlertTitle>
          <AlertDescription>
            {error?.message ?? "Something went wrong. Please try again."}
          </AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCcw />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      ) : (
        <DataTable
          table={table}
          isLoading={isLoading}
          emptyStateMessage="No referral applications found."
        >
          <DataTablePagination
            autoPagination={
              data?.meta ?? { page, limit, total: 0, totalPages: 1 }
            }
            isLoading={isLoading}
            onPageChange={setPage}
            onPageSizeChange={(nextLimit) => {
              setLimit(nextLimit);
              setPage(1);
            }}
          />
        </DataTable>
      )}

      <ReferralApplicationDetailsDialog
        application={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <ReferralApplicationReviewDialog
        application={review?.application ?? null}
        action={review?.action ?? null}
        open={review !== null}
        reason={reviewReason}
        onReasonChange={setReviewReason}
        onOpenChange={(open) => {
          if (!open) setReview(null);
        }}
      />
    </div>
  );
}
