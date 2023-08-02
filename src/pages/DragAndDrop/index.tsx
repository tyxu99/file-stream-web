import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./index.module.scss";
import { useState } from "react";
import CardSort from "@/components/DragSort";

const DragItem = ({
  id,
  text,
  type,
}: {
  id: string;
  text: string;
  type: string;
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => {
      let top = 0,
        left = 0;
      if (monitor.didDrop()) {
        const dropRes: any = monitor.getDropResult();
        console.log("dropRes", dropRes);
        if (dropRes) {
          top = dropRes.top;
          left = dropRes.left;
        }
        setOffsetX((c) => c + left);
        setOffsetY((c) => c + top);
      } else {
        setOffsetX(0);
        setOffsetY(0);
      }
    },
  }));

  return (
    <div
      id={id}
      ref={drag}
      className={styles.dragItem}
      style={{
        opacity: isDragging ? 0 : 1,
        top: offsetY + "px",
        left: offsetX + "px",
      }}
    >
      {text}
    </div>
  );
};

const DropDown = ({ type }: { type: string }) => {
  const [{ canDrop }, drop] = useDrop(() => ({
    accept: type,
    canDrop: (item, monitor: any) => {
      const _item = monitor.getItem();
      return _item.type === type;
    },
    collect: (monitor) => ({ canDrop: monitor.canDrop() }),
    drop: (item, monitor) => {
      const delta: any = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(delta.x);
      const top = Math.round(delta.y);
      return { top, left };
    },
  }));
  return (
    <div
      ref={drop}
      className={styles.dropDown}
      style={{ background: canDrop ? "lightyellow" : "transparent" }}
    ></div>
  );
};

const DragAndDrop = () => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.wrapper}>
          <div className={styles.dragZone}>
            {[
              { title: "a", type: "block" },
              { title: "b", type: "line" },
              { title: "c", type: "block" },
              { title: "d", type: "line" },
            ].map((d, i) => (
              <DragItem key={i} id={d.title + i} text={d.title} type={d.type} />
            ))}
          </div>
          <div className={styles.dropZone}>
            {["block", "line"].map((d, i) => (
              <DropDown key={i} type={d} />
            ))}
          </div>
        </div>
      </DndProvider>
      <CardSort />
    </>
  );
};

export default DragAndDrop;
