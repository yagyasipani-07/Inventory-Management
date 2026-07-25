import { useState, useMemo } from 'react';
import { Customer } from '../../customers/_services/customerService';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { ScrollArea } from '@/src/components/ui/scroll-area';

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelect: (customer: Customer) => void;
}

export function CustomerSelector({ customers, selectedCustomerId, onSelect }: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name, city, or number..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No customers found.
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredCustomers.map((customer) => (
              <Card 
                key={customer.id} 
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedCustomerId === customer.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => onSelect(customer)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">{customer.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {customer.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone || 'N/A'}
                      </span>
                    </div>
                  </div>
                  {selectedCustomerId === customer.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
