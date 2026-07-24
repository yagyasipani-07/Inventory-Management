import { FileText, FileEdit, PackageCheck, Truck, CircleX } from 'lucide-react';
import { Challan } from '../_services/challanService';
import { useMemo } from 'react';

interface ChallanSummaryCardsProps {
  challans: Challan[];
}

export function ChallanSummaryCards({ challans }: ChallanSummaryCardsProps) {
  const summary = useMemo(() => {
    let draft = 0;
    let ready = 0;
    let dispatchedToday = 0;
    let cancelled = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    challans.forEach((challan) => {
      if (challan.status === 'Draft') draft++;
      if (challan.status === 'Ready') ready++;
      if (challan.status === 'Cancelled') cancelled++;
      
      if (challan.status === 'Dispatched' && challan.dispatchDate) {
        const dispatchDate = new Date(challan.dispatchDate);
        dispatchDate.setHours(0, 0, 0, 0);
        if (dispatchDate.getTime() === today.getTime()) {
          dispatchedToday++;
        }
      }
    });

    return {
      total: challans.length,
      draft,
      ready,
      dispatchedToday,
      cancelled
    };
  }, [challans]);

  const cards = [
    {
      title: 'Total Challans',
      value: summary.total,
      description: 'All dispatch records',
      icon: FileText,
    },
    {
      title: 'Draft',
      value: summary.draft,
      description: 'Pending review',
      icon: FileEdit,
    },
    {
      title: 'Ready For Dispatch',
      value: summary.ready,
      description: 'Awaiting truck',
      icon: PackageCheck,
    },
    {
      title: 'Dispatched Today',
      value: summary.dispatchedToday,
      description: 'Left the warehouse',
      icon: Truck,
    },
    {
      title: 'Cancelled',
      value: summary.cancelled,
      description: 'Voided records',
      icon: CircleX,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
