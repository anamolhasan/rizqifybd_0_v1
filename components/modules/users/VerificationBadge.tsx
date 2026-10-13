import { BadgeCheck, BadgeX, Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VerificationType = "email" | "phone";

interface VerificationBadgeProps {
  type: VerificationType;
  verified: boolean;
  className?: string;
}

export function VerificationBadge({
  type,
  verified,
  className,
}: VerificationBadgeProps) {
  const ChannelIcon = type === "email" ? Mail : Phone;
  const StatusIcon = verified ? BadgeCheck : BadgeX;
  const label = type === "email" ? "Email" : "Phone";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        verified
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300"
          : "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
        className,
      )}
    >
      <ChannelIcon aria-hidden="true" />
      {label}
      <StatusIcon aria-hidden="true" className="opacity-80" />
    </Badge>
  );
}
