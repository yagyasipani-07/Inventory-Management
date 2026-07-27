'use client';

import { Button } from '@/src/components/ui/button';
import { PackagePlus, FileText, Upload, Download, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function QuickActions() {
  const actions = [
    {
      title: 'Add Product',
      icon: PackagePlus,
      href: '/inventory/new',
      variant: 'default' as const,
    },
    {
      title: 'Create Challan',
      icon: FileText,
      href: '/challans/new',
      variant: 'secondary' as const,
    },
    {
      title: 'Import Excel',
      icon: Upload,
      href: '/import',
      variant: 'outline' as const,
    },
    {
      title: 'Export Inventory',
      icon: Download,
      href: '/inventory/export',
      variant: 'outline' as const,
    },
    {
      title: 'Manage Customers',
      icon: Users,
      href: '/customers',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="rounded-xl shadow-sm border border-border">
      <CardHeader className="pb-3 px-4 pt-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              asChild
              variant={action.variant}
              className="min-h-[48px] md:min-h-10 rounded-full shadow-sm hover:-translate-y-0.5 transition-transform duration-150 ease-out"
            >
              <Link href={action.href}>
                <action.icon className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                {action.title}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
