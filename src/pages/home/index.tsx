import GenerateFileId from "@/components/generateFileId";
import Upload from "@/components/upload";

const Home = () => {
  const onFileChange = (file: any) => {
    console.log(file);
  };

  return (
    <>
      <GenerateFileId />
      <Upload />
    </>
  );
};

export default Home;
