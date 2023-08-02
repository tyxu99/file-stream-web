import React, { useState, FC } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./index.module.scss";

const WORD_TYPE = {
  adj: "adj",
  verb: "verb",
};

const Classification = ({ type, title }: any) => {
  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept: type,
      drop(_item: any, monitor: any) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(delta.x);
        const top = Math.round(delta.y);
        console.log("top, left", top, left);
        return { top, left };
      },
      canDrop: (_item, monitor) => {
        const item = monitor.getItem() as any;
        return item.type === type;
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  );

  return (
    <div className={styles["word_drop_container"]}>
      <div className={styles["word_drop_text"]}>{title}</div>
      <div
        className={styles["word_drop"]}
        ref={drop}
        style={{
          backgroundColor: canDrop ? "rgba(7,193,96,0.3)" : "transparent",
        }}
      ></div>
    </div>
  );
};

const Word: FC = ({ type, text, id }: any) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [{ isDragging }, drag]: any = useDrag(() => ({
    type,
    item: { id, type },
    end(item, monitor) {
      let top = 0,
        left = 0;
      if (monitor.didDrop()) {
        const dropRes = monitor.getDropResult() as any; //获取拖拽对象所处容器的数据
        console.log("dropRes", dropRes);
        if (dropRes) {
          top = dropRes.top;
          left = dropRes.left;
        }
        setOffsetX((offsetX) => offsetX + left);
        setOffsetY((offsetY) => offsetY + top);
      } else {
        setOffsetX(0);
        setOffsetY(0);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      id={id}
      ref={drag}
      className={styles["word_drag"]}
      style={{
        opacity: isDragging ? 0 : 1,
        top: `${offsetY}px`,
        left: `${offsetX}px`,
      }}
    >
      {text}
    </div>
  );
};

const WordClassification = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles["word-container"]}>
        <h2>任意拖拽</h2>
        <div className={styles["word_drop_group"]}>
          {[
            {
              title: "形容词",
              type: WORD_TYPE.adj,
            },
            {
              title: "动词",
              type: WORD_TYPE.verb,
            },
          ].map((each, index) => (
            <Classification
              type={each.type}
              title={each.title}
              key={"classification" + index}
            />
          ))}
        </div>

        <div className={styles["word_drag_group"]}>
          {[
            {
              text: "interesting",
              type: WORD_TYPE.adj,
            },
            {
              text: "interest",
              type: WORD_TYPE.verb,
            },
            {
              text: "forget",
              type: WORD_TYPE.verb,
            },
            {
              text: "interested",
              type: WORD_TYPE.adj,
            },
          ].map((each, index) => {
            return (
              <Word
                // @ts-ignore
                text={each.text}
                type={each.type}
                id={"drag" + index}
                key={"word" + index}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};

export default WordClassification;
