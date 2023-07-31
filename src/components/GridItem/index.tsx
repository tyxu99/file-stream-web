import React, { forwardRef, useEffect } from "react";
import { generateChart } from "@/utils/generateChart";

// eslint-disable-next-line react/display-name
const Index = forwardRef(({ d, setChartInst }: any, ref) => {
  useEffect(() => {
    if (document) {
      const el = document.getElementById("panel-" + d.i);
      if (el) {
        const chart = generateChart(el, d.type);
        setChartInst("panel-" + d.i, chart);
      }
    }
  }, []);

  return (
    <div
      // @ts-ignore
      ref={ref}
      id={"panel-" + d.i}
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
});

export default Index;
