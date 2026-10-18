"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

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
  useAgentApplications,
  useAgentApplicationStats,
} from "@/hooks/use-agent-applications";
import { getAgentApplicationColumns } from "./AgentApplicationColumns";
import { AgentApplicationDetailsDialog } from "./AgentApplicationDetailsDialog";
import {
  AgentApplicationReviewDialog,
  type AgentReviewAction,
} from "./AgentApplicationReviewDialog";
import { AGENT_STATUS_FILTER_OPTIONS } from "./agent-application.constants";
import type { AgentApplicationStatus } from "@/types/enums";
import type {
  IAgentApplication,
  IAgentApplicationListParams,
} from "@/types/agentApplication.types";

export function AgentApplicationsManagement() {
  const t = useTranslations("admin.agentApplications");
  const tc = useTranslations("common");
  const te = useTranslations("enums");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<AgentApplicationStatus | "ALL">("ALL");

  const [selected, setSelected] = useState<IAgentApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [review, setReview] = useState<{
    application: IAgentApplication;
    action: AgentReviewAction;
  } | null>(null);
  const [reviewReason, setReviewReason] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<IAgentApplicationListParams>(
    () => ({
      page,
      limit,
      ...(searchTerm ? { searchTerm } : {}),
      ...(status !== "ALL" ? { status } : {}),
    }),
    [page, limit, searchTerm, status],
  );

  const { data, isLoading, isError, error, refetch } =
    useAgentApplications(params);
  const stats = useAgentApplicationStats();

  const columns = useMemo(
    () =>
      getAgentApplicationColumns({
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
        labels: {
          applicant: t("columns.applicant"),
          email: t("columns.email"),
          status: t("columns.status"),
          createdAt: t("columns.createdAt"),
          reviewedBy: t("columns.reviewedBy"),
          actions: t("columns.actions"),
          view: t("rowActions.view"),
          approve: t("rowActions.approve"),
          reject: t("rowActions.reject"),
          notProvided: tc("notProvided"),
          statusLabels: {
            PENDING: te("applicationStatus.PENDING"),
            APPROVED: te("applicationStatus.APPROVED"),
            REJECTED: te("applicationStatus.REJECTED"),
          },
        },
      }),
    [t, tc, te],
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
      <PageHeader title={t("title")} description={t("description")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("stats.total")}
          value={statValue(statsValue?.total)}
          iconName="agents"
        />
        <StatsCard
          title={t("stats.pending")}
          value={statValue(statsValue?.pending)}
          iconName="activity"
        />
        <StatsCard
          title={t("stats.approved")}
          value={statValue(statsValue?.approved)}
          iconName="award"
        />
        <StatsCard
          title={t("stats.rejected")}
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
          placeholder={t("searchPlaceholder")}
        />

        <DataTableFilters hasFilters={hasFilters} onClear={clearFilters}>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as AgentApplicationStatus | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder={t("filters.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {AGENT_STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.value === "ALL"
                    ? t("filters.allStatuses")
                    : te(`applicationStatus.${option.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DataTableFilters>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("errorTitle")}</AlertTitle>
          <AlertDescription>{error?.message ?? tc("error")}</AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCcw />
              {tc("retry")}
            </Button>
          </AlertAction>
        </Alert>
      ) : (
        <DataTable
          table={table}
          isLoading={isLoading}
          emptyStateMessage={t("empty")}
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

      <AgentApplicationDetailsDialog
        application={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <AgentApplicationReviewDialog
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
