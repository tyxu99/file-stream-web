// @ts-ignore
import md5 from "md5";
import IndexedDBService from "@/utils/indexedDBTool";

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

const stringToBlob = (str: string) => {};

export const sliceFileToLocalStorage = (file: File, cb: Function) => {
  getFileId(file, async (fileId: string) => {
    const dbConfig = {
      version: "1",
      storeName: fileId,
      keyPath: "fileChunkName",
    };
    const chunkSize = 1024 * 1024 * 1;
    const fileSize = file.size;
    const chunks = Math.ceil(fileSize / chunkSize);
    let start = 0,
      chunkIndex = 0;
    const pArr = [];
    while (chunkIndex < chunks) {
      const chunkItem = file.slice(start, start + chunkSize);
      // const fileItem = {
      //   index: chunkIndex,
      //   total: chunks,
      //   data: await blobToString(chunkItem),
      //   name: fileId,
      // };
      // console.log(fileItem);
      // storage size limit 10M about try indexedDB
      // localStorage.setItem(
      //   fileId + "-chunk-" + chunkIndex,
      //   JSON.stringify(fileItem),
      // );

      pArr.push(
        IndexedDBService.addItem(dbConfig, {
          fileChunkName: fileId + "-chunk-" + chunkIndex,
          data: await blobToString(chunkItem),
        }),
      );
    }

    Promise.all(pArr).then((res) => {
      console.log("promiseAll", res);
      cb && cb(fileId, chunks);
    });
    // if (chunkIndex === chunks && cb) {
    //   cb(fileId, chunks);
    // }
  });
};
