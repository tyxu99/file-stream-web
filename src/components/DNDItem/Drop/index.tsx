import { useDrop } from "react-dnd";

const Drop = ({ children }: any) => {
  const [status, drop] = useDrop(
    () => ({
      accept: "block",
      drop(_item: any, monitor: any) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(delta.x);
        const top = Math.round(delta.y);
        return { top, left };
      },
      canDrop: (_item, monitor) => {
        const item = monitor.getItem() as any;
        return item.type === "block";
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        offset: monitor.getDifferenceFromInitialOffset(),
      }),
    }),
    [],
  );
  console.log(status);
  return <div ref={drop}>{children}</div>;
};

export default Drop;
