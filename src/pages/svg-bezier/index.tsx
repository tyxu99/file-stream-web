import styles from "./index.module.scss";
import { svgLine } from "@/utils/helper";
import { useEffect, useState } from "react";

const Index = () => {
  const [data, setData] = useState([
    {
      id: 1,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      color: "deepskyblue",
    },
    {
      id: 2,
      x: 500,
      y: 300,
      width: 120,
      height: 80,
      color: "deeppink",
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
          isCursorInBlock(e.clientX, e.clientY);
          console.log(store);
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
          const pointedBlock = {
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
          console.log("=========", [...notPointedBlockArr, pointedBlock]);
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
  }, []);

  const isCursorInBlock = (x: number, y: number) => {
    console.log(data);
    data.forEach((d) => {
      store["isPointerIn" + d.id] = false;
      if (!(x < d.x || x > d.x + d.width || y < d.y || y > d.y + d.height)) {
        store["isPointerIn" + d.id] = true;
      }
    });
  };

  return (
    <div className={styles.svgBezier}>
      {data.map((d) => (
        <div
          key={d.id}
          style={{
            width: d.width,
            height: d.height,
            background: d.color,
            transform: `translate(${d.x}px, ${d.y}px)`,
          }}
        ></div>
      ))}
      {svgLine(data)}
    </div>
  );
};

export default Index;
