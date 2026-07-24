"use client";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Lock, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage authentication, passwords, and security policies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Password Policy">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground">Change Password</p>
              <p className="text-sm text-muted-foreground">
                Ensure your account is using a long, random password to stay secure.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Update Password
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Two-Factor Authentication">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground">Authenticator App</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account using TOTP.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Setup 2FA
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Session Management">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground">Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Automatically log out after a period of inactivity. Currently set to 30 minutes.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Configure Timeout
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Audit Logs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ExternalLink className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground">System Audit Logs</p>
              <p className="text-sm text-muted-foreground">
                View a detailed trail of all activity and security events across the ERP.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/audit">View Audit Logs</Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
