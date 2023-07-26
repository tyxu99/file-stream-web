import React, { forwardRef, useEffect } from "react";
import { generateChart } from "@/utils/generateChart";
import Chart from "@/components/Chart";

// eslint-disable-next-line react/display-name
const Index = forwardRef(({ d, setChartInst }: any, ref) => {
  console.log("rendered", d.i);
  return (
    // @ts-ignore
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <Chart id={"panel-" + d.i} setChartInst={setChartInst} />
    </div>
  );
});

export default Index;
