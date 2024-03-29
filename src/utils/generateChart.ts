import * as echarts from "echarts";

export const generateChart = (dom: HTMLElement, type: string) => {
  console.log("generate chart");
  const chart = echarts.init(dom);

  const options = {
    xAxis: {
      type: "category",
      autosize: true,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
      autosize: true,
    },
    series: [
      {
        data: [150, 200, 140, 120, 300, 177, 222],
        type,
      },
    ],
    autosize: true,
  };
  chart.setOption(options);
  return chart;
};
