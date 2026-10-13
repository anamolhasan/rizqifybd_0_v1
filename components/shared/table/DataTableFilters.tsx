"use client";

import { ListFilter, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableFiltersProps {
  children: React.ReactNode;
  hasFilters?: boolean;
  onClear?: () => void;
  className?: string;
}

export function DataTableFilters({
  children,
  hasFilters = false,
  onClear,
  className,
}: DataTableFiltersProps) {
  const t = useTranslations("common");
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ListFilter className="size-4" />
        {t("filters")}
      </span>
      {children}
      {hasFilters && onClear ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground"
        >
          <X />
          {t("clear")}
        </Button>
      ) : null}
    </div>
  );
}