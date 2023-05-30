interface DBConfig {
  version: string;
  storeName: string;
  keyPath: string;
}

class IndexedDBService {
  private readonly dbName: string;
  private readonly storeName: string;
  private readonly keyPath: string;

  private db: IDBDatabase | null = null;

  constructor(dbName: string, storeName: string, keyPath: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.keyPath = keyPath;
  }

  // 连接数据库
  private async connectDB(version: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, +version);

      request.onerror = () => {
        reject(`Failed to open database ${this.dbName}`);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = () => {
        this.db = request.result;

        if (!this.db.objectStoreNames.contains(this.storeName)) {
          // 创建对象仓库
          this.db.createObjectStore(this.storeName, { keyPath: this.keyPath });
        }
      };
    });
  }

  // 添加数据
  static async addItem<T>(dbConfig: DBConfig, item: T): Promise<void> {
    const { version, storeName, keyPath } = dbConfig;
    const db = await new IndexedDBService(
      version,
      storeName,
      keyPath,
    ).connectDB(version);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onerror = () => {
        reject(`Failed to add item to ${storeName}`);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  // 删除数据
  static async deleteItem(dbConfig: DBConfig, key: any): Promise<boolean> {
    const { version, storeName, keyPath } = dbConfig;
    const db = await new IndexedDBService(
      version,
      storeName,
      keyPath,
    ).connectDB(version);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => {
        reject(false);
      };

      request.onsuccess = () => {
        resolve(true);
      };
    });
  }

  // 修改数据
  static async updateItem<T>(dbConfig: DBConfig, item: T): Promise<boolean> {
    const { version, storeName, keyPath } = dbConfig;
    const db = await new IndexedDBService(
      version,
      storeName,
      keyPath,
    ).connectDB(version);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onerror = () => {
        reject(false);
      };

      request.onsuccess = () => {
        resolve(true);
      };
    });
  }

  // 查询数据
  static async getItem<T>(
    dbConfig: DBConfig,
    key: any,
  ): Promise<T | undefined> {
    const { version, storeName, keyPath } = dbConfig;
    const db = await new IndexedDBService(
      version,
      storeName,
      keyPath,
    ).connectDB(version);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => {
        reject(undefined);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}

// const

export default IndexedDBService;
