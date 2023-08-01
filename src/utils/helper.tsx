// @ts-ignore
import md5 from "md5";
import IndexedDBService from "@/utils/indexedDBTool";

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

const stringToBlob = (str: string) => new Blob([str], { type: "text/plain" });

export const mergeBlobToOne = (blobArr: Blob[], filename: string) => {
  // 将所有blob合并为单个blob
  let mergedBlob = new Blob(blobArr, { type: "application/octet-stream" });

  // 创建包含Blob的URL
  let url = URL.createObjectURL(mergedBlob);

  // 创建下载链接
  let link = document.createElement("a");
  link.href = url;
  link.download = filename; // 下载的文件名
  link.click();
};

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
    // while (chunkIndex < chunks) {
    //   const chunkItem = file.slice(start, start + chunkSize);
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

    //   pArr.push(
    //     IndexedDBService.addItem(dbConfig, {
    //       fileChunkName: fileId + "-chunk-" + chunkIndex,
    //       data: await blobToString(chunkItem),
    //     }),
    //   );
    // }

    for (let i = 0; i < chunks; i++) {
      const chunkItem = file.slice(start, start + chunkSize);
      start += chunkSize;
      pArr.push(
        IndexedDBService.addItem(dbConfig, {
          fileChunkName: fileId + "-chunk-" + i,
          // data: await blobToString(chunkItem),
          data: chunkItem,
        }),
      );
    }

    Promise.all(pArr).then((res) => {
      console.log("promiseAll", res);
      cb && cb(fileId, chunks);
    });
  });
};

export const downloadFileFromUrl = async (url: string, fileName: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const sliceFileDownload = () => {
  let sliceUrlList: any[] = []; // 切片图片 URL 数组
  let index = 0; // 当前切片图片的索引

  /**
   * 图片分割只有第一个slice可以显示，chatGTP解释了为什么，知识盲区。
   * 读取响应的图片文件流时，由于图片的数据是二进制的，
   * 因此在对其进行切片和处理时，需要确保每个块的开始和结束位置都是二进制数据的字节边界。
   * 否则，当我们尝试将其中一个固定大小的块映射到图像元素的 URL 时，可能将会得到一些损坏或者重叠的数据，
   * 导致无法正常显示图片。
   * 因此，在这种情况下，需要通过计算出每个块的 JPEG 图像文件内容，因而在切割块的过程中，
   * 需要保证将当前块的开始位置对齐到 JPEG 图像文件的 SOI（Start-of-Image）标记处，
   * 将当前块的结束位置对齐到 JPEG 图像文件的 EOI（End-of-Image）标记处。
   * 只有在这种情况下，分割得到的 JPEG 图像块才能正确处理和显示。
   */

  // 1. 请求下载切片图片
  fetch("/download/slice-image")
    .then((response) => {
      const reader = response!.body!.getReader();
      return new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        },
      });
    })
    .then((stream) => new Response(stream))
    .then((response) => response.blob())
    .then((imageBlob) => {
      // 2. 切分 blob 数据，并把每段数据的 URL 存放到 sliceUrlList 数组中
      let chunkSize = 1024 * 1024; // 切片大小为 1 MB
      let startByte = 0;
      let totalBytes = imageBlob.size;
      while (startByte < totalBytes) {
        let endByte = startByte + chunkSize;
        let slice = imageBlob.slice(startByte, endByte);
        let blobUrl = URL.createObjectURL(slice);
        sliceUrlList.push(blobUrl);
        startByte = endByte;
      }
      // 3. 开始更新图片
      loadNextSlice();
    });

  function loadNextSlice() {
    let img = new Image();
    img.src = sliceUrlList[index];
    img.onload = () => {
      document.body.appendChild(img);
      if (index < sliceUrlList.length - 1) {
        index++;
        loadNextSlice();
      }
    };
  }
};

const formPath = (blockArr: IBlock[]) => {
  const sorted = blockArr.sort((a, b) => a.x + a.width - b.x);

  const [from, to] = sorted;
  const x1 = from.x + from.width;
  const y1 = from.y + from.height / 2;
  const x2 = to.x;
  const y2 = to.y + to.height / 2;

  const dashed = from.dashed || to.dashed;

  const props = {
    key: from.id + "" + to.id,
    fill: "none",
    stroke: "#000000",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: "1000, 10",
    strokeWidth: "1",
    d: `M ${x1} ${y1} L ${x2} ${y2}`,
  };

  if (dashed) {
    props.strokeDasharray = "10, 10";
  }

  // @ts-ignore
  return <path {...props} />;
};

import { IBlock } from "@/utils/bezierTwoBlock";
export const svgLine = (blockData: IBlock[]) => {
  const pidArr = Array.from(new Set(blockData.map((d) => d.pid))).filter(
    (d) => d,
  );
  const pBlock: any = {};
  blockData.forEach((d) => {
    if (pidArr.includes(d.id)) {
      pBlock[d.id + ""] = d;
    }
  });
  const blockPair: any[] = [];
  blockData.forEach((d) => {
    if (d.pid) {
      blockPair.push([pBlock[d.pid + ""], d]);
    }
  });

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {blockPair.map((d) => formPath(d))}
    </svg>
  );
};
