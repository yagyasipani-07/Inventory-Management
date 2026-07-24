"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-full flex-col items-center justify-center bg-background p-4 text-center text-foreground">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
          Fatal System Error
        </h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground">
          A critical error occurred that prevented the application from rendering.
        </p>
        <p className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
          {error.message || "Unknown error"}
        </p>
        <div className="mt-8 flex gap-4">
          <Button onClick={() => reset()} variant="default" size="lg">
            Reload Application
          </Button>
        </div>
      </body>
    </html>
  );
}
