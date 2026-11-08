const DATABASE = 'mlc-ticket-files';
const STORE = 'files';
const VERSION = 1;

/** Opens the database, or gives null when IndexedDB is missing or blocked. */
function openDatabase(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DATABASE, VERSION);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export type AttachmentFile = { id: string; file: Blob };

/**
 * Keeps the files in IndexedDB under their attachment IDs. Gives false when they could not be
 * stored; the ticket then keeps only the file names.
 */
export async function saveAttachmentBlobs(entries: readonly AttachmentFile[]): Promise<boolean> {
  if (entries.length === 0) return true;
  const database = await openDatabase();
  if (!database) return false;
  return new Promise((resolve) => {
    try {
      const transaction = database.transaction(STORE, 'readwrite');
      for (const { id, file } of entries) transaction.objectStore(STORE).put(file, id);
      transaction.oncomplete = () => {
        database.close();
        resolve(true);
      };
      transaction.onerror = () => {
        database.close();
        resolve(false);
      };
      transaction.onabort = () => {
        database.close();
        resolve(false);
      };
    } catch {
      database.close();
      resolve(false);
    }
  });
}

/** The stored file, or null when there is none (demo attachments, blocked IndexedDB). */
export async function loadAttachmentBlob(id: string): Promise<Blob | null> {
  const database = await openDatabase();
  if (!database) return null;
  return new Promise((resolve) => {
    try {
      const request = database.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      request.onsuccess = () => {
        database.close();
        resolve(request.result instanceof Blob ? request.result : null);
      };
      request.onerror = () => {
        database.close();
        resolve(null);
      };
    } catch {
      database.close();
      resolve(null);
    }
  });
}
