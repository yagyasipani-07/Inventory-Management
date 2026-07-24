import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <PackageX className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-sm text-base text-muted-foreground">
        The page or resource you are looking for does not exist, has been moved, or you don't have permission to view it.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
