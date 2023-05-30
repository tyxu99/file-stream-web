interface DBConfig {
  version: number;
  storeName: string;
  keyPath: string;
}

class IndexedDBSingle {
  private static _instance: IndexedDBSingle;
  private readonly dbName: string;
  private readonly storeName: string;
  private readonly keyPath: string;
  private db: IDBDatabase | null = null;

  private constructor(dbName: string, storeName: string, keyPath: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.keyPath = keyPath;
    this.connectDB();
  }

  // 获取 IndexedDBSingle 实例
  public static getInstance(dbName: string, storeName: string, keyPath: string): IndexedDBSingle {
    if (!IndexedDBSingle._instance) {
      IndexedDBSingle._instance = new IndexedDBSingle(dbName, storeName, keyPath);
    }
    return IndexedDBSingle._instance;
  }

  // 连接数据库
  private async connectDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = IndexedDBSingle.open(this.dbName, 1);

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
  public async addItem<T>(item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(item);

      request.onerror = () => {
        reject(`Failed to add item to ${this.storeName}`);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  // 删除数据
  public async deleteItem(key: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
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
  public async updateItem<T>(item: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
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
  public async getItem<T>(key: any): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
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

export default
