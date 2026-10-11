import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIconComponent } from "@/lib/iconMapper";

export interface OverviewModule {
  title: string;
  description: string;
  iconName: string;
}

interface OverviewModuleAccessPanelProps {
  modules: OverviewModule[];
}

export function OverviewModuleAccessPanel({
  modules,
}: OverviewModuleAccessPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modules</CardTitle>
        <CardDescription>
          Shortcuts to the workspace features that arrive next.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {modules.map((module) => {
          const Icon = getIconComponent(module.iconName);

          return (
            <div
              key={module.title}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{module.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {module.description}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                Soon
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}