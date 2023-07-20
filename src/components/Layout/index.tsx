import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Content from "@/components/Content";

const Index = ({ children }: any) => {
  return (
    <>
      <Header />
      <div style={{ display: "flex", height: "calc(100% - 60px)" }}>
        <Menu></Menu>
        <Content>{children}</Content>
      </div>
    </>
  );
};

export default Index;
