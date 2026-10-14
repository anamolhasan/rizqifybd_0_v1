"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DateCell } from "@/components/shared/cell/DateCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { DataTableColumnsHeader } from "@/components/shared/table/DataTableColumnsHeader";
import { formatBDT } from "@/lib/format";
import type { Role } from "@/types/enums";
import type { IUser } from "@/types/user.types";
import { RoleBadge } from "./RoleBadge";
import { UserRowActions } from "./UserRowActions";
import { UserStatusBadge } from "./UserStatusBadge";
import { VerificationBadge } from "./VerificationBadge";
import type { UserStatusAction } from "./user.constants";

export type ColumnTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export interface UserColumnActions {
  actorRole?: Role | null;
  currentUserId?: string;
  t: ColumnTranslator;
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onChangeRole: (user: IUser) => void;
  onStatusChange: (user: IUser, action: UserStatusAction) => void;
  onDelete: (user: IUser) => void;
  onRestore: (user: IUser) => void;
}

export function getUserColumns({
  actorRole,
  currentUserId,
  t,
  onView,
  onEdit,
  onChangeRole,
  onStatusChange,
  onDelete,
  onRestore,
}: UserColumnActions): ColumnDef<IUser>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={t("user")} />
      ),
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.name}
          email={row.original.email}
          image={row.original.image ?? row.original.appUser?.profilePhoto}
        />
      ),
    },
    {
      accessorKey: "id",
      header: t("userId"),
      cell: ({ row }) => (
        <span
          className="block max-w-[130px] truncate font-mono text-xs text-muted-foreground"
          title={row.original.id}
        >
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={t("role")} />
      ),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
    },
    {
      id: "verification",
      header: t("verification"),
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-1">
          <VerificationBadge
            type="email"
            verified={row.original.emailVerified}
          />
          <VerificationBadge
            type="phone"
            verified={row.original.phoneVerified}
          />
        </div>
      ),
    },
    {
      id: "referral",
      header: t("referral"),
      cell: ({ row }) => {
        const appUser = row.original.appUser;
        if (!appUser?.referralCode) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-medium">
              {appUser.referralCode}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {appUser.referrer?.authUser?.name
                ? t("via", { name: appUser.referrer.authUser.name })
                : t("direct")}
            </span>
          </div>
        );
      },
    },
    {
      id: "wallet",
      header: t("wallet"),
      cell: ({ row }) => {
        const appUser = row.original.appUser;
        if (!appUser) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium tabular-nums">
              {formatBDT(appUser.balance)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {t("earned", { amount: formatBDT(appUser.totalEarned) })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnsHeader column={column} title={t("registered")} />
      ),
      cell: ({ row }) => <DateCell value={row.original.createdAt} />,
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">{t("actions")}</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UserRowActions
            user={row.original}
            actorRole={actorRole}
            currentUserId={currentUserId}
            onView={onView}
            onEdit={onEdit}
            onChangeRole={onChangeRole}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        </div>
      ),
    },
  ];
}
