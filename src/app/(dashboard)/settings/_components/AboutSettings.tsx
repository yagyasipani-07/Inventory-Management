"use client";

import { SectionCard } from "@/components/shared/section-card";
import { Package, GitCommit, Server, Database, CheckCircle2 } from "lucide-react";

export function AboutSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">About System</h2>
        <p className="text-sm text-muted-foreground">
          System information, version details, and environment status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="System Details">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Application Version</p>
                <p className="text-xs text-muted-foreground">v1.0.0 (Production)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GitCommit className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Build Hash</p>
                <p className="text-xs text-muted-foreground">8f93a2b</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Environment</p>
                <p className="text-xs text-muted-foreground">Production</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Service Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Database Connection</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">API Services</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Healthy</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <h3 className="font-semibold text-foreground">Paras Plywoods ERP</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Licensed to Paras Plywoods Pvt Ltd.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
}
