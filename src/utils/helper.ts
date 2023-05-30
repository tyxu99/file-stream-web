// @ts-ignore
import md5 from "md5";

let count = 0;
export const generateFileId = async (file: File) => {
  // 每次截取多少二进制
  // let whileMax = Math.floor(
  //   file.size / 10 > 10240 * 1024 ? 10240 * 1024 : file.size / 10,
  // );
  let whileMax = 1024 * 1024;
  // 循环截取多少次
  let whileNumber =
    file.size <= 10240 * 1024 ? 10 : Math.ceil(file.size / whileMax);
  // 二进制的截取长度，超出10M后 每10M 截取一部分，最多10M
  let sliceEnd = Math.floor(
    ((((1024 * 10240) / file.size) * 100) / whileNumber) * whileMax,
  );
  sliceEnd = whileNumber > 10 ? sliceEnd : 10240 * 1024;
  // 转换二进制的长度
  let start = 0;
  let end = 0;

  let promiseArr = [];
  while (whileNumber--) {
    start = end;
    end = end + whileMax;
    let promiseArrayBuffer = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.slice(start, end));
      reader.onload = () => {
        resolve(
          new Uint8Array(reader.result as ArrayBuffer)
            .slice(0, sliceEnd)
            .join(""),
        );
      };
    });
    promiseArr.push(promiseArrayBuffer);
  }
  return md5((await Promise.all(promiseArr)).join(""));
};

export const getFileId = (file: File, cb: Function) => {
  const fr = new FileReader();
  fr.readAsArrayBuffer(file);
  fr.onload = () => {
    crypto.subtle
      .digest("SHA-256", fr.result as BufferSource)
      .then(async (res) => {
        const hashArray = Array.from(new Uint8Array(res));
        const hashBase64 = btoa(
          hashArray.reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        ).replace(/\\|\//g, "");
        cb && cb(hashBase64);
      });
  };

  fr.onerror = () => cb && cb("read error");
  fr.onabort = () => cb && cb("read abort");
};

const blobToString = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();

    fr.onload = () => {
      resolve(fr.result);
    };

    fr.onerror = (error) => {
      reject(error);
    };

    fr.readAsText(blob);
  });

export const sliceFileToLocalStorage = (file: File, cb: Function) => {
  getFileId(file, async (fileId: string) => {
    const chunkSize = 1024 * 1024 * 1;
    const fileSize = file.size;
    const chunks = Math.ceil(fileSize / chunkSize);
    let start = 0,
      chunkIndex = 0;
    while (chunkIndex < chunks) {
      const chunkItem = file.slice(start, start + chunkSize);
      const fileItem = {
        index: chunkIndex,
        total: chunks,
        data: await blobToString(chunkItem),
        name: fileId,
      };
      console.log(fileItem);
      localStorage.setItem(
        fileId + "-chunk-" + chunkIndex,
        JSON.stringify(fileItem),
      );
      start += chunkSize;
      chunkIndex++;
    }
    if (chunkIndex === chunks && cb) {
      cb(fileId, chunks);
    }
  });
};

const operateIndexedDB = (dbName: string, storeName: string) => {
  if (window && window.indexedDB) {
    let db;
    const request = window.indexedDB.open(dbName, 1);
    request.onerror = (ev) => {
      console.log("can not open db", ev);
    };

    request.onupgradeneeded = (event: any) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = (event: any) => {
      db = event.target.result;
      const data = [
        { id: 1, name: "apple" },
        { id: 2, name: "orange" },
      ];
      const store = db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);
      data.forEach((item) => store.put(item));

      const getRequest = store.get(1);
      getRequest.onerror = (err: Error) => {
        console.log("query failed", err);
      };
      getRequest.onsuccess = (event: any) => {
        console.log(event.target.result);
      };

      const updateData = { id: 1, name: "apple" };
      const updateRequest = store.put(updateData);
      updateRequest.onerror = (err: Error) => {
        console.log("update failed", err);
      };
      updateRequest.onsuccess = (event: any) => {
        console.log("update success", event);
      };

      const deleteRequest = store.delete(2);
      deleteRequest.onerror = (err: Error) => {
        console.log("delete failed");
      };
      deleteRequest.onsuccess = (event: any) => {
        console.log("deleted success", event);
      };
    };
  }
};
