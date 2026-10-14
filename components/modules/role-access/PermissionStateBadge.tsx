"use client";

import { AlertCircle, Check, ShieldX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PermissionState } from "./role-access.constants";

const STATE_CLASSES: Record<PermissionState, string> = {
  ALLOWED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  LIMITED:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300",
  DENIED:
    "border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-400/30 dark:bg-red-400/15 dark:text-red-300",
};

const STATE_ICONS: Record<PermissionState, typeof Check> = {
  ALLOWED: Check,
  LIMITED: AlertCircle,
  DENIED: ShieldX,
};

interface PermissionStateBadgeProps {
  state: PermissionState;
  /** Localized state label (Allowed / Limited / Denied). */
  label: string;
  /** Localized permission description. */
  description: string;
  /** Localized explanation of what the state means. */
  stateDescription: string;
  /** Optional localized restriction note, shown for scoped permissions. */
  restriction?: string;
}

export function PermissionStateBadge({
  state,
  label,
  description,
  stateDescription,
  restriction,
}: PermissionStateBadgeProps) {
  const Icon = STATE_ICONS[state];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn("gap-1 font-medium", STATE_CLASSES[state])}
          aria-label={`${label}. ${stateDescription}`}
        >
          <Icon aria-hidden="true" />
          {label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-left">
        <div className="space-y-1">
          <p className="font-medium">{label}</p>
          <p>{description}</p>
          <p className="opacity-80">{stateDescription}</p>
          {restriction ? <p className="opacity-80">{restriction}</p> : null}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
