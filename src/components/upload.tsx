import { Button, Upload } from "antd";

const Index = () => {
  const onBeforeUpload = (file: any) => {
    const fd = new FormData();
    fd.append("name", file.name);
    fd.append("current", "5");
    fd.append("file", file);
    console.log(fd);

    fetch("http://127.0.0.1:8888/api/upload", {
      method: "POST",
      body: fd,
    })
      .then((res) => {
        if (res.ok) {
          console.log("success");
          return res.json();
        } else {
          console.log("error", res);
        }
      })
      .then((res) => {
        console.log("res is", res);
      });
  };

  const uploadChunks = async (file: File) => {
    const CHUNK_SIZE = 2 * 1024 * 1024; // 10MB
    const fileSize = file.size;

    const chunks = Math.ceil(fileSize / CHUNK_SIZE);
    let start = 0;
    let chunkIndex = 0;
    while (start < fileSize) {
      const chunk = file.slice(start, start + CHUNK_SIZE);
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("filename", file.name);
      formData.append("current", chunkIndex + "");

      try {
        const res = await fetch("http://127.0.0.1:8888/api/uploadHugeFile", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        start += CHUNK_SIZE;
        chunkIndex++;
      } catch (error) {
        console.log("Error uploading chunk", error);
        throw error;
      }
    }
    console.log("chunkIndex", chunkIndex, chunks);
  };

  return (
    <>
      <Upload beforeUpload={onBeforeUpload} showUploadList={false}>
        <Button type="primary">上传文件</Button>
      </Upload>
      <Upload beforeUpload={uploadChunks} showUploadList={false}>
        <Button type="primary">大文件分片</Button>
      </Upload>
    </>
  );
};

export default Index;
