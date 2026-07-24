'use client';

import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface DashboardErrorProps {
  message?: string;
  onRetry: () => void;
}

export function DashboardError({ message = "Failed to load dashboard data.", onRetry }: DashboardErrorProps) {
  return (
    <Card className="rounded-xl shadow-sm border border-destructive/20 bg-destructive/5 h-full min-h-[300px] flex items-center justify-center">
      <CardContent className="flex flex-col items-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
          {message}
        </p>
        <Button onClick={onRetry} variant="outline" className="bg-background">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
