"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h2>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while rendering this page. We've logged the issue and are looking into it.
      </p>
      <div className="mt-8 flex gap-4">
        <Button onClick={() => reset()} variant="default" size="lg">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline" size="lg">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
