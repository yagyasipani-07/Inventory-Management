'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { LowStockProduct } from '../_services/dashboardService';
import { useRouter } from 'next/navigation';

interface LowStockTableProps {
  products: LowStockProduct[];
}

export function LowStockTable({ products }: LowStockTableProps) {
  const router = useRouter();

  return (
    <Card className="rounded-xl shadow-sm border border-border h-full flex flex-col">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-base font-semibold">Low Stock Items</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 pt-0">
        <div className="overflow-auto max-h-[300px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px]">Product Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Minimum Stock</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/inventory/${product.id}`)}
                >
                  <TableCell className="font-medium text-xs text-muted-foreground">{product.code}</TableCell>
                  <TableCell className="font-medium truncate max-w-[150px]">{product.name}</TableCell>
                  <TableCell className="text-right font-semibold">{product.currentStock}</TableCell>
                  <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{product.minimumStock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === 'Critical' ? 'destructive' : 'outline'}
                      className={
                        product.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : ''
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No low stock items found.
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
