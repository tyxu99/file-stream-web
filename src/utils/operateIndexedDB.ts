class IndexedDBService {
  private static DB_NAME = "myIndexedDB";
  public static db: IDBDatabase;

  public static open(dbName: string, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName);
      request.onerror = () => reject("Failed to Open Database");
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        const store = this.db.createObjectStore(storeName, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("name", "name", { unique: true });
      };
    });
  }

  public static add(storeName: string, item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      request.onerror = () => reject("Failed to Add Item");
      request.onsuccess = () => resolve();
    });
  }

  public static put(storeName: string, item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onerror = () => reject("Failed to Put Item");
      request.onsuccess = () => resolve();
    });
  }

  public static delete(storeName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onerror = () => reject("Failed to Delete Item");
      request.onsuccess = () => resolve();
    });
  }

  public static get(storeName: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onerror = () => reject("Failed to Get Item");
      request.onsuccess = () => resolve(request.result);
    });
  }

  public static getAll(
    storeName: string,
    index?: string,
    filter?: any,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = index
        ? store.index(index).openCursor()
        : store.openCursor();
      const results: any[] = [];
      request.onerror = () => reject("Failed to Get All Items");
      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          if (filter && !this._compare(cursor.value, filter)) {
            cursor.continue();
          } else {
            results.push(cursor.value);
            cursor.continue();
          }
        } else {
          resolve(results);
        }
      };
    });
  }

  private static _compare(item: any, filter: any): boolean {
    for (const key in filter) {
      if (item[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  }
}

export default IndexedDBService;
