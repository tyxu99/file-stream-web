import * as d3 from "d3";
import { useState } from "react";
import Axis from "@/components/D3Comps/axis";
import Chord from "@/components/D3Comps/chord";
import DensityContours from "@/components/D3Comps/densityContours";

const Index = () => {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <Axis />
      <Chord />
      <DensityContours />
    </div>
  );
};

export default Index;
