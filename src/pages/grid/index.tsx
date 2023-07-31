import React, { useEffect, useState } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";
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
import GridItem from "@/components/GridItem";
import fetcher from "@/utils/fetcher";

const ResponsiveReactGridLayout = WidthProvider(GridLayout);

const Index = () => {
  const [layout, setLayout] = useState([
    { i: "a", x: 0, y: 0, w: 5, h: 5, type: "bar" },
    { i: "b", x: 0, y: 0, h: 5, w: 5, type: "line" },
  ]);
  const [chartInst, setChartInst] = useState<any>({});

  useEffect(() => {
    // getDashboardDetail().then(() => {
    //   saveDashboardDetail(layout).then(() => {
    //     getDashboardDetail();
    //   });
    // });
  }, []);

  const getDashboardDetail = async () => {
    const res = await fetcher("/82");
    console.log("getDashboardDetail", res);
  };

  const saveDashboardDetail = async (meta: any[]) => {
    const res = await fetcher("/saveDashboard", {
      method: "POST",
      body: JSON.stringify({ meta }),
    });
    console.log("saveDashboardDetail", res);
  };

  const onLayoutChange = (layout: any) => {
    console.log("onLayoutChange", layout);
    setLayout(layout);
  };

  const addChart = (type: number) => {
    setLayout((c) => [
      ...c,
      {
        i: Math.random().toString(),
        x: 5,
        y: 0,
        w: 5,
        h: 5,
        type: type % 2 ? "bar" : "line",
      },
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
            <Image src={d} alt="" onClick={() => addChart(i)} />
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
