import { Book } from '../types/book';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Edit2, Trash2, Package, TrendingUp, Coins } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BookList({ books, onEdit, onDelete }: BookListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDeliveryBadgeColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-emerald-700 border-emerald-500 text-emerald-100';
      case 'Shipped': return 'bg-amber-700 border-amber-500 text-amber-100';
      default: return 'bg-slate-700 border-slate-500 text-slate-200';
    }
  };

  const getForSaleBadgeColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-purple-700 border-purple-500 text-purple-100';
      case 'Maybe': return 'bg-indigo-700 border-indigo-500 text-indigo-100';
      default: return 'bg-slate-700 border-slate-500 text-slate-200';
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-16 text-amber-200/60">
        <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
        <p>No tomes in your collection yet. Begin your journey by adding one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="fantasy-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-amber-200 pr-2">{book.title}</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(book)}
                className="h-8 w-8 p-0 text-amber-400 hover:text-amber-200 hover:bg-amber-950/50"
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

          <div className="space-y-3 text-amber-100/80">
            <div className="flex items-center gap-2">
              <span className="text-amber-300/60">Publisher:</span>
              <span>{book.publisher}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-300/60">Quantity:</span>
              <Badge variant="outline" className="bg-slate-800/50 border-slate-600">
                {book.quantity}
              </Badge>
            </div>

            <div>
              <div className="text-amber-300/60 mb-1">Pre-order:</div>
              <div className="text-sm">{formatDate(book.preOrderStartDate)}</div>
            </div>

            <div>
              <div className="text-amber-300/60 mb-1">Est. Delivery:</div>
              <div className="text-sm">{formatDate(book.estimatedDeliveryDate)}</div>
            </div>

            <div>
              <div className="text-amber-300/60 mb-1">Address:</div>
              <div className="text-sm line-clamp-2">{book.deliveryAddress}</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-amber-300/60">Ordered:</span>
              <Badge variant="outline" className={book.ordered ? 'bg-green-700 border-green-500 text-green-100' : 'bg-slate-700 border-slate-500 text-slate-200'}>
                {book.ordered ? 'Yes' : 'No'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-300/60">Delivered:</span>
              <Badge variant="outline" className={getDeliveryBadgeColor(book.delivered)}>
                {book.delivered}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-300/60">For Sale:</span>
              <Badge variant="outline" className={getForSaleBadgeColor(book.forSale)}>
                {book.forSale}
              </Badge>
            </div>

            <div className="pt-3 border-t border-amber-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-300/60 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  Total Price:
                </span>
                <span className="text-amber-200">${book.totalPrice.toFixed(2)}</span>
              </div>

              {book.soldFor !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-amber-300/60 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Sold For:
                  </span>
                  <span className="text-emerald-300">${book.soldFor.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
