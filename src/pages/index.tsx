import { Upload, Button } from "antd";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import fetcher from "@/utils/fetcher";
import { generateFileId } from "../utils/helper";
import { useEffect, useState } from "react";
import md5 from "md5";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let count = 0;
  let current = 0;

  const [wkArr, setWkArr] = useState<any>([]);
  useEffect(() => {
    const t = [];
    for (let i = 0; i < navigator.hardwareConcurrency * 4; i++) {
      const wk = new Worker("/worker.js");
      t.push(wk);
    }
    console.log(t);
    setWkArr([...t]);
  }, []);
  const beforeUpload = (file: File) => {
    // generateFileId(file).then((res) => console.log(res));
    // console.log(++count, file);
    count++;

    // const wk = new Worker("/worker.js");
    // wk.postMessage({ file });
    // wk.onmessage = (e) => {
    //   console.log("beforeupload", md5(e.data));
    // };
    wkArr[count % wkArr.length].postMessage({ file });
    wkArr[count % wkArr.length].onmessage = ({ data: { blob, name } }) => {
      // console.log("blob", blob);
      console.log(name, ">>>>>", blob);
      // crypto.subtle.digest("SHA-256", blob).then((res) => {
      //   // const enc = new TextDecoder("utf-8");
      //
      //   const arr = new Uint8Array(res);
      //
      //   console.log(name, "sha256>>>>>>", arr.join(""));
      // });
    };
  };
  const fileChangeHandler = (file: any) => {
    // console.log("onchange", file);
    // fileList = file.fileList.length;
    // console.log(file);
    // file.fileList.forEach((d: File) => {
    //   generateFileId(d).then((res: string) => console.log(res));
    // });
  };

  return (
    <>
      <main className={styles.main}>
        <Upload
          showUploadList={false}
          directory
          beforeUpload={beforeUpload}
          onChange={fileChangeHandler}
        >
          <Button>选择文件</Button>
        </Upload>
      </main>
    </>
  );
}
