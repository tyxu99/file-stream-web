import { Button, Upload } from "antd";

const Index = () => {
  const onBeforeUpload = (file: any) => {
    console.log("ffffffffffile", file);
    const fd = new FormData();
    fd.append("filename", file.name);
    fd.append("fileData", file);

    fetch("http://127.0.0.1:8888/api/uploadFile", {
      method: "POST",
      body: fd,
    })
      .then((res) => {
        if (res.ok) {
          console.log("success");
          return res.json();
        } else {
          console.log("error");
        }
      })
      .then((res) => {
        console.log("res is", res);
      });
  };

  return (
    <Upload beforeUpload={onBeforeUpload} showUploadList={false}>
      <Button type="primary">上传文件</Button>
    </Upload>
  );
};

export default Index;
