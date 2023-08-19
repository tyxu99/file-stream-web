import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const Axis = () => {
  const height = 400,
    width = 600,
    marginBottom = 20,
    marginTop = 20,
    marginLeft = 40,
    marginRight = 20;

  const [data, setData] = useState(() => d3.ticks(2, 10, 200).map(Math.cos));

  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);

  useEffect(() => {
    d3.select(gx.current)
      // .transition()
      // .duration(750)
      .call(d3.axisBottom(x));
  }, [gx, x]);
  useEffect(() => {
    d3.select(gy.current)
      // .transition()
      // .duration(750)
      .call(d3.axisLeft(y));
  }, [gy, y]);

  const onMouseMove = (event) => {
    const [x, y] = d3.pointer(event);
    // console.log(event.clientX, event.clientY, x, y);
    // setData(data.slice(-200).concat(Math.atan2(x, y)));
  };

  return (
    <svg onMouseMove={onMouseMove} width={width} height={height} id="d3-axis">
      <g ref={gx} transform={`translate(0, ${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft}, 0)`} />
      <g fill="white" stroke="red" strokeWidth="1.5">
        {data.map((d, i) => {
          // console.log(i, d, x(i), y(d));
          return <circle key={i} cx={x(i)} cy={y(d)} r={1.5} />;
        })}
      </g>
      <path fill="none" stroke="green" strokeWidth="1" d={line(data)} />
    </svg>
  );
};

export default Axis;
