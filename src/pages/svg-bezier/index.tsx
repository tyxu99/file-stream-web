import styles from "./index.module.scss";
import { svgLine } from "@/utils/helper";
import { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragItem from "@/components/DNDItem/Drag";
import DropItem from "@/components/DNDItem/Drop";

const Index = () => {
  const [data, setData] = useState([
    {
      id: 1,
      x: 100,
      y: 300,
      width: 100,
      height: 100,
      color: "deepskyblue",
    },
    {
      id: 2,
      pid: 1,
      x: 300,
      y: 100,
      width: 120,
      height: 80,
      color: "deeppink",
    },
    {
      id: 3,
      pid: 1,
      x: 300,
      y: 400,
      width: 100,
      height: 100,
      color: "lightyellow",
    },
    {
      id: 4,
      pid: 3,
      x: 600,
      y: 400,
      width: 100,
      height: 100,
      color: "lightblue",
    },
    {
      id: 6,
      pid: 3,
      x: 600,
      y: 600,
      width: 100,
      height: 100,
      color: "#8FEF69FF",
    },
    {
      id: 5,
      pid: 2,
      x: 600,
      y: 100,
      width: 100,
      height: 100,
      color: "lightgreen",
    },
  ]);

  const store: any = {};

  useEffect(() => {
    if (document) {
      document.addEventListener(
        "mousedown",
        (e: any) => {
          const { left, top } = e.target.getBoundingClientRect();
          store.clientX = e.clientX;
          store.clientY = e.clientY;
          // console.log(e.clientX, left, e.clientY, top);
          isCursorInBlock(e.clientX - 200, e.clientY);
          // console.log(store);
        },
        { passive: false },
      );

      document.addEventListener(
        "mousemove",
        (e) => {
          // console.log("mousemove", e.clientX, e.clientY);
          const pointed = data
            .map((d) => "isPointerIn" + d.id)
            .find((d) => store[d]);
          if (!pointed) return;
          const pointedBlock: any = {
            ...data.find((d) => d.id + "" === pointed.slice(11)),
          };
          const notPointedBlockArr = data.filter(
            (d) => d.id + "" !== pointed.slice(11),
          );
          // console.log(pointedBlock);
          // console.log(e.clientX - store.clientX, e.clientY - store.clientY);
          const distanceX = e.clientX - store.clientX;
          const distanceY = e.clientY - store.clientY;
          pointedBlock.x += distanceX;
          pointedBlock.y += distanceY;
          // console.log("=========", [...notPointedBlockArr, pointedBlock]);
          setData([...notPointedBlockArr, pointedBlock]);
        },
        { passive: false },
      );

      document.addEventListener(
        "mouseup",
        () => {
          data
            .map((d) => "isPointerIn" + d.id)
            .forEach((d) => (store[d] = false));
        },
        { passive: false },
      );
    }
  }, [JSON.stringify(data)]);

  const isCursorInBlock = (x: number, y: number) => {
    // console.log(data);
    data.forEach((d) => {
      store["isPointerIn" + d.id] = !(
        x < d.x ||
        x > d.x + d.width ||
        y < d.y ||
        y > d.y + d.height
      );
    });
  };

  const [draggedLabel, setDraggedLabel] = useState<any>(null);
  const [dragEntered, setDragEntered] = useState(false);

  const previewDropPosition = () => {
    if (dragEntered) return;
    setDragEntered(true);
    const pidArr = Array.from(new Set(data.map((d) => d.pid))).filter((d) => d);
    const noChild = data.filter((d) => !pidArr.includes(d.id));
    console.log(noChild);
    const possiblePosition = noChild.map((d) => ({
      ...d,
      id: d.id + "1",
      pid: d.id,
      x: d.x + 300,
      color: "#eee",
      dashed: true,
    }));
    setData((c) => [...c, ...possiblePosition]);
  };

  const calculatePosition = (x, y) => {
    const dashedArr = data
      .filter((d: any) => d.dashed)
      .map((d) => ({ id: d.id, x: d.x + d.width / 2, y: d.y + d.height / 2 }));
    const pos = dashedArr
      .map((d) => ({
        id: d.id,
        value: (d.x - x) ** 2 + (d.y - y) ** 2,
      }))
      .sort((a, b) => a.value - b.value)[0];
    console.log(pos);
    const notDashed = data.filter((d) => !d.dashed);
    const final = data.find((d) => d.id === pos.id);
    setDragEntered(false);
    setData([...notDashed, { ...final, dashed: false }]);
  };

  return (
    // <DndProvider backend={HTML5Backend}>
    <div className={styles.svgBezier}>
      <div className={styles.confBar}>
        {["AAA", "BBB", "CCC", "DDD", "EEE", "FFF"].map((d, i) => (
          // <DragItem key={i} id={d + i}>
          <div
            className={styles.inner}
            key={i}
            draggable={true}
            // onDrag={(e) => console.log(e.clientX, e.clientY)}
            onDragStart={() => {
              setDraggedLabel(d);
            }}
            onDragEnd={() => {
              setDragEntered(false);
              setData((c) => c.filter((d) => !d.dashed));
            }}
          >
            <div>{d}</div>
            <div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          // </DragItem>
        ))}
      </div>
      <div
        className={styles.confGraph}
        onDragEnter={previewDropPosition}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          console.log("onDrop", e.clientX, e.clientY);
          calculatePosition(e.clientX - 200, e.clientY);
        }}
      >
        {data.map((d: any) => (
          // <DropItem key={d.id}>
          <div
            key={d.id}
            style={{
              width: d.width,
              height: d.height,
              background: d.color,
              transform: `translate(${d.x}px, ${d.y}px)`,
              border: `1px ${d.dashed ? "dashed" : "solid"} ${
                d.dashed ? "red" : "black"
              }`,
            }}
          ></div>
          // </DropItem>
        ))}
        {svgLine(data)}
      </div>
    </div>
    // </DndProvider>
  );
};

export default Index;
