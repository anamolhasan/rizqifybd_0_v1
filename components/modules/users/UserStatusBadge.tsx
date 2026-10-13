import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/enums";
import {
  USER_STATUS_BADGE_CLASSES,
  USER_STATUS_DOT_CLASSES,
  USER_STATUS_LABELS,
} from "./user.constants";

interface UserStatusBadgeProps {
  status: UserStatus | string;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const classes =
    USER_STATUS_BADGE_CLASSES[status as UserStatus] ??
    "border-border bg-muted/50 text-muted-foreground";
  const dot = USER_STATUS_DOT_CLASSES[status as UserStatus] ?? "bg-muted-foreground";
  const label = USER_STATUS_LABELS[status as UserStatus] ?? status;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", classes, className)}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", dot)}
      />
      {label}
    </Badge>
  );
}
