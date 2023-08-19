import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { utcHour } from "d3";

const DensityContours = () => {
  const contourRef = useRef();

  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const faithful = Object.assign(
    [
      { eruptions: 3.6, waiting: 79 },
      { eruptions: 1.8, waiting: 54 },
      { eruptions: 3.333, waiting: 74 },
      { eruptions: 2.283, waiting: 62 },
      { eruptions: 4.533, waiting: 85 },
      { eruptions: 2.883, waiting: 55 },
      { eruptions: 4.7, waiting: 88 },
      { eruptions: 3.6, waiting: 85 },
      { eruptions: 1.95, waiting: 51 },
      { eruptions: 4.35, waiting: 85 },
      { eruptions: 1.833, waiting: 54 },
      { eruptions: 3.917, waiting: 84 },
      { eruptions: 4.2, waiting: 78 },
      { eruptions: 1.75, waiting: 47 },
      { eruptions: 4.7, waiting: 83 },
      { eruptions: 2.167, waiting: 52 },
      { eruptions: 1.75, waiting: 62 },
      { eruptions: 4.8, waiting: 84 },
      { eruptions: 1.6, waiting: 52 },
      { eruptions: 4.25, waiting: 79 },
      { eruptions: 1.8, waiting: 51 },
      { eruptions: 1.75, waiting: 47 },
      { eruptions: 3.45, waiting: 78 },
      { eruptions: 3.067, waiting: 69 },
      { eruptions: 4.533, waiting: 74 },
      { eruptions: 3.6, waiting: 83 },
      { eruptions: 1.967, waiting: 55 },
      { eruptions: 4.083, waiting: 76 },
      { eruptions: 3.85, waiting: 78 },
      { eruptions: 4.433, waiting: 79 },
      { eruptions: 4.3, waiting: 73 },
      { eruptions: 4.467, waiting: 77 },
      { eruptions: 3.367, waiting: 66 },
      { eruptions: 4.033, waiting: 80 },
      { eruptions: 3.833, waiting: 74 },
      { eruptions: 2.017, waiting: 52 },
      { eruptions: 1.867, waiting: 48 },
      { eruptions: 4.833, waiting: 80 },
      { eruptions: 1.833, waiting: 59 },
      { eruptions: 4.783, waiting: 90 },
      { eruptions: 4.35, waiting: 80 },
      { eruptions: 1.883, waiting: 58 },
      { eruptions: 4.567, waiting: 84 },
      { eruptions: 1.75, waiting: 58 },
      { eruptions: 4.533, waiting: 73 },
      { eruptions: 3.317, waiting: 83 },
      { eruptions: 3.833, waiting: 64 },
      { eruptions: 2.1, waiting: 53 },
      { eruptions: 4.633, waiting: 82 },
      { eruptions: 2, waiting: 59 },
      { eruptions: 4.8, waiting: 75 },
      { eruptions: 4.716, waiting: 90 },
      { eruptions: 1.833, waiting: 54 },
      { eruptions: 4.833, waiting: 80 },
      { eruptions: 1.733, waiting: 54 },
      { eruptions: 4.883, waiting: 83 },
      { eruptions: 3.717, waiting: 71 },
      { eruptions: 1.667, waiting: 64 },
      { eruptions: 4.567, waiting: 77 },
      { eruptions: 4.317, waiting: 81 },
      { eruptions: 2.233, waiting: 59 },
      { eruptions: 4.5, waiting: 84 },
      { eruptions: 1.75, waiting: 48 },
      { eruptions: 4.8, waiting: 82 },
      { eruptions: 1.817, waiting: 60 },
      { eruptions: 4.4, waiting: 92 },
      { eruptions: 4.167, waiting: 78 },
      { eruptions: 4.7, waiting: 78 },
      { eruptions: 2.067, waiting: 65 },
      { eruptions: 4.7, waiting: 73 },
      { eruptions: 4.033, waiting: 82 },
      { eruptions: 1.967, waiting: 56 },
      { eruptions: 4.5, waiting: 79 },
      { eruptions: 4, waiting: 71 },
      { eruptions: 1.983, waiting: 62 },
      { eruptions: 5.067, waiting: 76 },
      { eruptions: 2.017, waiting: 60 },
      { eruptions: 4.567, waiting: 78 },
      { eruptions: 3.883, waiting: 76 },
      { eruptions: 3.6, waiting: 83 },
      { eruptions: 4.133, waiting: 75 },
      { eruptions: 4.333, waiting: 82 },
      { eruptions: 4.1, waiting: 70 },
      { eruptions: 2.633, waiting: 65 },
      { eruptions: 4.067, waiting: 73 },
      { eruptions: 4.933, waiting: 88 },
      { eruptions: 3.95, waiting: 76 },
      { eruptions: 4.517, waiting: 80 },
      { eruptions: 2.167, waiting: 48 },
      { eruptions: 4, waiting: 86 },
      { eruptions: 2.2, waiting: 60 },
      { eruptions: 4.333, waiting: 90 },
      { eruptions: 1.867, waiting: 50 },
      { eruptions: 4.817, waiting: 78 },
      { eruptions: 1.833, waiting: 63 },
      { eruptions: 4.3, waiting: 72 },
      { eruptions: 4.667, waiting: 84 },
      { eruptions: 3.75, waiting: 75 },
      { eruptions: 1.867, waiting: 51 },
      { eruptions: 4.9, waiting: 82 },
      { eruptions: 2.483, waiting: 62 },
      { eruptions: 4.367, waiting: 88 },
      { eruptions: 2.1, waiting: 49 },
      { eruptions: 4.5, waiting: 83 },
      { eruptions: 4.05, waiting: 81 },
      { eruptions: 1.867, waiting: 47 },
      { eruptions: 4.7, waiting: 84 },
      { eruptions: 1.783, waiting: 52 },
      { eruptions: 4.85, waiting: 86 },
      { eruptions: 3.683, waiting: 81 },
      { eruptions: 4.733, waiting: 75 },
      { eruptions: 2.3, waiting: 59 },
      { eruptions: 4.9, waiting: 89 },
      { eruptions: 4.417, waiting: 79 },
      { eruptions: 1.7, waiting: 59 },
      { eruptions: 4.633, waiting: 81 },
      { eruptions: 2.317, waiting: 50 },
      { eruptions: 4.6, waiting: 85 },
      { eruptions: 1.817, waiting: 59 },
      { eruptions: 4.417, waiting: 87 },
      { eruptions: 2.617, waiting: 53 },
      { eruptions: 4.067, waiting: 69 },
      { eruptions: 4.25, waiting: 77 },
      { eruptions: 1.967, waiting: 56 },
      { eruptions: 4.6, waiting: 88 },
      { eruptions: 3.767, waiting: 81 },
      { eruptions: 1.917, waiting: 45 },
      { eruptions: 4.5, waiting: 82 },
      { eruptions: 2.267, waiting: 55 },
      { eruptions: 4.65, waiting: 90 },
      { eruptions: 1.867, waiting: 45 },
      { eruptions: 4.167, waiting: 83 },
      { eruptions: 2.8, waiting: 56 },
      { eruptions: 4.333, waiting: 89 },
      { eruptions: 1.833, waiting: 46 },
      { eruptions: 4.383, waiting: 82 },
      { eruptions: 1.883, waiting: 51 },
      { eruptions: 4.933, waiting: 86 },
      { eruptions: 2.033, waiting: 53 },
      { eruptions: 3.733, waiting: 79 },
      { eruptions: 4.233, waiting: 81 },
      { eruptions: 2.233, waiting: 60 },
      { eruptions: 4.533, waiting: 82 },
      { eruptions: 4.817, waiting: 77 },
      { eruptions: 4.333, waiting: 76 },
      { eruptions: 1.983, waiting: 59 },
      { eruptions: 4.633, waiting: 80 },
      { eruptions: 2.017, waiting: 49 },
      { eruptions: 5.1, waiting: 96 },
      { eruptions: 1.8, waiting: 53 },
      { eruptions: 5.033, waiting: 77 },
      { eruptions: 4, waiting: 77 },
      { eruptions: 2.4, waiting: 65 },
      { eruptions: 4.6, waiting: 81 },
      { eruptions: 3.567, waiting: 71 },
      { eruptions: 4, waiting: 70 },
      { eruptions: 4.5, waiting: 81 },
      { eruptions: 4.083, waiting: 93 },
      { eruptions: 1.8, waiting: 53 },
      { eruptions: 3.967, waiting: 89 },
      { eruptions: 2.2, waiting: 45 },
      { eruptions: 4.15, waiting: 86 },
      { eruptions: 2, waiting: 58 },
      { eruptions: 3.833, waiting: 78 },
      { eruptions: 3.5, waiting: 66 },
      { eruptions: 4.583, waiting: 76 },
      { eruptions: 2.367, waiting: 63 },
      { eruptions: 5, waiting: 88 },
      { eruptions: 1.933, waiting: 52 },
      { eruptions: 4.617, waiting: 93 },
      { eruptions: 1.917, waiting: 49 },
      { eruptions: 2.083, waiting: 57 },
      { eruptions: 4.583, waiting: 77 },
      { eruptions: 3.333, waiting: 68 },
      { eruptions: 4.167, waiting: 81 },
      { eruptions: 4.333, waiting: 81 },
      { eruptions: 4.5, waiting: 73 },
      { eruptions: 2.417, waiting: 50 },
      { eruptions: 4, waiting: 85 },
      { eruptions: 4.167, waiting: 74 },
      { eruptions: 1.883, waiting: 55 },
      { eruptions: 4.583, waiting: 77 },
      { eruptions: 4.25, waiting: 83 },
      { eruptions: 3.767, waiting: 83 },
      { eruptions: 2.033, waiting: 51 },
      { eruptions: 4.433, waiting: 78 },
      { eruptions: 4.083, waiting: 84 },
      { eruptions: 1.833, waiting: 46 },
      { eruptions: 4.417, waiting: 83 },
      { eruptions: 2.183, waiting: 55 },
      { eruptions: 4.8, waiting: 81 },
      { eruptions: 1.833, waiting: 57 },
      { eruptions: 4.8, waiting: 76 },
      { eruptions: 4.1, waiting: 84 },
      { eruptions: 3.966, waiting: 77 },
      { eruptions: 4.233, waiting: 81 },
      { eruptions: 3.5, waiting: 87 },
      { eruptions: 4.366, waiting: 77 },
      { eruptions: 2.25, waiting: 51 },
      { eruptions: 4.667, waiting: 78 },
    ],
    { columns: ["eruptions", "waiting"] },
  );

  const x = d3
    .scaleLinear()
    .domain(d3.extent(faithful, (d) => d.waiting))
    .nice()
    .rangeRound([marginLeft, width - marginRight]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(faithful, (d) => d.eruptions))
    .nice()
    .rangeRound([height - marginBottom, marginTop]);

  // Compute the density contours.
  const contours = d3
    .contourDensity()
    .x((d) => x(d.waiting))
    .y((d) => y(d.eruptions))
    .size([width, height])
    .bandwidth(30)
    .thresholds(30)(faithful);

  useEffect(() => {
    const svg = d3.select(contourRef.current);

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      // append axes
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("y", -3)
          .attr("dy", null)
          .attr("font-weight", "bold")
          .text("Idle (min.)"),
      )
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Erupting (min.)"),
      )
      // append contours
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .selectAll()
      .data(contours)
      .join("path")
      .attr("stroke-width", (d, i) => (i % 5 ? 0.25 : 1))
      .attr("d", d3.geoPath())
      // append dots
      .append("g")
      .attr("stroke", "white")
      .selectAll()
      .data(faithful)
      .join("circle")
      .attr("cx", (d) => x(d.waiting))
      .attr("cy", (d) => y(d.eruptions))
      .attr("r", 2);
  });

  return <svg ref={contourRef}></svg>;
};

export default DensityContours;
