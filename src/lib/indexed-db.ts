import { Book } from "../types/book";

const DB_NAME = "book-tracker";
const DB_VERSION = 2;
const STORE_NAME = "books";

type StoreMode = IDBTransactionMode;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.reject(
      new Error("IndexedDB is not available in this environment."),
    );
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open IndexedDB."));
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = (event as IDBVersionChangeEvent).oldVersion;

      let store: IDBObjectStore;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      } else {
        const upgradeTransaction = request.transaction;
        if (!upgradeTransaction) {
          throw new Error("IndexedDB upgrade transaction missing.");
        }
        store = upgradeTransaction.objectStore(STORE_NAME);
      }

      if (oldVersion < 2 && !store.indexNames.contains("author")) {
        store.createIndex("author", "author", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onblocked = () => {
      reject(new Error("IndexedDB upgrade was blocked."));
    };
  });
}

function runTransaction<T>(
  mode: StoreMode,
  executor: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = executor(store);
        let settled = false;

        const resolveOnce = (value: T) => {
          if (settled) return;
          settled = true;
          resolve(value);
        };

        const rejectOnce = (error: unknown) => {
          if (settled) return;
          settled = true;
          reject(
            error instanceof Error
              ? error
              : new Error("IndexedDB transaction failed."),
          );
        };

        request.onsuccess = () => {
          resolveOnce(request.result as T);
        };

        request.onerror = () => {
          rejectOnce(request.error ?? new Error("IndexedDB request failed."));
        };

        transaction.oncomplete = () => {
          db.close();
          resolveOnce(request.result as T);
        };

        transaction.onabort = () => {
          const reason =
            transaction.error ?? request.error ?? new Error("Aborted transaction.");
          db.close();
          rejectOnce(reason);
        };

        transaction.onerror = () => {
          const reason =
            transaction.error ?? request.error ?? new Error("IndexedDB error.");
          db.close();
          rejectOnce(reason);
        };
      }),
  );
}

export async function loadBooks(): Promise<Book[]> {
  const records = await runTransaction<Book[]>(
    "readonly",
    (store) => store.getAll() as IDBRequest<Book[]>,
  );

  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((entry) => ({
    ...entry,
    author: typeof entry.author === "string" ? entry.author : "",
  }));
}

export async function upsertBook(book: Book): Promise<void> {
  await runTransaction<IDBValidKey>("readwrite", (store) => store.put(book));
}

export async function removeBook(id: string): Promise<void> {
  await runTransaction("readwrite", (store) => store.delete(id));
}
