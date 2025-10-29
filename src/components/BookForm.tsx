import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { Book, DeliveryStatus, ForSaleStatus } from '../types/book';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { BookOpen, Sparkles, X } from 'lucide-react';

interface BookFormProps {
  book?: Book;
  open: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'> | Book) => void | Promise<void>;
}

export function BookForm({ book, open, onClose, onSave }: BookFormProps) {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: book?.title || '',
    author: book?.author || '',
    publisher: book?.publisher || '',
    preOrderStartDate: book?.preOrderStartDate || '',
    estimatedDeliveryDate: book?.estimatedDeliveryDate || '',
    ordered: book?.ordered || false,
    delivered: book?.delivered || 'No',
    totalPrice: book?.totalPrice || 0,
    quantity: book?.quantity || 1,
    forSale: book?.forSale || 'No',
    soldFor: book?.soldFor ?? null,
    tags: Array.isArray(book?.tags) ? (book?.tags as string[]) : [],
  });
  const [tagInput, setTagInput] = useState('');

  const displayTags = useMemo(() => {
    const seen = new Set<string>();
    const sanitized: string[] = [];

    for (const raw of formData.tags || []) {
      if (typeof raw !== 'string') continue;
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      sanitized.push(trimmed);
    }

    return sanitized;
  }, [formData.tags]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        preOrderStartDate: book.preOrderStartDate,
        estimatedDeliveryDate: book.estimatedDeliveryDate,
        ordered: book.ordered,
        delivered: book.delivered,
        totalPrice: book.totalPrice,
        quantity: book.quantity,
        forSale: book.forSale,
        soldFor: book.soldFor,
        tags: Array.isArray(book.tags)
          ? book.tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
          : [],
      });
    } else {
      setFormData({
        title: '',
  author: '',
        publisher: '',
        preOrderStartDate: '',
        estimatedDeliveryDate: '',
        ordered: false,
        delivered: 'No',
        totalPrice: 0,
        quantity: 1,
        forSale: 'No',
        soldFor: null,
        tags: [],
      });
    }
    setTagInput('');
  }, [book, open]);

  const handleAddTag = (rawTag: string) => {
    const tag = rawTag.trim();
    if (tag.length === 0) {
      return;
    }

    setFormData((current) => ({
      ...current,
      tags: Array.isArray(current.tags)
        ? [
            ...current.tags.filter(
              (existing) => existing.trim().toLowerCase() !== tag.toLowerCase() && existing.trim().length > 0,
            ),
            tag,
          ]
        : [tag],
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((current) => ({
      ...current,
      tags: (current.tags || []).filter(
        (existing) => existing.trim().toLowerCase() !== tag.toLowerCase(),
      ),
    }));
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddTag(tagInput);
    } else if (event.key === 'Backspace' && tagInput.length === 0 && displayTags.length > 0) {
      event.preventDefault();
      handleRemoveTag(displayTags[displayTags.length - 1]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = { ...formData, tags: displayTags };
      if (book) {
        await onSave({ ...payload, id: book.id });
      } else {
        await onSave(payload);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save tome details', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto fantasy-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 forest-strong">
            <BookOpen className="w-6 h-6" />
            {book ? 'Edit Tome' : 'Add New Tome'}
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title" className="forest-muted">Book Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="author" className="forest-muted">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="publisher" className="forest-muted">Publisher Name</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="forest-muted">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value, 10) || 1,
                  })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="preOrderDate" className="forest-muted">Pre-order Start Date</Label>
              <Input
                id="preOrderDate"
                type="date"
                value={formData.preOrderStartDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, preOrderStartDate: e.target.value })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate" className="forest-muted">Estimated Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    estimatedDeliveryDate: e.target.value,
                  })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="totalPrice" className="forest-muted">Total Price (including delivery)</Label>
              <Input
                id="totalPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalPrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    totalPrice: parseFloat(e.target.value) || 0,
                  })
                }
                required
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="soldFor" className="forest-muted">Sold For (price)</Label>
              <Input
                id="soldFor"
                type="number"
                min="0"
                step="0.01"
                value={formData.soldFor || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    soldFor: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="fantasy-input"
              />
            </div>

            <div>
              <Label htmlFor="delivered" className="forest-muted">Delivered Status</Label>
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
              <Label htmlFor="forSale" className="forest-muted">For Sale</Label>
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

            <div className="col-span-2">
              <Label htmlFor="tags" className="forest-muted">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {displayTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1 fantasy-badge">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-emerald-200/70 hover:text-emerald-50 transition"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="fantasy-input mt-3"
              />
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <Switch
                id="ordered"
                checked={formData.ordered}
                onCheckedChange={(checked) => setFormData({ ...formData, ordered: checked })}
              />
              <Label htmlFor="ordered" className="forest-muted">Ordered</Label>
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
