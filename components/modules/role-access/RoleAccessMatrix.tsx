"use client";

import { Fragment, useMemo, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { getRoleDescription, getRoleLabel } from "@/components/modules/users/user.constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PermissionStateBadge } from "./PermissionStateBadge";
import {
  getPermissionState,
  isRoleAccessSubject,
  ROLE_ACCESS_GROUPS,
  ROLE_ACCESS_PERMISSIONS,
  ROLE_ACCESS_SUBJECTS,
  type PermissionState,
  type RoleAccessSubject,
} from "./role-access.constants";

const ALL_ROLES_FILTER = "ALL";

const LEGEND_STATES: PermissionState[] = ["ALLOWED", "LIMITED", "DENIED"];

export function RoleAccessMatrix() {
  const t = useTranslations("admin.roleAccess");
  const te = useTranslations("enums");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(ALL_ROLES_FILTER);

  const visibleSubjects = useMemo<RoleAccessSubject[]>(() => {
    if (roleFilter !== ALL_ROLES_FILTER && isRoleAccessSubject(roleFilter)) {
      return [roleFilter];
    }
    return ROLE_ACCESS_SUBJECTS;
  }, [roleFilter]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visiblePermissions = useMemo(() => {
    if (!normalizedSearch) return ROLE_ACCESS_PERMISSIONS;
    return ROLE_ACCESS_PERMISSIONS.filter((permission) => {
      const label = t(`permissions.${permission.key}.label`);
      const description = t(`permissions.${permission.key}.description`);
      return (
        permission.id.toLowerCase().includes(normalizedSearch) ||
        label.toLowerCase().includes(normalizedSearch) ||
        description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [normalizedSearch, t]);

  const getSubjectLabel = (subject: RoleAccessSubject): string =>
    subject === "AGENT" ? t("roles.agent") : getRoleLabel(subject, te);

  const getSubjectDescription = (subject: RoleAccessSubject): string =>
    subject === "AGENT"
      ? t("roleNotes.agent")
      : getRoleDescription(subject, te);

  const getStateLabel = (state: PermissionState): string =>
    t(`states.${state.toLowerCase()}`);

  const getStateDescription = (state: PermissionState): string =>
    t(`stateDescriptions.${state.toLowerCase()}`);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t("toolbar.searchPlaceholder")}
              className="pl-9"
              aria-label={t("toolbar.searchPlaceholder")}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("toolbar.roleFilterLabel")}
            </span>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ROLES_FILTER}>
                  {t("toolbar.allRoles")}
                </SelectItem>
                {ROLE_ACCESS_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {getSubjectLabel(subject)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border bg-muted/30 px-3 py-2">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            {t("legend.label")}
          </span>
          {LEGEND_STATES.map((state) => (
            <div key={state} className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  state === "ALLOWED" &&
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300",
                  state === "LIMITED" &&
                    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300",
                  state === "DENIED" &&
                    "border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-400/30 dark:bg-red-400/15 dark:text-red-300",
                )}
              >
                {getStateLabel(state)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getStateDescription(state)}
              </span>
            </div>
          ))}
        </div>

        {visiblePermissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card px-4 py-16 text-center">
            <ShieldAlert className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("empty.description")}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter(ALL_ROLES_FILTER);
              }}
            >
              {t("emptyClear")}
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <Table className="min-w-[52rem]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="sticky left-0 z-10 bg-muted/40">
                    {t("columns.permission")}
                  </TableHead>
                  {visibleSubjects.map((subject) => (
                    <TableHead key={subject} className="text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="mx-auto inline-flex cursor-help items-center gap-1 font-medium"
                          >
                            {getSubjectLabel(subject)}
                            {subject === "AGENT" ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] leading-none"
                              >
                                {t("roles.agentFlag")}
                              </Badge>
                            ) : null}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-left">
                          {getSubjectDescription(subject)}
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROLE_ACCESS_GROUPS.map((group) => {
                  const groupPermissions = visiblePermissions.filter(
                    (permission) => permission.group === group,
                  );

                  if (groupPermissions.length === 0) return null;

                  return (
                    <Fragment key={group}>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableCell
                          colSpan={visibleSubjects.length + 1}
                          className="sticky left-0 text-xs font-semibold tracking-wide uppercase text-muted-foreground"
                        >
                          {t(`groups.${group}`)}
                        </TableCell>
                      </TableRow>
                      {groupPermissions.map((permission) => (
                        <TableRow key={permission.id} className="group">
                          <TableCell className="sticky left-0 z-10 bg-card align-top group-hover:bg-muted/60">
                            <div className="space-y-0.5">
                              <p className="font-medium">
                                {t(`permissions.${permission.key}.label`)}
                              </p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {permission.id}
                              </p>
                            </div>
                          </TableCell>
                          {visibleSubjects.map((subject) => {
                            const state = getPermissionState(
                              subject,
                              permission.id,
                            );
                            return (
                              <TableCell
                                key={`${permission.id}-${subject}`}
                                className="text-center"
                              >
                                <PermissionStateBadge
                                  state={state}
                                  label={getStateLabel(state)}
                                  description={t(
                                    `permissions.${permission.key}.description`,
                                  )}
                                  stateDescription={getStateDescription(state)}
                                  restriction={
                                    permission.restriction
                                      ? t(
                                          `permissions.${permission.key}.restriction`,
                                        )
                                      : undefined
                                  }
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
