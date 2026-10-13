"use client";

import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserInfoCellProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  sub?: string | null;
  className?: string;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function UserInfoCell({
  name,
  email,
  image,
  sub,
  className,
}: UserInfoCellProps) {
  const t = useTranslations("common");
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className="size-8">
        {image ? (
          <AvatarImage src={image} alt={name ?? t("userAvatar")} />
        ) : null}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{name ?? "—"}</span>
        {email ? (
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        ) : sub ? (
          <span className="truncate text-xs text-muted-foreground">{sub}</span>
        ) : null}
      </div>
    </div>
  );
}