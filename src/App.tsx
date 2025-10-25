import { useState } from 'react';
import { Book } from './types/book';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { Button } from './components/ui/button';
import { BookOpen, Plus, Sparkles } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  const handleSave = (bookData: Omit<Book, 'id'> | Book) => {
    if ('id' in bookData) {
      // Editing existing book
      setBooks(books.map(b => b.id === bookData.id ? bookData as Book : b));
      toast.success('Tome updated successfully!', {
        description: `"${bookData.title}" has been updated in your collection.`
      });
    } else {
      // Adding new book
      const newBook: Book = {
        ...bookData,
        id: crypto.randomUUID(),
      };
      setBooks([...books, newBook]);
      toast.success('New tome added!', {
        description: `"${bookData.title}" has been added to your collection.`
      });
    }
    setEditingBook(undefined);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const book = books.find(b => b.id === id);
    setBooks(books.filter(b => b.id !== id));
    toast.success('Tome removed', {
      description: `"${book?.title}" has been removed from your collection.`
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBook(undefined);
  };

  const totalValue = books.reduce((sum, book) => sum + book.totalPrice, 0);
  const totalSold = books.reduce((sum, book) => sum + (book.soldFor || 0), 0);
  const orderedCount = books.filter(b => b.ordered).length;
  const deliveredCount = books.filter(b => b.delivered === 'Yes').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fantasy-texture"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-amber-900/30 bg-slate-950/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-amber-400" />
                <h1 className="text-amber-200 flex items-center gap-2">
                  Fantasy Tome Tracker
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </h1>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="fantasy-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Tome
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="fantasy-stat-card">
                <div className="text-amber-400/70">Total Tomes</div>
                <div className="text-amber-100 mt-1">{books.length}</div>
              </div>
              <div className="fantasy-stat-card">
                <div className="text-amber-400/70">Ordered</div>
                <div className="text-amber-100 mt-1">{orderedCount}</div>
              </div>
              <div className="fantasy-stat-card">
                <div className="text-amber-400/70">Delivered</div>
                <div className="text-amber-100 mt-1">{deliveredCount}</div>
              </div>
              <div className="fantasy-stat-card">
                <div className="text-amber-400/70">Total Value</div>
                <div className="text-amber-100 mt-1">${totalValue.toFixed(2)}</div>
              </div>
            </div>

            {totalSold > 0 && (
              <div className="mt-4 fantasy-stat-card border-emerald-800/30">
                <div className="text-emerald-400/70">Total Sales Revenue</div>
                <div className="text-emerald-200 mt-1">${totalSold.toFixed(2)}</div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />
        </main>

        {/* Form Dialog */}
        <BookForm
          book={editingBook}
          open={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSave}
        />

        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'fantasy-toast',
          }}
        />
      </div>
    </div>
  );
}

export default App;
