import styles from "./index.module.scss";
import { useState } from "react";

const forestGreen: any = {
  "1": "#dffbdd",
  "2": "#bff6bc",
  "3": "#8bec89",
  "4": "#51da4e",
  "5": "#27b724",
  "6": "#1ba019",
  "7": "#197d18",
  "8": "#196318",
  "9": "#165116",
  "10": "#062d07",
};

const NativeDrag = () => {
  const [left, setLeft] = useState([
    { id: "1", text: "111" },
    { id: "2", text: "222" },
    { id: "3", text: "333" },
    { id: "4", text: "444" },
    { id: "5", text: "555" },
  ]);
  const [right, setRight] = useState([
    { id: "6", text: "666" },
    { id: "7", text: "777" },
    { id: "8", text: "888" },
    { id: "9", text: "999" },
    { id: "10", text: "101010" },
  ]);

  const [side, setSide] = useState("left");
  const [draggedId, setDraggedId] = useState("0");
  const [draggedIndex, setDraggedIndex] = useState(-1);
  const [dragOverId, setDragOverId] = useState<any>(null);

  const onDragStartHandler = (type: string, i: number, e: any) => {
    setSide(type);
    setDraggedId(e.target.id);
    setDraggedIndex(i);
  };

  const onDragOverHandler = (e: any) => {
    e.preventDefault();
    setDragOverId(e.target.id);
    if (e.target.id !== dragOverId) {
      // console.log("draggedId", draggedId, "dragOverId", e.target.id);
      const leftSideId = left.map((d) => d.id).concat("left-container");
      const rightSideId = right.map((d) => d.id).concat("right-container");
      const data = structuredClone(side === "left" ? left : right);
      if (leftSideId.includes(e.target.id)) {
        if (e.target.id === "left-container") {
          const t: any = data.filter((d) => d.id !== draggedId);
          t.push(data.find((d) => d.id === draggedId));
          setLeft(t);
        } else {
          // TODO
          const targetItem = data.find((d) => d.id === e.target.id);
          const targetIndex = data
            .map((d) => JSON.stringify(d))
            .indexOf(JSON.stringify(targetItem));
          const draggedItem = data.find((d) => d.id === draggedId);
          data[targetIndex] = draggedItem;
          data[draggedIndex] = targetItem;
          setLeft(data);
          console.log(targetIndex, targetItem, draggedItem);
        }
      }
      if (rightSideId.includes(e.target.id)) {
      }
    }
  };

  const onDropHandler = (e: any) => {
    e.preventDefault();
    // const left =
    setDraggedId("0");
    setDragOverId(null);
    console.log("onDropHandler", e.target.id);
  };

  return (
    <div className={styles.wrapper}>
      <div
        id="left-container"
        className={styles.left}
        onDrop={onDropHandler}
        onDragOver={onDragOverHandler}
      >
        {left.map((d, i) => (
          <div
            id={d.id}
            key={d.id}
            draggable={true}
            onDragStart={(e) => onDragStartHandler("left", i, e)}
            style={{
              opacity: draggedId === d.id ? 0.4 : 1,
              background: forestGreen[d.id],
            }}
          >
            {d.text}
          </div>
        ))}
      </div>
      <div
        id="right-container"
        className={styles.right}
        onDragOver={onDragOverHandler}
        onDrop={onDropHandler}
      >
        {right.map((d) => (
          <div
            id={d.id}
            key={d.id}
            draggable={true}
            onDragStart={(e) => onDragStartHandler("right", e)}
            style={{
              opacity: draggedId === d.id ? 0.4 : 1,
              background: forestGreen[d.id],
            }}
          >
            {d.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NativeDrag;
