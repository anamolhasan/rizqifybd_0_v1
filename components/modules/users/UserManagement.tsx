"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertCircle,
  Lock,
  Plus,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/table/DataTable";
import { DataTableFilters } from "@/components/shared/table/DataTableFilters";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import { DataTablePaginationSkeleton } from "@/components/shared/table/DataTablePaginationSkeleton";
import { DataTableSearch } from "@/components/shared/table/DataTableSearch";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/use-auth";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useUsers, useUserStats } from "@/hooks/use-users";
import type { Role, UserStatus } from "@/types/enums";
import type { IUser } from "@/types/user.types";
import { ChangeRoleDialog } from "./ChangeRoleDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { RestoreUserDialog } from "./RestoreUserDialog";
import { StaffCreateDialog } from "./StaffCreateDialog";
import { UserDetailsDrawer } from "./UserDetailsDrawer";
import { UserEditDialog } from "./UserEditDialog";
import { UserStatusDialog } from "./UserStatusDialog";
import { getUserColumns } from "./UserColumns";
import {
  canCreateStaffAccounts,
  getRoleLabel,
  getStatusLabel,
  SUPPORTED_ROLES,
  USER_STATUS_LABEL_KEYS,
  type UserStatusAction,
} from "./user.constants";

const ALL_ROLE_TAB = "ALL";
const ALL_STATUS = "ALL";
const STATUS_FILTER_OPTIONS = Object.keys(
  USER_STATUS_LABEL_KEYS,
) as UserStatus[];

type DeletedFilter = "active" | "deleted";

type StaffPermissionActor =
  | "superAdmin"
  | "admin"
  | "moderator"
  | "supporter"
  | "publicSignup";

interface StaffPermissionRule {
  actor: StaffPermissionActor;
  canCreate: Role[];
  blocked: Role[] | "all";
  note?: boolean;
}

// Mirrors the backend RBAC rules (src/app/constants/rbac.constant.ts). The
// backend enforces these on every request.
const STAFF_PERMISSION_RULES: StaffPermissionRule[] = [
  {
    actor: "superAdmin",
    canCreate: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORTER"],
    blocked: [],
  },
  {
    actor: "admin",
    canCreate: ["ADMIN", "MODERATOR", "SUPPORTER"],
    blocked: ["SUPER_ADMIN"],
  },
  {
    actor: "moderator",
    canCreate: [],
    blocked: "all",
  },
  {
    actor: "supporter",
    canCreate: [],
    blocked: "all",
  },
  {
    actor: "publicSignup",
    canCreate: ["USER"],
    blocked: [],
    note: true,
  },
];

