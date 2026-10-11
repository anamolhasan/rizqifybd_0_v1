import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CurrencyCellProps {
  value: number | string | null | undefined;
  className?: string;
  positive?: string;
  negative?: string;
}

export function CurrencyCell({
  value,
  className,
  positive = "text-success",
  negative = "text-destructive",
}: CurrencyCellProps) {
  const numeric = Number(value ?? 0);
  const isNegative = numeric < 0;

  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        isNegative ? negative : positive,
        className,
      )}
    >
      {formatBDT(value)}
    </span>
  );
}