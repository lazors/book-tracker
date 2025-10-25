import { useState } from 'react';
import { Book, DeliveryStatus, ForSaleStatus } from '../types/book';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { BookOpen, Sparkles } from 'lucide-react';

interface BookFormProps {
  book?: Book;
  open: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'> | Book) => void;
}

export function BookForm({ book, open, onClose, onSave }: BookFormProps) {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: book?.title || '',
    publisher: book?.publisher || '',
    preOrderStartDate: book?.preOrderStartDate || '',
    estimatedDeliveryDate: book?.estimatedDeliveryDate || '',
    deliveryAddress: book?.deliveryAddress || '',
    ordered: book?.ordered || false,
    delivered: book?.delivered || 'No',
    totalPrice: book?.totalPrice || 0,
    quantity: book?.quantity || 1,
    forSale: book?.forSale || 'No',
    soldFor: book?.soldFor || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (book) {
      onSave({ ...formData, id: book.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto fantasy-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-200">
            <BookOpen className="w-6 h-6" />
            {book ? 'Edit Tome' : 'Add New Tome'}
            <Sparkles className="w-4 h-4" />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title" className="text-amber-100">Book Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="publisher" className="text-amber-100">Publisher Name</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-amber-100">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="preOrderDate" className="text-amber-100">Pre-order Start Date</Label>
              <Input
                id="preOrderDate"
                type="date"
                value={formData.preOrderStartDate}
                onChange={(e) => setFormData({ ...formData, preOrderStartDate: e.target.value })}
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate" className="text-amber-100">Estimated Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                required
                className="fantasy-input"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address" className="text-amber-100">Delivery Address</Label>
              <Input
                id="address"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="totalPrice" className="text-amber-100">Total Price (including delivery)</Label>
              <Input
                id="totalPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) || 0 })}
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="soldFor" className="text-amber-100">Sold For (price)</Label>
              <Input
                id="soldFor"
                type="number"
                min="0"
                step="0.01"
                value={formData.soldFor || ''}
                onChange={(e) => setFormData({ ...formData, soldFor: e.target.value ? parseFloat(e.target.value) : null })}
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="delivered" className="text-amber-100">Delivered Status</Label>
              <Select
                value={formData.delivered}
                onValueChange={(value: DeliveryStatus) => setFormData({ ...formData, delivered: value })}
              >
                <SelectTrigger className="fantasy-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="fantasy-select-content">
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="forSale" className="text-amber-100">For Sale</Label>
              <Select
                value={formData.forSale}
                onValueChange={(value: ForSaleStatus) => setFormData({ ...formData, forSale: value })}
              >
                <SelectTrigger className="fantasy-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="fantasy-select-content">
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Maybe">Maybe</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <Switch
                id="ordered"
                checked={formData.ordered}
                onCheckedChange={(checked) => setFormData({ ...formData, ordered: checked })}
              />
              <Label htmlFor="ordered" className="text-amber-100">Ordered</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="fantasy-button-secondary">
              Cancel
            </Button>
            <Button type="submit" className="fantasy-button">
              {book ? 'Update Tome' : 'Add Tome'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
