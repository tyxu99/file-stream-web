export interface IBlock {
  id?: number;
  pid?: number;
  dashed?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const bezierTwoBlock = (
  context: CanvasRenderingContext2D,
  blockA: IBlock,
  blockB: IBlock,
  type: "lr" | "bt" | "br" | "tr",
) => {
  const drawRect = (context: CanvasRenderingContext2D) => {};
  const drawCurve = (context: CanvasRenderingContext2D) => {};

  const draw = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    drawRect(context);
    drawCurve(context);
  };
};

export default bezierTwoBlock;
