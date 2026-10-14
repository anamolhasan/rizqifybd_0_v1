"use client";

import { Briefcase, Crown, Headphones, Shield, ShieldCheck, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/enums";
import { ROLE_BADGE_CLASSES, getRoleLabel } from "./user.constants";

const ROLE_ICONS = {
  SUPER_ADMIN: Crown,
  ADMIN: ShieldCheck,
  MODERATOR: Shield,
  SUPPORTER: Headphones,
  EMPLOYEE: Briefcase,
  USER: User,
} satisfies Record<Role, typeof Shield>;

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const Icon = ROLE_ICONS[role] ?? Shield;
  const t = useTranslations("enums");

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 font-medium", ROLE_BADGE_CLASSES[role], className)}
    >
      <Icon aria-hidden="true" />
      {getRoleLabel(role, t)}
    </Badge>
  );
}
