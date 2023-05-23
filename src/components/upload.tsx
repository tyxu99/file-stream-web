import { Button, Upload, Progress } from "antd";
import { useState } from "react";

const Index = () => {
  const [percent, setPercent] = useState(0);
  const [acObj, setAcObj] = useState<any>(null);

  const isFileExist = async (file: File) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = () => {
      crypto.subtle
        .digest("SHA-256", fr.result as BufferSource)
        .then(async (res) => {
          const hashArray = Array.from(new Uint8Array(res)); // 将 ArrayBuffer 转换为 Uint8Array
          const hashBase64 = btoa(
            hashArray.reduce(
              (data, byte) => data + String.fromCharCode(byte),
              "",
            ),
          ).replace(/\/|\\/g, ""); // 将 Uint8Array 转换为 Base64 字符串
          console.log("File hash: ", hashBase64);
          try {
            const res = await fetch(
              "http://127.0.0.1:8888/api/isFileExist?filename=" +
                hashBase64 +
                file.name.slice(file.name.lastIndexOf(".")),
            );
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const { data } = await res.json();
            if (data) {
              console.log("file exist");
            } else {
              uploadChunks(file, hashBase64);
            }
          } catch (err) {
            console.log(err);
          }
        });
    };
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

  return (
    <>
      <Upload beforeUpload={isFileExist} showUploadList={false}>
        <Button type="primary">大文件分片</Button>
      </Upload>
      <Button onClick={pauseUpload}>暂停</Button>
      <Button onClick={recoverUpload}>恢复</Button>
      <Progress status="active" percent={percent} />
    </>
  );
};

export default Index;
