import { formatDate, formatDateTime } from "@/lib/format";

interface DateCellProps {
  value: string | Date | null | undefined;
  withTime?: boolean;
}

export function DateCell({ value, withTime = false }: DateCellProps) {
  return (
    <span className="text-sm text-muted-foreground">
      {withTime ? formatDateTime(value) : formatDate(value)}
    </span>
  );
}