import { useEffect, useState } from 'react';
import { Book } from './types/book';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { Button } from './components/ui/button';
import { BookOpen, Plus, Sparkles } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { loadBooks, removeBook, upsertBook } from './lib/indexed-db';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadBooks()
      .then((storedBooks) => {
        if (isMounted) {
          setBooks(storedBooks);
        }
      })
      .catch((error) => {
        console.error('Failed to load tomes from IndexedDB', error);
        if (isMounted) {
          toast.error('Could not load saved tomes', {
            description: 'Starting with a fresh collection instead.',
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (bookData: Omit<Book, 'id'> | Book) => {
    try {
      if ('id' in bookData) {
        const updatedBook = bookData as Book;
        await upsertBook(updatedBook);
        setBooks((current: Book[]) =>
          current.map((existing: Book) =>
            existing.id === updatedBook.id ? updatedBook : existing,
          ),
        );
        toast.success('Tome updated successfully!', {
          description: `"${updatedBook.title}" has been updated in your collection.`,
        });
      } else {
        const newBook: Book = {
          ...bookData,
          id: crypto.randomUUID(),
        };
        await upsertBook(newBook);
  setBooks((current: Book[]) => [...current, newBook]);
        toast.success('New tome added!', {
          description: `"${newBook.title}" has been added to your collection.`,
        });
      }
      setEditingBook(undefined);
    } catch (error) {
      console.error('Failed to persist tome to IndexedDB', error);
      toast.error('Could not save that tome', {
        description: 'Please try again.',
      });
      throw error;
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
  const book = books.find((entry: Book) => entry.id === id);

    void (async () => {
      try {
        await removeBook(id);
  setBooks((current: Book[]) => current.filter((entry: Book) => entry.id !== id));
        toast.success('Tome removed', {
          description: `"${book?.title ?? 'The tome'}" has been removed from your collection.`,
        });
      } catch (error) {
        console.error('Failed to remove tome from IndexedDB', error);
        toast.error('Could not remove that tome', {
          description: 'Please try again.',
        });
      }
    })();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBook(undefined);
  };

  const totalValue = books.reduce<number>(
    (sum: number, book: Book) => sum + book.totalPrice,
    0,
  );
  const totalSold = books.reduce<number>(
    (sum: number, book: Book) => sum + (book.soldFor || 0),
    0,
  );
  const orderedCount = books.filter((book: Book) => book.ordered).length;
  const deliveredCount = books.filter((book: Book) => book.delivered === 'Yes').length;

  return (
    <div className="min-h-screen forest-gradient">
      <div className="fantasy-texture"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="forest-header">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-emerald-300" />
                <h1 className="forest-strong flex items-center gap-2">
                  Fantasy Tome Tracker
                  <Sparkles className="w-5 h-5 text-emerald-200" />
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
                <div className="forest-stat-label">Total Tomes</div>
                <div className="forest-stat-value">{books.length}</div>
              </div>
              <div className="fantasy-stat-card">
                <div className="forest-stat-label">Ordered</div>
                <div className="forest-stat-value">{orderedCount}</div>
              </div>
              <div className="fantasy-stat-card">
                <div className="forest-stat-label">Delivered</div>
                <div className="forest-stat-value">{deliveredCount}</div>
              </div>
              <div className="fantasy-stat-card">
                <div className="forest-stat-label">Total Value</div>
                <div className="forest-stat-value">${totalValue.toFixed(2)}</div>
              </div>
            </div>

            {totalSold > 0 && (
              <div className="mt-4 fantasy-stat-card">
                <div className="forest-stat-label">Total Sales Revenue</div>
                <div className="forest-stat-value">${totalSold.toFixed(2)}</div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {isBootstrapping ? (
            <div className="text-center py-16 forest-muted">
              Awakening your library...
            </div>
          ) : (
            <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />
          )}
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
