'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { RecentChallan } from '../_services/dashboardService';
import { useRouter } from 'next/navigation';

interface RecentChallansTableProps {
  challans: RecentChallan[];
}

export function RecentChallansTable({ challans }: RecentChallansTableProps) {
  const router = useRouter();

  const getStatusBadge = (status: RecentChallan['status']) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">{status}</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">{status}</Badge>;
      case 'Printed':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50">{status}</Badge>;
      case 'Dispatched':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border border-border h-full flex flex-col">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-base font-semibold">Recent Dispatch Challans</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 pt-0">
        <div className="overflow-auto max-h-[300px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px] whitespace-nowrap">Challan No</TableHead>
                <TableHead className="min-w-[120px]">Customer</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">Date</TableHead>
                <TableHead className="text-right whitespace-nowrap">Items</TableHead>
                <TableHead className="w-[100px] whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challans.map((challan) => (
                <TableRow
                  key={challan.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/challans/${challan.id}`)}
                >
                  <TableCell className="font-medium text-xs text-muted-foreground whitespace-nowrap">{challan.challanNo}</TableCell>
                  <TableCell className="font-medium truncate max-w-[120px]">{challan.customer}</TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {new Date(challan.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">{challan.items}</TableCell>
                  <TableCell className="whitespace-nowrap">{getStatusBadge(challan.status)}</TableCell>
                </TableRow>
              ))}
              {challans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No recent challans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
