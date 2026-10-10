import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName?: string;
  description?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  iconName,
  description,
  className,
}: StatsCardProps) {
  const Icon = iconName ? getIconComponent(iconName) : null;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        {Icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4.5 text-muted-foreground" />
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