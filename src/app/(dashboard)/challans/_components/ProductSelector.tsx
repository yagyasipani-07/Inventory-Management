import { useState, useMemo } from 'react';
import { Product } from '../../inventory/_services/inventoryService';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { ChallanItem } from '../_services/challanService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { ScrollArea } from '@/src/components/ui/scroll-area';

interface ProductSelectorProps {
  products: Product[];
  selectedItems: ChallanItem[];
  onChange: (items: ChallanItem[]) => void;
}

export function ProductSelector({ products, selectedItems, onChange }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAddProduct = (product: Product) => {
    const existingIndex = selectedItems.findIndex(item => item.productId === product.id);
    if (existingIndex >= 0) {
      // Increase quantity
      const newItems = [...selectedItems];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + 1,
      };
      onChange(newItems);
    } else {
      // Add new
      onChange([
        ...selectedItems,
        {
          id: Math.random().toString(36).substring(7),
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          productImagePath: product.photoUrl || null,
          thickness: product.thickness,
          size: product.size,
          quantity: 1,
          rate: '',
          amount: ''
        }
      ]);
    }
  };


  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = selectedItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    onChange(newItems);
  };

  const handleUpdateRate = (id: string, rate: string) => {
    const newItems = selectedItems.map(item => {
      if (item.id === id) {
        const amount = rate && !isNaN(Number(rate)) ? (Number(rate) * item.quantity).toString() : '';
        return { ...item, rate, amount };
      }
      return item;
    });
    onChange(newItems);
  };

  const handleUpdateAmount = (id: string, amount: string) => {
    const newItems = selectedItems.map(item => 
      item.id === id ? { ...item, amount } : item
    );
    onChange(newItems);
  };

  const handleRemove = (id: string) => {
    onChange(selectedItems.filter(item => item.id !== id));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[500px]">
      {/* Product Catalog */}
      <div className="flex flex-col border rounded-md">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold mb-3">Product Catalog</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleAddProduct(product)}
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.thickness} • {product.size}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{product.currentStock}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Stock</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddProduct(product);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Selected Items */}
      <div className="flex flex-col border rounded-md">
        <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
          <h3 className="font-semibold">Selected Items ({selectedItems.length})</h3>
          <div className="text-sm">
            Total Qty: <span className="font-bold">{selectedItems.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {selectedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No products selected
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-[120px]">Qty</TableHead>
                  <TableHead className="w-[100px]">Rate</TableHead>
                  <TableHead className="w-[100px]">Amount</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{item.productName}</div>
                      <div className="text-xs text-muted-foreground">{item.thickness} • {item.size}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.rate || ''}
                        onChange={(e) => handleUpdateRate(item.id, e.target.value)}
                        className="h-8 text-sm"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.amount || ''}
                        onChange={(e) => handleUpdateAmount(item.id, e.target.value)}
                        className="h-8 text-sm"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
