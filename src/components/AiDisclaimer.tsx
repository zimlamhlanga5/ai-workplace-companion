import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
      <p>
        AI-generated content may contain inaccuracies. Users should review and verify all outputs before
        making business decisions. This application is designed to assist productivity and does not replace
        professional judgment.
      </p>
    </div>
  );
}
