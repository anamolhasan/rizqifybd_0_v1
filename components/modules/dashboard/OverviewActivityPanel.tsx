import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverviewActivityPanelProps {
  className?: string;
  title?: string;
  description?: string;
}

const PLACEHOLDER_ROWS = 4;

export function OverviewActivityPanel({
  className,
  title = "Recent Activity",
  description = "Live activity will appear here once data is connected.",
}: OverviewActivityPanelProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="size-9 shrink-0 rounded-lg bg-muted/70" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-2/5 rounded bg-muted/70" />
              <div className="h-2.5 w-1/4 rounded bg-muted/50" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}