"use client";

import { useCallback, useMemo, useState } from "react";
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
  ROLE_LABELS,
  SUPPORTED_ROLES,
  USER_STATUS_LABELS,
  type UserStatusAction,
} from "./user.constants";

const ALL_ROLE_TAB = "ALL";
const ALL_STATUS = "ALL";
const STATUS_FILTER_OPTIONS = Object.keys(USER_STATUS_LABELS) as UserStatus[];

type DeletedFilter = "active" | "deleted";

interface StaffPermissionRule {
  actor: string;
  canCreate: string[];
  blocked: string[];
  note?: string;
}

// Mirrors the backend RBAC rules (src/app/constants/rbac.constant.ts). The
// backend enforces these on every request.
const STAFF_PERMISSION_RULES: StaffPermissionRule[] = [
  {
    actor: "Super Admin",
    canCreate: ["Super Admin", "Admin", "Moderator", "Supporter"],
    blocked: [],
  },
  {
    actor: "Admin",
    canCreate: ["Admin", "Moderator", "Supporter"],
    blocked: ["Super Admin"],
  },
  {
    actor: "Moderator",
    canCreate: [],
    blocked: ["All staff roles"],
  },
  {
    actor: "Supporter",
    canCreate: [],
    blocked: ["All staff roles"],
  },
  {
    actor: "Public signup",
    canCreate: ["Customer"],
    blocked: [],
    note: "Role can never be self-assigned — registrations always create a Customer (USER) account.",
  },
];

export function UserManagement() {
  const { data: currentUser } = useCurrentUser();
  const actorRole = currentUser?.role as Role | undefined;
  const currentUserId = currentUser?.id;
  const canCreate = canCreateStaffAccounts(actorRole);

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
    [actorRole, currentUserId],
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
      <PageHeader
        title="Users Management"
        description="Manage customers, agents and staff accounts across RizqifyBD."
      >
        {canCreate ? (
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={openCreateDialog}
          >
            <Plus />
            Create Staff Account
          </Button>
        ) : null}
      </PageHeader>

      {!canCreate ? (
        <Alert>
          <ShieldAlert />
          <AlertDescription>
            Your account does not have permission to create staff accounts. Only
            Super Admin and Admin can do this. The server enforces this rule.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total users"
          value={stats ? stats.total : "—"}
          iconName="users"
          description="All non-deleted accounts"
          isLoading={isStatsLoading}
        />
        <StatsCard
          title="Active"
          value={stats ? stats.active : "—"}
          iconName="shield"
          description="Can sign in normally"
          isLoading={isStatsLoading}
        />
        <StatsCard
          title="Pending"
          value={stats ? stats.pending : "—"}
          iconName="activity"
          description="Awaiting first sign-in"
          isLoading={isStatsLoading}
        />
        <StatsCard
          title="Suspended"
          value={stats ? stats.suspended : "—"}
          iconName="lock"
          description="Temporarily restricted"
          isLoading={isStatsLoading}
        />
        <StatsCard
          title="Blocked"
          value={stats ? stats.blocked : "—"}
          iconName="lock"
          description="Access denied"
          isLoading={isStatsLoading}
        />
        <StatsCard
          title="Deleted"
          value={stats ? stats.deleted : "—"}
          iconName="refresh"
          description="Soft-deleted, restorable"
          isLoading={isStatsLoading}
        />
      </div>

      <div className="space-y-4">
        <Tabs value={roleTab} onValueChange={handleRoleTabChange}>
          <div className="overflow-x-auto pb-1">
            <TabsList>
              <TabsTrigger value={ALL_ROLE_TAB}>All users</TabsTrigger>
              {SUPPORTED_ROLES.map((role) => (
                <TabsTrigger key={role} value={role}>
                  {ROLE_LABELS[role]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <DataTableSearch
          value={searchInput}
          onChange={handleSearchInputChange}
          onClear={clearSearch}
          placeholder="Search users by name or email..."
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
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS}>All statuses</SelectItem>
              {STATUS_FILTER_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {USER_STATUS_LABELS[status]}
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
              <SelectItem value="active">Active accounts</SelectItem>
              <SelectItem value="deleted">Deleted accounts</SelectItem>
            </SelectContent>
          </Select>
        </DataTableFilters>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to load users</AlertTitle>
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
          isRefetching={isFetching && !isLoading}
          skeletonRowCount={limit}
          emptyStateMessage={
            deletedFilter === "deleted"
              ? "No deleted users found."
              : "No users found."
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
          <CardTitle>Staff creation permissions</CardTitle>
          <CardDescription>
            Who can create which staff roles, per the existing role model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {STAFF_PERMISSION_RULES.map((rule) => (
            <div
              key={rule.actor}
              className="flex flex-col gap-1.5 rounded-lg border bg-muted/40 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                {rule.actor}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {rule.canCreate.length ? (
                  <span className="text-muted-foreground">Can create:</span>
                ) : null}
                {rule.canCreate.map((role) => (
                  <span
                    key={role}
                    className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 font-medium text-success"
                  >
                    {role}
                  </span>
                ))}
                {rule.blocked.length ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="ml-1">Blocked:</span>
                    <span className="flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-0.5 font-medium text-destructive">
                      <ShieldX className="size-3" />
                      {rule.blocked.join(", ")}
                    </span>
                  </span>
                ) : null}
                {rule.note ? (
                  <span className="text-muted-foreground">{"\u2014"} {rule.note}</span>
                ) : null}
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            <span>
              The backend also permits EMPLOYEE accounts for Super Admin and
              Admin actors; this interface intentionally exposes only the four
              roles above. AGENT is not a role — approved agents keep the
              Customer (USER) role with the reseller feature flag enabled.
            </span>
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
