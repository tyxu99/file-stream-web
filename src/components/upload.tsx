import { Button, Upload, Progress } from "antd";
import { useState } from "react";
import { getFileId, sliceFileToLocalStorage } from "@/utils/helper";
import fetcher from "@/utils/fetcher";

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

  const recoverUpload = () => {};

  const sliceToLocalStorage = (file: File) => {
    sliceFileToLocalStorage(file, (fileId: string, chunks: number) => {
      for (let i = 0; i < chunks; i++) {
        const t = localStorage.getItem(fileId + "-chunk-" + i);
        const item = JSON.parse(t);
        console.log(item);
      }
    });
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
    </>
  );
};

export default Index;
