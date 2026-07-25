import { Package2, Boxes, TriangleAlert, CircleOff } from 'lucide-react';
import { WarehouseSummary } from '../_services/warehouseService';

interface WarehouseSummaryCardsProps {
  summary: WarehouseSummary;
}

export function WarehouseSummaryCards({ summary }: WarehouseSummaryCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: summary.totalProducts,
      description: 'Active items in warehouse',
      icon: Package2,
    },
    {
      title: 'Available Units',
      value: summary.availableUnits,
      description: 'Ready for dispatch',
      icon: Boxes,
    },
    {
      title: 'Low Stock Items',
      value: summary.lowStockItems,
      description: 'Below minimum threshold',
      icon: TriangleAlert,
    },
    {
      title: 'Out of Stock',
      value: summary.outOfStockItems,
      description: 'Zero available inventory',
      icon: CircleOff,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{card.title}</h3>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