export function UserManagement() {
  const t = useTranslations("admin.users");
  const tc = useTranslations("common");
  const te = useTranslations("enums");
  const tColumns = useTranslations("admin.users.columns");
  const { data: currentUser } = useCurrentUser();
  const actorRole = currentUser?.role as Role | undefined;
  const currentUserId = currentUser?.id;
  const canCreate = canCreateStaffAccounts(actorRole);
  const canManageRoleAccess = actorRole === "SUPER_ADMIN";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleTab, setRoleTab] = useState<string>(ALL_ROLE_TAB);
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("active");

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<UserStatusAction | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const {
    searchTerm: searchInput,
    handleSearchInputChange,
    clearSearch,
  } = useServerManagedDataTableSearch({ onSearch: handleSearch });

  const { data: stats, isLoading: isStatsLoading } = useUserStats();

  const { data, isLoading, isFetching, isError, error, refetch } = useUsers({
    page,
    limit,
    searchTerm,
    role: roleTab === ALL_ROLE_TAB ? undefined : (roleTab as Role),
    status: statusFilter === ALL_STATUS ? undefined : (statusFilter as UserStatus),
    isDeleted: deletedFilter === "deleted",
  });

  const hasActiveFilters =
    statusFilter !== ALL_STATUS || deletedFilter !== "active" || Boolean(searchTerm);

  const clearFilters = useCallback(() => {
    setStatusFilter(ALL_STATUS);
    setDeletedFilter("active");
    setRoleTab(ALL_ROLE_TAB);
    setSearchTerm("");
    setPage(1);
    clearSearch();
  }, [clearSearch]);

  const columns = useMemo(
    () =>
      getUserColumns({
        actorRole,
        currentUserId,
        t: tColumns,
        onView: (user) => {
          setSelectedUser(user);
          setDetailsOpen(true);
        },
        onEdit: (user) => {
          setSelectedUser(user);
          setEditOpen(true);
        },
        onChangeRole: (user) => {
          setSelectedUser(user);
          setRoleOpen(true);
        },
        onStatusChange: (user, action) => {
          setSelectedUser(user);
          setStatusAction(action);
          setStatusOpen(true);
        },
        onDelete: (user) => {
          setSelectedUser(user);
          setDeleteOpen(true);
        },
        onRestore: (user) => {
          setSelectedUser(user);
          setRestoreOpen(true);
        },
      }),
    [actorRole, currentUserId, tColumns],
  );

  const rows = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? null;

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { refetch },
  });

  const openCreateDialog = () => {
    setSelectedUser(null);
    setCreateOpen(true);
  };

  const handlePageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleRoleTabChange = (value: string) => {
    setRoleTab(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")}>
        {canManageRoleAccess ? (
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/users-management/role-access">
              <ShieldCheck />
              {t("roleAccessLink")}
            </Link>
          </Button>
        ) : null}
        {canCreate ? (
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={openCreateDialog}
          >
            <Plus />
            {t("createStaff")}
          </Button>
        ) : null}
      </PageHeader>

      {!canCreate ? (
        <Alert>
          <ShieldAlert />
          <AlertDescription>{t("noPermission")}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title={t("stats.totalUsers")}
          value={stats ? stats.total : "—"}
          iconName="users"
          description={t("stats.totalUsersDesc")}
          isLoading={isStatsLoading}
        />
        <StatsCard
          title={t("stats.active")}
          value={stats ? stats.active : "—"}
          iconName="shield"
          description={t("stats.activeDesc")}
          isLoading={isStatsLoading}
        />
        <StatsCard
          title={t("stats.pending")}
          value={stats ? stats.pending : "—"}
          iconName="activity"
          description={t("stats.pendingDesc")}
          isLoading={isStatsLoading}
        />
        <StatsCard
          title={t("stats.suspended")}
          value={stats ? stats.suspended : "—"}
          iconName="lock"
          description={t("stats.suspendedDesc")}
          isLoading={isStatsLoading}
        />
        <StatsCard
          title={t("stats.blocked")}
          value={stats ? stats.blocked : "—"}
          iconName="lock"
          description={t("stats.blockedDesc")}
          isLoading={isStatsLoading}
        />
        <StatsCard
          title={t("stats.deleted")}
          value={stats ? stats.deleted : "—"}
          iconName="refresh"
          description={t("stats.deletedDesc")}
          isLoading={isStatsLoading}
        />
      </div>

      <div className="space-y-4">
        <Tabs value={roleTab} onValueChange={handleRoleTabChange}>
          <div className="overflow-x-auto pb-1">
            <TabsList>
              <TabsTrigger value={ALL_ROLE_TAB}>{t("tabs.all")}</TabsTrigger>
              {SUPPORTED_ROLES.map((role) => (
                <TabsTrigger key={role} value={role}>
                  {getRoleLabel(role, te)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <DataTableSearch
          value={searchInput}
          onChange={handleSearchInputChange}
          onClear={clearSearch}
          placeholder={t("searchPlaceholder")}
        />

        <DataTableFilters hasFilters={hasActiveFilters} onClear={clearFilters}>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder={t("filters.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS}>{t("filters.allStatuses")}</SelectItem>
              {STATUS_FILTER_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status, te)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={deletedFilter}
            onValueChange={(value) => {
              setDeletedFilter(value as DeletedFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("filters.active")}</SelectItem>
              <SelectItem value="deleted">{t("filters.deleted")}</SelectItem>
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
          isRefetching={isFetching && !isLoading}
          skeletonRowCount={limit}
          emptyStateMessage={
            deletedFilter === "deleted" ? t("emptyDeleted") : t("empty")
          }
        >
          {meta ? (
            <DataTablePagination
              autoPagination={meta}
              isLoading={isFetching}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : isLoading ? (
            <DataTablePaginationSkeleton />
          ) : null}
        </DataTable>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("permissions.title")}</CardTitle>
          <CardDescription>{t("permissions.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {STAFF_PERMISSION_RULES.map((rule) => (
            <div
              key={rule.actor}
              className="flex flex-col gap-1.5 rounded-lg border bg-muted/40 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                {t(`permissions.rules.${rule.actor}.actor`)}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {rule.canCreate.length ? (
                  <span className="text-muted-foreground">
                    {t("permissions.canCreate")}
                  </span>
                ) : null}
                {rule.canCreate.map((role) => (
                  <span
                    key={role}
                    className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 font-medium text-success"
                  >
                    {getRoleLabel(role, te)}
                  </span>
                ))}
                {rule.blocked.length ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="ml-1">{t("permissions.blocked")}</span>
                    <span className="flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-0.5 font-medium text-destructive">
                      <ShieldX className="size-3" />
                      {rule.blocked === "all"
                        ? t("permissions.allStaffRoles")
                        : rule.blocked
                            .map((role) => getRoleLabel(role, te))
                            .join(", ")}
                    </span>
                  </span>
                ) : null}
                {rule.note ? (
                  <span className="text-muted-foreground">
                    {"\u2014"} {t(`permissions.rules.${rule.actor}.note`)}
                  </span>
                ) : null}
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            <span>{t("permissions.footer")}</span>
          </div>
        </CardContent>
      </Card>

      <StaffCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        actorRole={actorRole}
      />

      <UserDetailsDrawer
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <UserEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
      />

      <ChangeRoleDialog
        open={roleOpen}
        onOpenChange={setRoleOpen}
        user={selectedUser}
        actorRole={actorRole}
      />

      <UserStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        user={selectedUser}
        action={statusAction}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
      />

      <RestoreUserDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        user={selectedUser}
      />
    </div>
  );
}
