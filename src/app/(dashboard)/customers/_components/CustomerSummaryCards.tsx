import { Users, UserCheck, Truck, UserX } from 'lucide-react';
import { Customer } from '../_services/customerService';
import { useMemo } from 'react';

interface CustomerSummaryCardsProps {
  customers: Customer[];
}

export function CustomerSummaryCards({ customers }: CustomerSummaryCardsProps) {
  const summary = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let recentDispatch = 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    customers.forEach((customer) => {
      if (customer.status === 'Active') active++;
      if (customer.status === 'Inactive') inactive++;
      
      if (customer.lastDispatch) {
        const dispatchDate = new Date(customer.lastDispatch);
        if (dispatchDate >= thirtyDaysAgo) {
          recentDispatch++;
        }
      }
    });

    return {
      total: customers.length,
      active,
      inactive,
      recentDispatch,
    };
  }, [customers]);

  const cards = [
    {
      title: 'Total Customers',
      value: summary.total,
      description: 'Registered in directory',
      icon: Users,
    },
    {
      title: 'Active Customers',
      value: summary.active,
      description: 'Currently trading',
      icon: UserCheck,
    },
    {
      title: 'Recent Dispatches',
      value: summary.recentDispatch,
      description: 'Active in last 30 days',
      icon: Truck,
    },
    {
      title: 'Inactive Customers',
      value: summary.inactive,
      description: 'No recent activity',
      icon: UserX,
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
