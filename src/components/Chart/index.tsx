import { useEffect } from "react";
import { generateChart } from "@/utils/generateChart";

const Index = ({ id, setChartInst }: { id: string; setChartInst: any }) => {
  useEffect(() => {
    if (document) {
      const el = document.getElementById(id);
      if (el) {
        const chart = generateChart(el);
        setChartInst(id, chart);
      }
    }
  }, []);
  return <div id={id} style={{ width: "100%", height: "100%" }}></div>;
};

export default Index;
