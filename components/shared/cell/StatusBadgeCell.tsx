import { Badge } from "@/components/ui/badge";

interface StatusBadgeCellProps {
  status: string;
  label?: string;
  variantMap?: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link">;
}

const DEFAULT_VARIANT_MAP: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
> = {
  ACTIVE: "default",
  COMPLETED: "default",
  PAID: "default",
  APPROVED: "default",
  VERIFIED: "default",
  PENDING: "secondary",
  PROCESSING: "secondary",
  WORKING: "secondary",
  SLEEPING: "secondary",
  REJECTED: "destructive",
  CANCELLED: "destructive",
  FAILED: "destructive",
  BLOCKED: "destructive",
  SUSPENDED: "destructive",
  INACTIVE: "outline",
  DELETED: "outline",
  REFUNDED: "outline",
};

export function StatusBadgeCell({
  status,
  label,
  variantMap,
}: StatusBadgeCellProps) {
  const map = { ...DEFAULT_VARIANT_MAP, ...variantMap };
  return (
    <Badge variant={map[status] ?? "secondary"}>
      {label ?? status}
    </Badge>
  );
}