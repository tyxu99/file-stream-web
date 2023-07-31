import styles from "./index.module.scss";
import { useEffect, useState } from "react";

const blockData = [
  {
    x: 0,
    y: 0,
    width: 180,
    height: 100,
    color: "deepskyblue",
  },
  {
    x: 500,
    y: 500,
    width: 200,
    height: 100,
    color: "deeppink",
  },
];

/**
 * canvas的宽高和CSS样式中的宽高不一致会导至图像模糊
 *
 * 在canvas中，canvas.width和canvas.style.width是两个不同的值。
 *
 * canvas就像一张图片，canvas.width是画布的宽，就像当于图片的实际宽，
 * canvas.style.width则是canvas样式的宽，就像当于给图片设置CSS样式改变宽一样，
 * 浏览器会把画布的宽缩放到canvas.style.width规定的宽，
 * 当canvas.width与canvas.style.width不一致，就会导至画布被缩放，
 * 同理，canvas.style.height也一样。
 * @constructor
 */

const Index = () => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // const [store, setStore] = useState({
  //   isPointerInA: false,
  //   isPointerInB: false,
  // });

  const store: any = {};
  useEffect(() => {
    if (document) {
      const canvas: any = document.getElementById("bezier-canvas");
      const context = canvas.getContext("2d");

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      console.log(width, height);
      setCanvasWidth(width);
      setCanvasHeight(height);
      setTimeout(() => {
        draw(context, width, height);

        canvas.addEventListener("pointerdown", (e: any) => {
          // 判断坐标是否在图形之内
          const clientX = e.clientX;
          const clientY = e.clientY;
          // canvas 画布的偏移
          const bound = canvas.getBoundingClientRect();
          // 点击坐标
          const clickX = clientX - bound.left;
          const clickY = clientY - bound.top;

          // 缩放比例
          const scaleX = width / bound.width;
          const scaleY = height / bound.height;
          // 转换为canvas坐标
          const x = clickX * scaleX;
          const y = clickY * scaleY;

          isPointerInSquare(x, y);
          // 记住鼠标点击位置
          store.clientX = x;
          store.clientY = y;
          // 目标元素
          console.log(store);

          store.dataMatch = blockData[Number(store.isPointerInB)];
          // 记住初始位置
          store.originX = store.dataMatch.x;
          store.originY = store.dataMatch.y;
          // 记住缩放比例
          store.scaleX = scaleX;
          store.scaleY = scaleY;
        });
        document.addEventListener(
          "pointermove",
          (event: any) => {
            if (!store.isPointerInA && !store.isPointerInB) {
              return;
            }

            event.preventDefault();
            // 需要移动的坐标
            const dataMatch = store.dataMatch;
            // 此时的偏移大小
            const moveBound = event.target.getBoundingClientRect();
            const distanceX =
              (event.clientX - store.clientX - moveBound.left) * store.scaleX;
            const distanceY =
              (event.clientY - store.clientY - moveBound.top) * store.scaleY;

            console.log("distanceX", event.clientX, store.clientX);

            dataMatch.x = store.originX + distanceX;
            dataMatch.y = store.originY + distanceY;

            // 边界判断
            if (dataMatch.x < 0) {
              dataMatch.x = 0;
            } else if (dataMatch.x + dataMatch.width > width) {
              dataMatch.x = width - dataMatch.width;
            }

            if (dataMatch.y < 0) {
              dataMatch.y = 0;
            } else if (dataMatch.y + dataMatch.height > height) {
              dataMatch.y = height - dataMatch.height;
            }
            // 重新绘制
            draw(context, width, height);
          },
          {
            passive: false,
          },
        );
        document.addEventListener("pointerup", function () {
          store.isPointerInA = false;
          store.isPointerInB = false;
        });
      }, 0);
    }
  }, []);

  const drawRect = (context: any) => {
    blockData.forEach((d) => {
      context.beginPath();
      context.fillStyle = d.color;
      context.fillRect(d.x, d.y, d.width, d.height);
      context.closePath();
    });
  };

  const drawCurve = (context: any) => {
    const dataSorted = blockData.sort(
      (a, b) => a.y + a.height - (b.y + b.height),
    );
    const from = dataSorted[0];
    const to = dataSorted[1];
    const fromX = from.x + from.width;
    const fromY = from.y + from.height / 2;
    const toX = to.x;
    const toY = to.y + to.height / 2;

    const cp1x = fromX + (toX - fromX) / 2;
    const cp1y = fromY;
    const cp2x = toX - (toX - fromX) / 2;
    const cp2y = toY;

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "#000";
    context.moveTo(fromX, fromY);
    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toX, toY);
    context.stroke();
  };

  const draw = (context: any, width: number, height: number) => {
    context.clearRect(0, 0, width, height);
    drawRect(context);
    drawCurve(context);
  };

  const isPointerInSquare = (x: number, y: number) => {
    store.isPointerInA = false;
    store.isPointerInB = false;
    blockData.forEach((d, i) => {
      if (!(x < d.x || x > d.x + d.width || y < d.y || y > d.y + d.height)) {
        store["isPointerIn" + ["A", "B"][i]] = true;
      }
    });
  };

  return (
    <canvas
      id="bezier-canvas"
      width={canvasWidth}
      height={canvasHeight}
      className={styles.canvasBezier}
    ></canvas>
  );
};

export default Index;
