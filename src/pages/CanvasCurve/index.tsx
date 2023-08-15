import { useEffect, useState } from "react";

const Index = () => {
  // const [beginPoint, setBeginPoint] = useState<any>();
  // const [points, setPoints] = useState<any>([]);

  let context: any = null,
    isDown = false,
    beginPoint = {},
    points: any = [];

  const getPos = (e: any) => ({ x: e.clientX - 300, y: e.clientY - 60 });

  const drawLine = (beginPoint: any, controlPoint: any, endPoint: any) => {
    context.beginPath();
    context.moveTo(beginPoint.x, beginPoint.y);
    context.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      endPoint.x,
      endPoint.y,
    );
    context.stroke();
    context.closePath();
  };

  useEffect(() => {
    if (document) {
      const canvas: any = document.getElementById("curve-canvas");
      if (canvas && canvas.getContext) {
        const ctx = canvas.getContext("2d");
        context = ctx;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        canvas.onmousedown = (e: any) => {
          isDown = true;
          const { x, y } = getPos(e);
          points.push({ x, y });
          beginPoint = { x, y };
          console.log("mousedown", x, y);
        };
        canvas.onmousemove = (e: any) => {
          if (!isDown) return;
          const { x, y } = getPos(e);
          points.push({ x, y });
          console.log("mouse move", points);
          if (points.length > 3) {
            const lastTwoPoints = points.slice(-2);
            const controlPoint = lastTwoPoints[0];
            const endPoint = {
              x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
              y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
            };
            drawLine(beginPoint, controlPoint, endPoint);
            beginPoint = endPoint;
          }
        };
        canvas.onmouseup = (e: any) => {
          isDown = false;
        };
      }
    }
  }, [isDown]);

  return (
    <canvas
      id="curve-canvas"
      width={600}
      height={400}
      style={{ border: "1px solid blue" }}
    ></canvas>
  );
};

export default Index;
