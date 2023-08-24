import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      console.log(e.code, e.key);
    });
  }, []);

  return <div>snake</div>;
};

export default Index;
