import React, { useEffect, useState } from "react";
import GridLayout, { WidthProvider, Responsive } from "react-grid-layout";
import styles from "./index.module.scss";
import CharmAtom from "@/asset/CharmAtom.svg";
import CharmChartBar from "@/asset/CharmChartBar.svg";
import CharmChartLine from "@/asset/CharmChartLine.svg";
import CharmHexagon from "@/asset/CharmHexagon.svg";
import CharmMap from "@/asset/CharmMap.svg";
import CharmTreeFir from "@/asset/CharmTreeFir.svg";
import ClarityPieChartLine from "@/asset/ClarityPieChartLine.svg";
import ClarityBellCurveLine from "@/asset/ClarityBellCurveLine.svg";
import Fa6RegularCompass from "@/asset/Fa6RegularCompass.svg";
import Image from "next/image";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import ReactGridLayout from "react-grid-layout";
import { generateChart } from "@/utils/generateChart";
import GridItem from "@/components/GridItem";

const ResponsiveReactGridLayout = WidthProvider(GridLayout);

const Index = () => {
  const [layout, setLayout] = useState([
    { i: "a", x: 0, y: 0, w: 5, h: 5 },
    { i: "b", x: 0, y: 0, h: 5, w: 5 },
  ]);
  const [chartInst, setChartInst] = useState<any>({});

  useEffect(() => {
    // if (document) {
    //   const el1 = document.getElementById("panel-a");
    //   const el2 = document.getElementById("panel-b");
    //   if (el1 && el2) {
    //     const chart = generateChart(el1);
    //     setChart(chart);
    //     // generateChart(el2);
    //   }
    // }
  }, []);

  const onLayoutChange = (layout: any) => {
    console.log("onLayoutChange", layout);
    setLayout(layout);
  };

  const addChart = (type: number) => {
    console.log(type === 1 ? "bar" : "line");
    setLayout((c) => [
      ...c,
      { i: Math.random().toString(), x: 5, y: 0, w: 5, h: 5 },
    ]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.configBar}>
        {[
          CharmAtom,
          CharmChartBar,
          CharmChartLine,
          CharmHexagon,
          CharmMap,
          CharmTreeFir,
          ClarityPieChartLine,
          ClarityBellCurveLine,
          Fa6RegularCompass,
        ].map((d, i) => (
          <div key={i}>
            <Image src={d} alt="" onClick={(d) => addChart(i)} />
          </div>
        ))}
      </div>

      <div style={{ width: 1920, height: "100%" }}>
        <ResponsiveReactGridLayout
          className="layout"
          width={1920}
          isResizable={true}
          isDraggable={true}
          containerPadding={[8, 8]}
          margin={[8, 8]}
          useCSSTransforms={true}
          cols={24}
          rowHeight={30}
          layout={layout}
          onResize={() => {
            for (let item of Object.keys(chartInst)) {
              chartInst[item].resize();
            }
          }}
          onLayoutChange={onLayoutChange}
        >
          {layout.map((d) => (
            // @ts-ignore
            <div key={d.i}>
              <GridItem
                d={d}
                setChartInst={(k: string, v: any) =>
                  setChartInst((c: any) => ({ ...c, [k]: v }))
                }
              />
            </div>
          ))}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
};

export default Index;
