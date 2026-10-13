import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTablePaginationSkeletonProps {
  className?: string;
}

export function DataTablePaginationSkeleton({
  className,
}: DataTablePaginationSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col items-center justify-between gap-4 sm:flex-row",
        className,
      )}
    >
      <Skeleton className="h-5 w-52" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-[70px]" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
    </div>
  );
}
