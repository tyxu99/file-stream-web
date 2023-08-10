import * as d3 from "d3";
import { useState } from "react";
import LinePlot from "@/components/D3Comps/LinePlot";
import Axis from "@/components/D3Comps/axis";

const Index = () => {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  function onMouseMove(event: any) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }

  return (
    <div onMouseMove={onMouseMove}>
      <LinePlot data={data} />
      <Axis />
    </div>
  );
};

export default Index;
