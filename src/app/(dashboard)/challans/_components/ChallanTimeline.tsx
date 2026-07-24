import { Challan } from '../_services/challanService';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Truck, CircleDot } from 'lucide-react';

interface ChallanTimelineProps {
  challan: Challan;
}

export function ChallanTimeline({ challan }: ChallanTimelineProps) {
  const steps = [
    {
      title: 'Draft Created',
      description: `By ${challan.createdBy}`,
      date: challan.createdAt,
      icon: Clock,
      completed: true,
      current: challan.status === 'Draft'
    },
    {
      title: 'Approved',
      description: 'Challan verified',
      date: challan.status === 'Draft' ? null : challan.updatedAt,
      icon: CheckCircle2,
      completed: challan.status !== 'Draft' && challan.status !== 'Cancelled',
      current: challan.status === 'Approved'
    },
    {
      title: 'Ready for Dispatch',
      description: 'Goods packed',
      date: challan.status === 'Ready' || challan.status === 'Dispatched' ? challan.updatedAt : null,
      icon: CircleDot,
      completed: challan.status === 'Ready' || challan.status === 'Dispatched',
      current: challan.status === 'Ready'
    },
    {
      title: 'Dispatched',
      description: 'Left warehouse',
      date: challan.dispatchDate,
      icon: Truck,
      completed: challan.status === 'Dispatched',
      current: challan.status === 'Dispatched'
    }
  ];

  if (challan.status === 'Cancelled') {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <h4 className="font-semibold text-destructive">Challan Cancelled</h4>
        <p className="text-sm text-destructive/80 mt-1">
          This challan was cancelled on {format(new Date(challan.updatedAt), 'MMM d, yyyy h:mm a')}
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
              step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            } ${step.current ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold ${step.current ? 'text-primary' : ''}`}>{step.title}</h4>
                {step.date && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(step.date), 'MMM d, h:mm a')}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
