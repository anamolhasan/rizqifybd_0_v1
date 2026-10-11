"use client";

import { useMemo, useState } from "react";
import { Lock, Plus, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-auth";
import type { Role } from "@/types/enums";
import { StaffCreateDialog } from "./StaffCreateDialog";
import {
  canCreateStaffAccounts,
  getCreatableStaffRoles,
  STAFF_ROLE_LABELS,
} from "./user.constants";

interface StaffPermissionRule {
  actor: string;
  canCreate: string[];
  blocked: string[];
  note?: string;
}

// Mirrors the backend RBAC rules (src/app/constants/rbac.constant.ts) for staff
// account creation. The backend enforces these on every request.
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
  const canCreate = canCreateStaffAccounts(actorRole);
  const creatableRoles = useMemo(
    () => getCreatableStaffRoles(actorRole),
    [actorRole],
  );

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Create and manage staff accounts for the RizqifyBD admin panel."
      >
        {canCreate ? (
          <Button
            type="button"
            className="bg-sky-500 text-slate-950 hover:bg-sky-400"
            onClick={() => setCreateOpen(true)}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Staff creation access"
          value={canCreate ? "Enabled" : "Restricted"}
          iconName="shield"
          description={
            canCreate
              ? "You can create new staff accounts."
              : "Only Super Admin and Admin can create staff."
          }
        />
        <StatsCard
          title="Roles you can create"
          value={canCreate ? creatableRoles.length : "None"}
          iconName="users"
          description={
            canCreate
              ? creatableRoles
                  .map((role) => STAFF_ROLE_LABELS[role])
                  .join(", ")
              : "No staff roles are available to your account."
          }
        />
        <StatsCard
          title="Enforcement"
          value="Server-side"
          iconName="lock"
          description="Role assignments are validated by the backend and cannot be bypassed from the UI."
        />
      </div>

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
                <ShieldCheck className="size-4 shrink-0 text-sky-500" />
                {rule.actor}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {rule.canCreate.length ? (
                  <span className="text-muted-foreground">Can create:</span>
                ) : null}
                {rule.canCreate.map((role) => (
                  <span
                    key={role}
                    className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400"
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
              roles above. The staff list will be wired in a later step.
            </span>
          </div>
        </CardContent>
      </Card>

      <StaffCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        actorRole={actorRole}
      />
    </div>
  );
}