import { Button, Upload, Progress } from "antd";
import { useState } from "react";
import {
  getFileId,
  mergeBlobToOne,
  sliceFileToLocalStorage,
} from "@/utils/helper";
import fetcher from "@/utils/fetcher";
import IndexedDBService from "@/utils/indexedDBTool";

const Index = () => {
  const [percent, setPercent] = useState(0);
  const [acObj, setAcObj] = useState<any>(null);

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
    const CHUNK_SIZE = 1024 * 1024 * 4;
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

  const downloadFile = async () => {
    // filename 1685954304236bLHo15gsZrbio7FoieR9zHw3vgYT0d1K5ZkffXOPFLo=.png

    try {
      const res = await fetch(
        "http://127.0.0.1:8888/api/fileStream/1685954304236bLHo15gsZrbio7FoieR9zHw3vgYT0d1K5ZkffXOPFLo=.png",
        {
          headers: {
            "Response-Type": "blob",
          },
        },
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

  return (
    <>
      <Upload beforeUpload={isFileExist} showUploadList={false}>
        <Button type="primary">大文件分片</Button>
      </Upload>
      <Upload beforeUpload={sliceToLocalStorage} showUploadList={false}>
        <Button type="primary">sliceToLocalStorage</Button>
      </Upload>
      <Button onClick={pauseUpload}>暂停</Button>
      <Button onClick={recoverUpload}>恢复</Button>
      <Progress status="active" percent={percent} />
      <Button onClick={downloadFile}>下载文件</Button>
    </>
  );
};

export default Index;
