import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PageErrorStateProps {
  title: string;
  description: string;
}

// Non-throwing failure state for a server-rendered page. A backend or database
// failure is reported to the visitor instead of crashing the whole route. Copy is
// always passed in by the page so it stays translatable.
export function PageErrorState({ title, description }: PageErrorStateProps) {
  return (
    <Alert variant="destructive" role="alert">
      <TriangleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
