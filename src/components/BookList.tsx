import { useMemo, useState } from 'react';
import { Book } from '../types/book';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Edit2, Trash2, Package, TrendingUp, Coins } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

type SortOption = 'default' | 'ordered' | 'delivered' | 'forSale';

export function BookList({ books, onEdit, onDelete }: BookListProps) {
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDeliveryBadgeColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-emerald-700 border-emerald-500 text-emerald-100';
      case 'Shipped': return 'bg-emerald-600 border-emerald-400 text-emerald-100';
      default: return 'bg-slate-700 border-slate-500 text-slate-200';
    }
  };

  const getForSaleBadgeColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-emerald-700 border-emerald-500 text-emerald-100';
      case 'Maybe': return 'bg-emerald-500 border-emerald-400 text-emerald-100';
      default: return 'bg-slate-700 border-slate-500 text-slate-200';
    }
  };

  const sortedBooks = useMemo(() => {
    if (sortOption === 'default') {
      return books;
    }

    const copied = [...books];

    if (sortOption === 'ordered') {
      return copied.sort((a, b) => Number(b.ordered) - Number(a.ordered));
    }

    if (sortOption === 'delivered') {
      const priority: Record<Book['delivered'], number> = {
        Yes: 2,
        Shipped: 1,
        No: 0,
      };
      return copied.sort((a, b) => priority[b.delivered] - priority[a.delivered]);
    }

    const salePriority: Record<Book['forSale'], number> = {
      Yes: 2,
      Maybe: 1,
      No: 0,
    };
    return copied.sort((a, b) => salePriority[b.forSale] - salePriority[a.forSale]);
  }, [books, sortOption]);

  if (books.length === 0) {
    return (
      <div className="text-center py-16 forest-muted">
        <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
        <p>No tomes in your collection yet. Begin your journey by adding one!</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end mb-6 gap-3">
        <Label htmlFor="sort-books" className="forest-muted text-sm">Sort by</Label>
        <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
          <SelectTrigger id="sort-books" className="fantasy-select min-w-[180px]">
            <SelectValue placeholder="Sort status" />
          </SelectTrigger>
          <SelectContent className="fantasy-select-content">
            <SelectItem value="default">Recently added</SelectItem>
            <SelectItem value="ordered">Ordered status</SelectItem>
            <SelectItem value="delivered">Delivery status</SelectItem>
            <SelectItem value="forSale">For sale status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBooks.map((book) => (
        <Card key={book.id} className="fantasy-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="forest-strong pr-2">{book.title}</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(book)}
                className="h-8 w-8 p-0 forest-action"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(book.id)}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-200 hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 forest-body">
            <div className="flex items-center gap-2">
              <span className="forest-muted">Publisher:</span>
              <span>{book.publisher}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="forest-muted">Author:</span>
              <span>{book.author || 'Unknown'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="forest-muted">Quantity:</span>
              <Badge variant="outline" className="forest-badge">
                {book.quantity}
              </Badge>
            </div>

            <div>
              <div className="forest-muted mb-1">Pre-order:</div>
              <div className="text-sm">{formatDate(book.preOrderStartDate)}</div>
            </div>

            <div>
              <div className="forest-muted mb-1">Est. Delivery:</div>
              <div className="text-sm">{formatDate(book.estimatedDeliveryDate)}</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="forest-muted">Ordered:</span>
              <Badge variant="outline" className={book.ordered ? 'bg-green-700 border-green-500 text-green-100' : 'bg-slate-700 border-slate-500 text-slate-200'}>
                {book.ordered ? 'Yes' : 'No'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="forest-muted">Delivered:</span>
              <Badge variant="outline" className={getDeliveryBadgeColor(book.delivered)}>
                {book.delivered}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="forest-muted">For Sale:</span>
              <Badge variant="outline" className={getForSaleBadgeColor(book.forSale)}>
                {book.forSale}
              </Badge>
            </div>

            <div className="pt-3 border-t forest-divider space-y-2">
              <div className="flex items-center justify-between">
                <span className="forest-muted flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  Total Price:
                </span>
                <span className="forest-strong">${book.totalPrice.toFixed(2)}</span>
              </div>

              {book.soldFor !== null && (
                <div className="flex items-center justify-between">
                  <span className="forest-muted flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Sold For:
                  </span>
                  <span className="forest-strong">${book.soldFor.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
        ))}
      </div>
    </>
  );
}
