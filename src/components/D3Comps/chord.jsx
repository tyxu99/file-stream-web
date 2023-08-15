import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Chord = () => {
  const height = 600,
    width = 600,
    outerRadius = Math.min(width, height) * 0.5 - 30,
    innerRadius = outerRadius - 20,
    data = Object.assign(
      [
        [11975, 5871, 8916, 2868],
        [1951, 10048, 2060, 6171],
        [8010, 16145, 8090, 8045],
        [1013, 990, 940, 6907],
      ],
      {
        names: ["black", "blond", "brown", "red"],
        colors: ["#000000", "#ffdd89", "#957244", "#f26223"],
      },
    ),
    { names, colors } = data,
    sum = d3.sum(data.flat()),
    tickStep = d3.tickStep(0, sum, 100),
    tickStepMajor = d3.tickStep(0, sum, 20),
    formatValue = d3.formatPrefix(",.0", tickStep);

  const chord = d3
    .chord()
    .padAngle(20 / innerRadius)
    .sortSubgroups(d3.descending);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const ribbon = d3.ribbon().radius(innerRadius);

  const chordRef = useRef();
  useEffect(() => {
    const svg = d3.select(chordRef.current);

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("styles", "max-width: 100%; height: auto; font-size: 10px;");

    const chords = chord(data);

    const group = svg.append("g").selectAll().data(chords.groups).join("g");

    group
      .append("path")
      .attr("fill", (d) => colors[d.indent])
      .attr("d", arc)
      .append("title")
      .text((d) => `${d.value.toLocaleString("en-US")} ${names[d.index]}`);

    const groupTicks = (d, step) => {
      const k = (d.endAngle - d.startAngle) / d.value;
      return d3
        .range(0, d.value, step)
        .map((v) => ({ value: v, angle: v * k + d.startAngle }));
    };

    const groupTick = group
      .append("g")
      .selectAll()
      .data((d) => groupTicks(d, tickStep))
      .join("g")
      .attr(
        "transform",
        (d) =>
          `rotate(${
            (d.angle * 180) / Math.PI - 90
          }) translate(${outerRadius}, 0)`,
      );

    groupTick.append("line").attr("stroke", "currentColor").attr("x2", 6);

    groupTick
      .filter((d) => d.value % tickStepMajor === 0)
      .append("text")
      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", (d) =>
        d.angle > Math.PI ? "rotate(180) translate(-16)" : null,
      )
      .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : null))
      .text((d) => formatValue(d.value));

    svg
      .append("g")
      .attr("fill-opacity", 0.7)
      .selectAll()
      .data(chords)
      .join("path")
      .attr("d", ribbon)
      .attr("fill", (d) => colors[d.target.index])
      .attr("stroke", "white")
      .append("title")
      .text(
        (d) =>
          `${d.source.value.toLocaleString("en-US")} ${
            names[d.source.index]
          } → ${names[d.target.index]}${
            d.source.index !== d.target.index
              ? `\n${d.target.value.toLocaleString("en-US")} ${
                  names[d.target.index]
                } → ${names[d.source.index]}`
              : ``
          }`,
      );
  });

  return <svg ref={chordRef} id="d3-chord"></svg>;
};

export default Chord;
