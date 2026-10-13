"use client";

import { createElement } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName?: string;
  description?: string;
  className?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  iconName,
  description,
  className,
  isLoading = false,
}: StatsCardProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return (
      <Card
        className={cn("overflow-hidden", className)}
        aria-busy="true"
        role="status"
      >
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="size-9 shrink-0 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-4 w-32" />
        </CardContent>
        <span className="sr-only">
          {t("loading")} {title}
        </span>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        {iconName ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            {createElement(getIconComponent(iconName), {
              className: "size-4.5 text-muted-foreground",
            })}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {value}
        </CardTitle>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}