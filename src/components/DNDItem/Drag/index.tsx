import { useDrag } from "react-dnd";
import React, { useState } from "react";

const DragItem = ({ children, id }: any) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [{ isDragging, offset }, drag]: any = useDrag(() => ({
    type: "block",
    item: { id, type: "block" },
    end(item, monitor) {
      let top = 0,
        left = 0;
      console.log(
        "getDifferenceFromInitialOffset",
        monitor.getDifferenceFromInitialOffset(),
      );
      // if (monitor.didDrop()) {
      //   const dropRes = monitor.getDropResult() as any; //获取拖拽对象所处容器的数据
      //   if (dropRes) {
      //     top = dropRes.top;
      //     left = dropRes.left;
      //   }
      //   setOffsetX((offsetX) => offsetX + left);
      //   setOffsetY((offsetY) => offsetY + top);
      // } else {
      //   setOffsetX(0);
      //   setOffsetY(0);
      // }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return <div ref={drag}>{children}</div>;
};

export default DragItem;
