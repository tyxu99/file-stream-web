import { Button, Upload } from "antd";
import { useRef } from "react";

const GenerateFileId = () => {
  const countRef = useRef<number>(0);
  const workerRef = useRef<any>([]);

  const beforeUpload = (file: File) => {
    console.log(file);
    console.log(countRef);
    for (let i = 0; i < navigator.hardwareConcurrency; i++) {
      const wk = new Worker("/worker.js");
      workerRef.current.push(wk);
    }
    countRef.current++;
    workerRef.current[countRef.current % workerRef.current.length].postMessage({
      file,
    });
    workerRef.current[countRef.current % workerRef.current.length].onmessage =
      ({ data: { blob, name } }: any) => {
        console.log(name, "===>>", blob);
        // crypto.subtle.digest("SHA-256", blob).then((res) => {
        //   const enc = new TextDecoder("utf-8");
        //   const arr = new Uint8Array(res);
        //   console.log(name, "sha256>>>>>>>", arr.join(""));
        // });
      };
  };

  return (
    <Upload showUploadList={false} beforeUpload={beforeUpload}>
      <Button>选择文件</Button>
    </Upload>
  );
};

export default GenerateFileId;
