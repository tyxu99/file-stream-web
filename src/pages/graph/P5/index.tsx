import dynamic from "next/dynamic";

const DynamicTemplate = dynamic(() => import("@/components/Template"), {
  ssr: false,
  loading: () => <div>Template loading</div>,
});

const Index = () => {
  return <DynamicTemplate />;
};

export default Index;
