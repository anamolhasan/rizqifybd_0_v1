"use client";

import { useMemo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { IOperator } from "@/types/operator.types";

interface OfferOperatorMultiSelectProps {
  options: IOperator[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  invalid?: boolean;
}

export function OfferOperatorMultiSelect({
  options,
  value,
  onChange,
  disabled,
  isLoading,
  invalid,
}: OfferOperatorMultiSelectProps) {
  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
    [options],
  );

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((item) => item !== id) : [...value, id],
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-input px-3 py-2 text-sm text-muted-foreground">
        Loading operators...
      </div>
    );
  }

  if (sortedOptions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input px-3 py-2 text-sm text-muted-foreground">
        No operators available yet.
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Operators"
      className={cn(
        "max-h-52 overflow-y-auto rounded-lg border border-input p-1",
        invalid && "border-destructive",
      )}
    >
      {sortedOptions.map((operator) => {
        const checked = value.includes(operator.id);
        const id = `offer-operator-${operator.id}`;
        return (
          <label
            key={operator.id}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
          >
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={() => toggle(operator.id)}
              disabled={disabled}
            />
            <span className="truncate">{operator.name}</span>
          </label>
        );
      })}
    </div>
  );
}
