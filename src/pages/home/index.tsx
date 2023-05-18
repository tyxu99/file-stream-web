import { Button, Upload } from "antd";

const Home = () => {
  const onFileChange = (file: any) => {
    console.log(file);
  };

  return (
    <Upload showUploadList={false} onChange={onFileChange}>
      <Button type="primary">选择文件</Button>
    </Upload>
  );
};

export default Home;
