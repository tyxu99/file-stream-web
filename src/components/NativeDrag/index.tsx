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

  const [dragFrom, setDragFrom] = useState("left");
  const [draggedId, setDraggedId] = useState("0");
  const [draggedIndex, setDraggedIndex] = useState(-1);
  const [draggedItem, setDraggedItem] = useState({});
  const [dragOverId, setDragOverId] = useState<any>(null);

  const onDragStartHandler = (type: string, i: number, e: any) => {
    setDragFrom(type);
    setDraggedId(e.target.id);
    setDraggedIndex(i);
    const t = type === "left" ? left : right;
    setDraggedItem(t[i]);
  };

  const onDragOverHandler = (e: any) => {
    e.preventDefault();
    setDragOverId(e.target.id);
  };

  const onDropHandler = (e: any) => {
    e.preventDefault();
    afterDrop(e.target.id);
  };

  const afterDrop = (targetId: string) => {
    const leftIds = left.map((d) => d.id);
    const rightIds = right.map((d) => d.id);
    const leftBak: any = structuredClone(left);
    const rightBak: any = structuredClone(right);
    if (dragFrom === "left") {
      if (targetId === "left-container") {
        leftBak.splice(draggedIndex, 1);
        leftBak.push(draggedItem);
        setLeft(leftBak);
      }
      if (leftIds.includes(targetId) && draggedId !== targetId) {
        const targetIndex = leftIds.indexOf(targetId);
        const [splicedItem] = leftBak.splice(targetIndex, 1, draggedItem);
        leftBak[draggedIndex] = splicedItem;
        setLeft(leftBak);
      }
      if (targetId === "right-container") {
        leftBak.splice(draggedIndex, 1);
        rightBak.push(draggedItem);
        setLeft(leftBak);
        setRight(rightBak);
      }
      if (rightIds.includes(targetId)) {
        const targetIndex = rightIds.indexOf(targetId);
        leftBak.splice(draggedIndex, 1);
        rightBak.splice(targetIndex, 0, draggedItem);
        setLeft(leftBak);
        setRight(rightBak);
      }
    } else {
      if (targetId === "right-container") {
        rightBak.splice(draggedIndex, 1);
        rightBak.push(draggedItem);
        setRight(rightBak);
      }
      if (rightIds.includes(targetId) && draggedId !== targetId) {
        const targetIndex = rightIds.indexOf(targetId);
        const [splicedItem] = rightBak.splice(targetIndex, 1, draggedItem);
        rightBak[draggedIndex] = splicedItem;
        setRight(rightBak);
      }
      if (targetId === "left-container") {
        rightBak.splice(draggedIndex, 1);
        leftBak.push(draggedItem);
        setLeft(leftBak);
        setRight(rightBak);
      }
      if (leftIds.includes(targetId)) {
        const targetIndex = leftIds.indexOf(targetId);
        rightBak.splice(draggedIndex, 1);
        leftBak.splice(targetIndex, 0, draggedItem);
        setLeft(leftBak);
        setRight(rightBak);
      }
    }
    setDraggedId("0");
    setDragOverId(null);
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
              opacity: draggedId === d.id ? 0.2 : 1,
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
        {right.map((d, i) => (
          <div
            id={d.id}
            key={d.id}
            draggable={true}
            onDragStart={(e) => onDragStartHandler("right", i, e)}
            style={{
              opacity: draggedId === d.id ? 0.2 : 1,
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
