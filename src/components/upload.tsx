import { Button, Upload } from "antd";
import { useState } from "react";
import {
  downloadBlob,
  getFileId,
  mergeBlobToOne,
  sliceFileToLocalStorage,
} from "@/utils/helper";
import fetcher from "@/utils/fetcher";
import IndexedDBService from "@/utils/indexedDBTool";
const Index = () => {
  const [percent, setPercent] = useState(0);
  const [acObj, setAcObj] = useState<any>(null);

  const [fileList, setFileList] = useState<
    { fileName: string; fileType: string; fileSize: number }[]
  >([]);

  const genDBConfig = (storeName: string, keyPath: string) => ({
    version: "1",
    storeName,
    keyPath,
  });

  const getFileList = async () => {
    try {
      const res = await fetcher("/fileList");
      console.log(res);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setFileList(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isFileExist = (file: File) => {
    const fileType = file.name.slice(file.name.lastIndexOf("."));
    getFileId(file, async (fileId: string) => {
      try {
        const { data } = await fetcher(
          "http://127.0.0.1:8888/api/isFileExist?filename=" + fileId + fileType,
        );
        if (data) {
          console.log("file exist");
        } else {
          uploadChunks(file, fileId);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const uploadChunks = async (file: File, filename: string) => {
    const CHUNK_SIZE = 1024 * 1024 * 5;
    const fileSize = file.size;

    const chunks = Math.ceil(fileSize / CHUNK_SIZE);
    let start = 0;
    let chunkIndex = 0;
    while (start < fileSize) {
      const chunk = file.slice(start, start + CHUNK_SIZE);
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("filename", filename);
      formData.append("current", chunkIndex + "");
      const ac = new AbortController();
      setAcObj(ac);

      try {
        const res = await fetch("http://127.0.0.1:8888/api/uploadHugeFile", {
          method: "POST",
          body: formData,
          signal: ac.signal,
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        start += CHUNK_SIZE;
        chunkIndex++;

        console.log((chunkIndex / chunks) * 100);
        setPercent((chunkIndex / chunks) * 100);
      } catch (error) {
        console.log("Error uploading chunk", error);
        throw error;
      }
    }
    mergeChunks(filename + file.name.slice(file.name.lastIndexOf(".")));
  };

  const mergeChunks = async (filename: string) => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8888/api/mergeFileChunks?filename=" + filename,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const pauseUpload = () => {
    acObj && acObj.abort();
  };

  const recoverUpload = () => {
    const dbConfig = {
      version: "1",
      storeName: "user",
      keyPath: "userId",
    };
    IndexedDBService.addItem(dbConfig, {
      userId: Date.now() + "",
      name: "bon",
      age: 12,
    }).then(() => {
      console.log("added");
      IndexedDBService.getItem(dbConfig, "1").then((res) => {
        console.log(res);
        IndexedDBService.updateItem(dbConfig, {
          userId: "1",
          name: "booooooon",
          age: 112,
        }).then((res) => {
          console.log("updated", res);
          IndexedDBService.deleteItem(dbConfig, "1").then((res) =>
            console.log("deleted", res),
          );
        });
      });
    });
  };

  const sliceToLocalStorage = (file: File) => {
    sliceFileToLocalStorage(file, (fileId: string, chunks: number) => {
      const resArr = [];

      for (let i = 0; i < chunks; i++) {
        resArr.push(
          IndexedDBService.getItem(
            {
              version: "1",
              storeName: fileId,
              keyPath: "fileChunkName",
            },
            fileId + "-chunk-" + i,
          ),
        );
      }
      Promise.all(resArr).then((res) => {
        const sorted = res.sort(
          (a: any, b: any) =>
            parseInt(a.fileChunkName.split("-")[2]) -
            parseInt(b.fileChunkName.split("-")[2]),
        );
        console.log("resArr====", sorted);
        const blobArr: Blob[] = sorted.map(
          // ({ data }) => new Blob([data], { type: "text/plain" }),
          (d: any) => d.data,
        );
        mergeBlobToOne(blobArr, fileId + ".png");
      });
    });
  };

  const downloadFile = async (filename: string) => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8888/api/fileStream/normalDown/" + filename,
        {
          headers: {
            "Response-Type": "blob",
          },
        },
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // console.log(res.headers.get("Content-Dispostion"));
      const data = await res.blob();
      const el = document.createElement("a");
      el.href = URL.createObjectURL(data);
      el.download = filename;
      el.click();
      URL.revokeObjectURL(el.href);
    } catch (error) {
      console.log("error", error);
    }
  };

  const sliceDownload = (d: any) => {
    const { fileName, fileSize } = d;
    const chunkSize = 1024 * 1024 * 10;
    const chunkNum = Math.ceil(fileSize / chunkSize);
    let start = 0;
    getSlicedBlob(fileName, fileSize, { start: 0, end: start + chunkSize });
  };

  const getSlicedBlob = async (
    filename: string,
    fileSize: number,
    range: { start: number; end: number },
  ) => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8888/api/fileStream/sliceDown/" + filename,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ range }),
        },
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.blob();

      const chunkSize = 10 * 1024 * 1024;
      const current = Math.floor(range.start / chunkSize);
      const dbConfig = genDBConfig("file", "fileChunkName");

      IndexedDBService.addItem(dbConfig, {
        fileChunkName: `${filename}-chunk-${current}`,
        data,
      });
      if (fileSize > range.end) {
        getSlicedBlob(filename, fileSize, {
          start: range.start + chunkSize,
          end:
            range.end + chunkSize > fileSize ? fileSize : range.end + chunkSize,
        });
      } else {
        console.log("to merge");
        const pArr = [];
        for (let i = 0; i < Math.ceil(fileSize / chunkSize); i++) {
          pArr.push(
            IndexedDBService.getItem(dbConfig, `${filename}-chunk-${i}`),
          );
        }
        Promise.all(pArr).then((res: any) => {
          console.log(res);

          // const lastIndex = res.length - 1;
          // let lastChunk = res[lastIndex].data;
          // if (lastChunk.byteLength < chunkSize) {
          //   const newLast = new Uint8Array(chunkSize);
          //   const lastUint8Array = new Uint8Array(lastChunk);
          //   newLast.set(lastUint8Array);
          //   res[lastIndex].data = newLast.buffer;
          //   lastChunk = newLast.buffer;
          // }

          const blob = new Blob(
            res.map((d: any) => d.data),
            { type: "application/octet-stream" },
          );
          downloadBlob(blob, filename);
        });
      }
    } catch (err) {}
  };

  const [streamStr, setStreamStr] = useState("");
  const streamOut = () => {
    const eventSource = new EventSource(
      "http://127.0.0.1:8888/api/fileStream/output",
    );

    eventSource.addEventListener("message", function (event) {
      console.log(event);
      // const data = JSON.parse(event.data);
      setStreamStr((c) => c + event.data.replace(/\\n/g, "\n"));
    });
  };

  return (
    <>
      <Upload beforeUpload={isFileExist} showUploadList={false}>
        <Button type="primary">大文件分片{percent}</Button>
      </Upload>
      <Upload beforeUpload={sliceToLocalStorage} showUploadList={false}>
        <Button type="primary">sliceToLocalStorage</Button>
      </Upload>
      <Button onClick={getFileList}>文件列表</Button>
      <Button onClick={pauseUpload}>暂停</Button>
      <Button onClick={recoverUpload}>恢复</Button>
      <div>文件列表</div>
      {fileList.length === 0
        ? "empty"
        : fileList.map((d, i) => (
            <div key={i}>
              {d.fileName}
              <Button onClick={() => downloadFile(d.fileName)}>下载</Button>
              <Button onClick={() => sliceDownload(d)}>
                切片下载=-={d.fileSize}B
              </Button>
            </div>
          ))}

      <div>
        <Button onClick={streamOut}>streamOutput</Button>
      </div>
      <div>{streamStr}</div>
    </>
  );
};

export default Index;
