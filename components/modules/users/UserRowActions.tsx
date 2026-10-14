"use client";

import {
  Ban,
  Eye,
  MoreHorizontal,
  PauseCircle,
  Pencil,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Unlock,
  UserCheck,
  UserX,
} from "lucide-react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/types/enums";
import type { IUser } from "@/types/user.types";
import {
  canDeleteUser,
  canManageUser,
  getAssignableRoles,
  getStatusActionLabel,
  getStatusActions,
  type UserStatusAction,
} from "./user.constants";

const STATUS_ACTION_ICONS = {
  ACTIVATE: UserCheck,
  DEACTIVATE: UserX,
  SUSPEND: PauseCircle,
  UNSUSPEND: PlayCircle,
  BLOCK: Ban,
  UNBLOCK: Unlock,
} as const;

export interface UserRowActionsProps {
  user: IUser;
  actorRole?: Role | null;
  currentUserId?: string;
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onChangeRole: (user: IUser) => void;
  onStatusChange: (user: IUser, action: UserStatusAction) => void;
  onDelete: (user: IUser) => void;
  onRestore: (user: IUser) => void;
}

export function UserRowActions({
  user,
  actorRole,
  currentUserId,
  onView,
  onEdit,
  onChangeRole,
  onStatusChange,
  onDelete,
  onRestore,
}: UserRowActionsProps) {
  const t = useTranslations("admin.users.rowActions");
  const te = useTranslations("enums");
  const isSelf = user.id === currentUserId;
  const isDeleted = user.isDeleted;
  const canManage = canManageUser(actorRole, user.role);
  const canDelete = canDeleteUser(actorRole, user.role);
  const canEdit = !isDeleted && (isSelf || canManage);
  const assignableRoles = getAssignableRoles(actorRole, user.role);
  const canChangeRole =
    !isSelf && !isDeleted && assignableRoles.length > 0;
  const statusActions =
    !isSelf && !isDeleted && canManage ? getStatusActions(user.status) : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("actionsFor", { name: user.name })}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => onView(user)}>
          <Eye />
          {t("view")}
        </DropdownMenuItem>

        {canEdit ? (
          <DropdownMenuItem onSelect={() => onEdit(user)}>
            <Pencil />
            {t("edit")}
          </DropdownMenuItem>
        ) : null}

        {canChangeRole ? (
          <DropdownMenuItem onSelect={() => onChangeRole(user)}>
            <ShieldCheck />
            {t("changeRole")}
          </DropdownMenuItem>
        ) : null}

        {statusActions.length > 0 ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PauseCircle />
              {t("manageStatus")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {statusActions.map((action) => {
                const Icon = STATUS_ACTION_ICONS[action];
                return (
                  <DropdownMenuItem
                    key={action}
                    onSelect={() => onStatusChange(user, action)}
                  >
                    <Icon />
                    {getStatusActionLabel(action, te)}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : null}

        {isDeleted ? (
          canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onRestore(user)}>
                <RotateCcw />
                {t("restore")}
              </DropdownMenuItem>
            </>
          ) : null
        ) : canDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t("dangerZone")}</DropdownMenuLabel>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(user)}
            >
              <Trash2 />
              {t("delete")}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
